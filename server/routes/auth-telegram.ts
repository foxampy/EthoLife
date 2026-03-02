import { Router } from 'express';
import crypto from 'crypto';
import { supabase, createUserProfile, getUserByTelegramId } from '../../supabase/client';
import { generateToken } from '../../middleware/auth';

const router = Router();

/**
 * Валидация Telegram initData
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
function validateTelegramData(initData: string, botToken: string): {
  valid: boolean;
  user?: any;
  error?: string;
} {
  try {
    // Парсим initData
    const urlParams = new URLSearchParams(initData);
    
    // Получаем hash
    const receivedHash = urlParams.get('hash');
    if (!receivedHash) {
      return { valid: false, error: 'No hash provided' };
    }

    // Удаляем hash из данных для проверки
    urlParams.delete('hash');
    
    // Сортируем параметры
    const sortedParams = Array.from(urlParams.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Создаём data check string
    const dataCheckString = sortedParams;

    // Создаём ключ для HMAC
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Создаём hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Проверяем hash
    if (calculatedHash !== receivedHash) {
      return { valid: false, error: 'Invalid hash' };
    }

    // Проверяем время (защита от replay attacks)
    const authDate = urlParams.get('auth_date');
    if (authDate) {
      const authTime = parseInt(authDate, 10);
      const now = Math.floor(Date.now() / 1000);
      const hour = 60 * 60;

      // Данные не старше 1 часа
      if (now - authTime > hour) {
        return { valid: false, error: 'Data expired' };
      }
    }

    // Получаем данные пользователя
    const userParam = urlParams.get('user');
    if (!userParam) {
      return { valid: false, error: 'No user data' };
    }

    const user = JSON.parse(decodeURIComponent(userParam));

    return { valid: true, user };
  } catch (error) {
    console.error('Telegram validation error:', error);
    return { valid: false, error: 'Validation failed' };
  }
}

/**
 * POST /api/auth/telegram
 * Telegram WebApp аутентификация
 */
router.post('/', async (req, res) => {
  try {
    const { initData } = req.body;

    if (!initData) {
      return res.status(400).json({ error: 'InitData required' });
    }

    // Получаем токен бота из env
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN not configured');
      return res.status(500).json({ error: 'Telegram not configured' });
    }

    // Валидируем данные
    const validation = validateTelegramData(initData, botToken);
    
    if (!validation.valid) {
      return res.status(401).json({ error: validation.error });
    }

    const telegramUser = validation.user;
    const telegramId = telegramUser.id;

    // Ищем пользователя по Telegram ID
    let profile = await getUserByTelegramId(telegramId);

    let isNewUser = false;

    if (!profile) {
      // Пользователь новый - создаём
      isNewUser = true;

      // Генерируем уникальный email
      const email = `tg_${telegramId}@ethoslife.com`;
      
      // Создаём пользователя в Supabase Auth
      const randomPassword = crypto.randomBytes(32).toString('hex');
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: randomPassword,
      });

      if (authError || !authData.user) {
        console.error('Auth error:', authError);
        return res.status(400).json({ error: 'Failed to create user' });
      }

      // Создаём профиль
      const name = `${telegramUser.first_name}${telegramUser.last_name ? ' ' + telegramUser.last_name : ''}`;
      
      await createUserProfile({
        id: authData.user.id,
        email,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        username: telegramUser.username || `user_${telegramId}`,
        name,
        telegram_id: telegramId,
        telegram_username: telegramUser.username,
        telegram_connected: true,
        avatar_url: telegramUser.photo_url,
      });

      profile = {
        id: authData.user.id,
        email,
        name,
        telegram_id: telegramId,
        telegram_username: telegramUser.username,
        telegram_connected: true,
        role: 'user',
        subscription_tier: 'free',
      };
    } else {
      // Пользователь существует - обновляем данные
      await supabase
        .from('profiles')
        .update({
          telegram_username: telegramUser.username,
          telegram_connected: true,
          last_login_at: new Date().toISOString(),
        })
        .eq('telegram_id', telegramId);
    }

    // Генерируем JWT токен
    const token = generateToken({
      id: profile.id,
      email: profile.email,
      role: profile.role,
      subscription_tier: profile.subscription_tier,
      telegram_id: telegramId,
    });

    res.json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        username: profile.username,
        role: profile.role,
        subscription_tier: profile.subscription_tier,
        telegram_connected: profile.telegram_connected,
        telegram_username: profile.telegram_username,
      },
      token,
      isNewUser,
    });
  } catch (error) {
    console.error('Telegram auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * POST /api/auth/telegram/link
 * Привязка Telegram к существующему аккаунту
 */
router.post('/link', async (req, res) => {
  try {
    const { initData, userId } = req.body;

    if (!initData || !userId) {
      return res.status(400).json({ error: 'InitData and userId required' });
    }

    // Получаем токен бота
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({ error: 'Telegram not configured' });
    }

    // Валидируем данные
    const validation = validateTelegramData(initData, botToken);
    if (!validation.valid) {
      return res.status(401).json({ error: validation.error });
    }

    const telegramId = validation.user.id;

    // Проверяем, не привязан ли уже этот Telegram к другому аккаунту
    const existingProfile = await getUserByTelegramId(telegramId);
    if (existingProfile && existingProfile.id !== userId) {
      return res.status(400).json({ error: 'Telegram already linked to another account' });
    }

    // Привязываем Telegram к аккаунту
    await supabase
      .from('profiles')
      .update({
        telegram_id: telegramId,
        telegram_connected: true,
        telegram_username: validation.user.username,
      })
      .eq('id', userId);

    res.json({
      success: true,
      message: 'Telegram linked successfully',
    });
  } catch (error) {
    console.error('Telegram link error:', error);
    res.status(500).json({ error: 'Failed to link Telegram' });
  }
});

export default router;
