import { Telegraf, Context, Markup } from 'telegraf';
import { userDb, profileDb, dailyPlanDb, healthMetricsDb, goalsDb, telegramBotSettingsDb, telegramBotLogsDb } from './database-adapter';

// Telegram Bot Token (must be set via environment variable)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
  console.warn('TELEGRAM_BOT_TOKEN not set. Telegram bot will not be initialized.');
}

let bot: Telegraf | null = null;

if (TELEGRAM_BOT_TOKEN) {
  bot = new Telegraf(TELEGRAM_BOT_TOKEN);

  // Start command
  bot.start(async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    const startTime = Date.now();
    console.log(`📨 /start command received from ${telegramId} at ${new Date().toISOString()}`);

    try {
      // Check if user exists
      let user = await userDb.findByTelegramId(telegramId);
      const isNewUser = !user;
      console.log(`👤 User lookup: ${isNewUser ? 'new' : 'existing'} (${Date.now() - startTime}ms)`);

      if (!user) {
        // Create new user
        const result = await userDb.create({
          name: ctx.from.first_name + (ctx.from.last_name ? ` ${ctx.from.last_name}` : ''),
          telegram_id: telegramId,
          telegram_username: ctx.from.username || undefined,
        });
        user = await userDb.findById(Number(result.lastInsertRowid || result.id));
        
        // Create empty profile for new user
        if (user) {
          await profileDb.createOrUpdate(user.id, {
            // Profile will be empty initially, user can fill it later
          });
        }
        
        // Initialize bot settings
        await telegramBotSettingsDb.createOrUpdate(user.id, {
          notifications_enabled: true,
          reminders_enabled: true,
          metric_tracking_enabled: true,
        });
      }

      // Special greetings for specific users
      if (telegramId === '403161451' && isNewUser) {
      // Maria's first time greeting
      await ctx.reply(
        `Привет Марьяша! 👋\n\n` +
        `Это твой личный центр здоровья и ежедневных привычек 💚\n\n` +
        `И, кстати, Тимур тебя очень сильно любит и поздравляет с 14 февраля! 💕\n` +
        `(Хоть и с опозданием, не держи на него зла 😅)\n\n` +
        `Здесь ты сможешь:\n` +
        `• Получать напоминания о разминках\n` +
        `• Отмечать выполненные упражнения\n` +
        `• Вносить метрики здоровья\n` +
        `• Следить за планом на день\n` +
        `• Получать персональные рекомендации\n\n` +
        `Используйте /menu для быстрого доступа к функциям.`
      );
    } else if (telegramId === '403161451') {
      // Maria's returning greeting
      await ctx.reply(
        `С возвращением, Марьяша! 👋\n\n` +
        `Твой центр здоровья готов помочь тебе сегодня.\n\n` +
        `Используйте /menu для быстрого доступа.`
      );
    } else if (telegramId === '8530599793' && isNewUser) {
      // Personal greeting for backup account
      await ctx.reply(
        `Привет! 👋\n\n` +
        `Добро пожаловать в твой личный центр здоровья и ежедневных привычек 💚\n\n` +
        `Это твой персональный аккаунт для тестирования всех возможностей платформы!\n\n` +
        `Здесь ты сможешь:\n` +
        `• Получать напоминания о разминках\n` +
        `• Отмечать выполненные упражнения\n` +
        `• Вносить метрики здоровья\n` +
        `• Следить за планом на день\n` +
        `• Получать персональные рекомендации\n` +
        `• Тестировать все функции платформы\n\n` +
        `Используйте /menu для быстрого доступа к функциям.`
      );
    } else if (telegramId === '8530599793') {
      // Backup account returning greeting
      await ctx.reply(
        `С возвращением! 👋\n\n` +
        `Твой центр здоровья готов помочь тебе сегодня.\n\n` +
        `Используйте /menu для быстрого доступа.`
      );
    } else if (isNewUser) {
      await ctx.reply(
        `Добро пожаловать в EthosLife, ${ctx.from.first_name}! 👋\n\n` +
        `Это твой центр здоровья, как экосистемной привычки и детальной аналитики 💚\n\n` +
        `Ваш аккаунт создан. Теперь вы можете:\n` +
        `• Получать напоминания о планах\n` +
        `• Отмечать выполненные задачи\n` +
        `• Вносить метрики здоровья\n` +
        `• Получать рекомендации\n\n` +
        `Используйте /menu для быстрого доступа к функциям.`
      );
      } else {
        await ctx.reply(
          `С возвращением, ${ctx.from.first_name}! 👋\n\n` +
          `Используйте /menu для быстрого доступа.`
        );
      }
    } catch (error) {
      console.error('Error in /start command:', error);
      await ctx.reply('Произошла ошибка при обработке команды. Пожалуйста, попробуйте позже.');
    }
  });

  // Help command
  bot.help(async (ctx: Context) => {
    await ctx.reply(
      `📋 Доступные команды:\n\n` +
      `• /start - Начать работу с ботом\n` +
      `• /app - Открыть приложение EthosLife\n` +
      `• /help - Показать эту справку\n` +
      `• /settings - Настройки уведомлений\n` +
      `• /today - План на сегодня\n` +
      `• /metrics - Внести метрики\n` +
      `• /goals - Мои цели\n` +
      `• /complete <номер> - Отметить задачу выполненной\n` +
      `• /note <текст> - Добавить заметку\n\n` +
      `💡 Вы также можете использовать кнопки меню для быстрого доступа.`
    );
  });

  // Open WebApp command
  bot.command('app', async (ctx: Context) => {
    const webAppUrl = process.env.WEBAPP_URL || 'https://etholife.onrender.com';
    
    await ctx.reply(
      `🚀 Откройте EthosLife для полного доступа ко всем функциям:\n\n` +
      `• Персональный дашборд здоровья\n` +
      `• AI-ассистент\n` +
      `• Каталог специалистов\n` +
      `• Социальная сеть\n` +
      `• И многое другое!`,
      Markup.inlineKeyboard([
        Markup.button.webApp('🚀 Открыть EthosLife', webAppUrl)
      ])
    );
  });

  // Settings command
  bot.command('settings', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.reply('Пожалуйста, сначала используйте /start');
        return;
      }

      const settings = await telegramBotSettingsDb.findByUserId(user.id);
    
    await ctx.reply(
      `⚙️ Настройки уведомлений:\n\n` +
      `Уведомления: ${settings?.notifications_enabled ? '✅ Включены' : '❌ Выключены'}\n` +
      `Напоминания: ${settings?.reminders_enabled ? '✅ Включены' : '❌ Выключены'}\n` +
      `Отслеживание метрик: ${settings?.metric_tracking_enabled ? '✅ Включено' : '❌ Выключено'}\n\n` +
      `Время напоминаний: ${settings?.reminder_times?.join(', ') || '08:00, 12:00, 18:00'}\n\n` +
      `Используйте кнопки для изменения настроек.`
    );
    } catch (error) {
      console.error('Error in /settings command:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  });

  // Dashboard command - shows overview of all health directions
  bot.command('dashboard', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.reply('Пожалуйста, сначала используйте /start');
        return;
      }

      const today = new Date();
      const plans = await dailyPlanDb.findByUserIdAndDate(user.id, today);
      const goals = await goalsDb.findByUserId(user.id);
      const activeGoals = goals.filter(g => !g.completed);

      const completedPlans = plans.filter(p => p.completed).length;
      const totalPlans = plans.length;
      const progressPercent = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0;

      let message = `📊 Дашборд здоровья\n\n`;
      message += `📅 Сегодня (${today.toLocaleDateString('ru-RU')}):\n`;
      message += `   Выполнено: ${completedPlans}/${totalPlans} задач (${progressPercent}%)\n\n`;
      
      if (activeGoals.length > 0) {
        message += `🎯 Активные цели: ${activeGoals.length}\n`;
        activeGoals.slice(0, 3).forEach((goal, idx) => {
          const progress = goal.target_value ? Math.round((goal.current_value / goal.target_value) * 100) : 0;
          message += `   ${idx + 1}. ${goal.title} - ${progress}%\n`;
        });
        if (activeGoals.length > 3) {
          message += `   ... и еще ${activeGoals.length - 3}\n`;
        }
        message += `\n`;
      }

      message += `💡 Используйте /menu для быстрого доступа к функциям.`;

      await ctx.reply(message);
    } catch (error) {
      console.error('Error in /dashboard command:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  });

  // Today's plan command
  bot.command('today', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.reply('Пожалуйста, сначала используйте /start');
        return;
      }

      const today = new Date();
      const plans = await dailyPlanDb.findByUserIdAndDate(user.id, today);

    if (plans.length === 0) {
      await ctx.reply('📅 На сегодня планов нет. Отдыхайте! 😊');
      return;
    }

    let message = `📅 План на сегодня (${today.toLocaleDateString('ru-RU')}):\n\n`;
    plans.forEach((plan, idx) => {
      const status = plan.completed ? '✅' : '⏳';
      const time = plan.time ? `${plan.time} - ` : '';
      message += `${status} ${idx + 1}. ${time}${plan.title}\n`;
      if (plan.description) {
        message += `   ${plan.description}\n`;
      }
    });

      message += `\nИспользуйте /complete <номер> чтобы отметить задачу выполненной.`;

      await ctx.reply(message);
    } catch (error) {
      console.error('Error in /today command:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  });

  // Complete task command
  bot.command('complete', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.reply('Пожалуйста, сначала используйте /start');
        return;
      }

      const args = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ') : [];
      const taskNumber = parseInt(args[1]);

      if (isNaN(taskNumber)) {
        await ctx.reply('Пожалуйста, укажите номер задачи: /complete 1');
        return;
      }

      const today = new Date();
      const plans = await dailyPlanDb.findByUserIdAndDate(user.id, today);

      if (taskNumber < 1 || taskNumber > plans.length) {
        await ctx.reply(`Задача с номером ${taskNumber} не найдена.`);
        return;
      }

      const plan = plans[taskNumber - 1];
      await dailyPlanDb.updateCompleted(plan.id, true);

      await telegramBotLogsDb.create(user.id, {
        action_type: 'goal_completed',
        message: `Задача "${plan.title}" отмечена как выполненная`,
      });

      await ctx.reply(`✅ Задача "${plan.title}" отмечена как выполненная! 🎉`);
    } catch (error) {
      console.error('Error in /complete command:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  });

  // Metrics command
  bot.command('metrics', async (ctx: Context) => {
    await ctx.reply(
      `📊 Внесение метрик:\n\n` +
      `Используйте следующие команды:\n` +
      `• /weight <кг> - Записать вес\n` +
      `• /steps <количество> - Записать шаги\n` +
      `• /sleep <часы> - Записать сон\n` +
      `• /mood <1-10> - Записать настроение\n` +
      `• /calories <ккал> - Записать калории\n\n` +
      `Пример: /weight 57.5`
    );
  });

  // Weight command
  bot.command('weight', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.reply('Пожалуйста, сначала используйте /start');
        return;
      }

      const args = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ') : [];
      const weight = parseFloat(args[1]);

      if (isNaN(weight)) {
        await ctx.reply('Пожалуйста, укажите вес: /weight 57.5');
        return;
      }

      await healthMetricsDb.create(user.id, {
        metric_type: 'weight',
        value: weight,
        unit: 'kg',
      });

      // Update profile
      await profileDb.createOrUpdate(user.id, { weight });

      await telegramBotLogsDb.create(user.id, {
        action_type: 'metric_entry',
        message: `Вес: ${weight} кг`,
      });

      await ctx.reply(`✅ Вес ${weight} кг записан! 📊`);
    } catch (error) {
      console.error('Error in /weight command:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  });

  // Steps command
  bot.command('steps', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.reply('Пожалуйста, сначала используйте /start');
        return;
      }

      const args = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ') : [];
      const steps = parseInt(args[1]);

      if (isNaN(steps)) {
        await ctx.reply('Пожалуйста, укажите количество шагов: /steps 10000');
        return;
      }

      await healthMetricsDb.create(user.id, {
        metric_type: 'steps',
        value: steps,
        unit: 'steps',
      });

      await telegramBotLogsDb.create(user.id, {
        action_type: 'metric_entry',
        message: `Шаги: ${steps}`,
      });

      await ctx.reply(`✅ ${steps} шагов записано! 🚶`);
    } catch (error) {
      console.error('Error in /steps command:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  });

  // Sleep command
  bot.command('sleep', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.reply('Пожалуйста, сначала используйте /start');
        return;
      }

      const args = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ') : [];
      const hours = parseFloat(args[1]);

      if (isNaN(hours)) {
        await ctx.reply('Пожалуйста, укажите часы сна: /sleep 8.5');
        return;
      }

      await healthMetricsDb.create(user.id, {
        metric_type: 'sleep',
        value: hours,
        unit: 'hours',
      });

      await telegramBotLogsDb.create(user.id, {
        action_type: 'metric_entry',
        message: `Сон: ${hours} часов`,
      });

      await ctx.reply(`✅ Сон ${hours} часов записан! 😴`);
    } catch (error) {
      console.error('Error in /sleep command:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  });

  // Mood command
  bot.command('mood', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.reply('Пожалуйста, сначала используйте /start');
        return;
      }

      const args = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ') : [];
      const mood = parseInt(args[1]);

      if (isNaN(mood) || mood < 1 || mood > 10) {
        await ctx.reply('Пожалуйста, укажите настроение от 1 до 10: /mood 8');
        return;
      }

      await healthMetricsDb.create(user.id, {
        metric_type: 'mood',
        value: mood,
        unit: '/10',
      });

      await telegramBotLogsDb.create(user.id, {
        action_type: 'metric_entry',
        message: `Настроение: ${mood}/10`,
      });

      const emoji = mood >= 8 ? '😊' : mood >= 5 ? '😐' : '😔';
      await ctx.reply(`✅ Настроение ${mood}/10 записано! ${emoji}`);
    } catch (error) {
      console.error('Error in /mood command:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  });

  // Calories command
  bot.command('calories', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.reply('Пожалуйста, сначала используйте /start');
        return;
      }

      const args = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ') : [];
      const calories = parseInt(args[1]);

      if (isNaN(calories)) {
        await ctx.reply('Пожалуйста, укажите калории: /calories 2000');
        return;
      }

      await healthMetricsDb.create(user.id, {
        metric_type: 'calories',
        value: calories,
        unit: 'kcal',
      });

      await telegramBotLogsDb.create(user.id, {
        action_type: 'metric_entry',
        message: `Калории: ${calories} ккал`,
      });

      await ctx.reply(`✅ ${calories} ккал записано! 🍎`);
    } catch (error) {
      console.error('Error in /calories command:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  });

  // Goals command
  bot.command('goals', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.reply('Пожалуйста, сначала используйте /start');
        return;
      }

      const goals = await goalsDb.findByUserId(user.id);

    if (goals.length === 0) {
      await ctx.reply('🎯 У вас пока нет целей. Создайте их в приложении!');
      return;
    }

    let message = `🎯 Ваши цели:\n\n`;
    goals.forEach((goal, idx) => {
      const status = goal.completed ? '✅' : '⏳';
      message += `${status} ${idx + 1}. ${goal.title}\n`;
      if (goal.target_value) {
        const progress = goal.current_value / goal.target_value * 100;
        message += `   Прогресс: ${goal.current_value}${goal.unit || ''} / ${goal.target_value}${goal.unit || ''} (${Math.round(progress)}%)\n`;
      }
      if (goal.deadline) {
        message += `   Дедлайн: ${new Date(goal.deadline).toLocaleDateString('ru-RU')}\n`;
      }
      });

      await ctx.reply(message);
    } catch (error) {
      console.error('Error in /goals command:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  });

  // Menu command with inline keyboard
  bot.command('menu', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.reply('Пожалуйста, сначала используйте /start');
        return;
      }

      // Get today's plans count for quick info
      const today = new Date();
      const todayPlans = await dailyPlanDb.findByUserIdAndDate(user.id, today);
      const completedCount = todayPlans.filter(p => p.completed).length;
      const totalCount = todayPlans.length;

      const webAppUrl = process.env.WEBAPP_URL || 'https://etholife.onrender.com';
      
      await ctx.reply(
        `📋 Главное меню\n\n` +
        `📅 Сегодня: ${completedCount}/${totalCount} задач выполнено\n\n` +
        `Выберите действие:`,
        Markup.inlineKeyboard([
          [
            Markup.button.webApp('🚀 Открыть приложение', webAppUrl),
          ],
          [
            Markup.button.callback('📅 Сегодня', 'quick_today'),
            Markup.button.callback('📊 Метрики', 'quick_metrics'),
          ],
          [
            Markup.button.callback('🎯 Цели', 'quick_goals'),
            Markup.button.callback('📋 Расписание', 'menu_schedule'),
          ],
          [
            Markup.button.callback('🏃 Движение', 'direction_movement'),
            Markup.button.callback('🍎 Питание', 'direction_nutrition'),
          ],
          [
            Markup.button.callback('😴 Сон', 'direction_sleep'),
            Markup.button.callback('🧠 Психология', 'direction_psychology'),
          ],
          [
            Markup.button.callback('⚙️ Настройки', 'menu_settings'),
            Markup.button.callback('ℹ️ Помощь', 'menu_help'),
          ],
        ])
      );
    } catch (error) {
      console.error('Error in /menu command:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  });

  // Schedule menu
  bot.action('menu_schedule', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.answerCbQuery('Пожалуйста, сначала используйте /start');
        return;
      }

      const { Markup } = require('telegraf');
      await ctx.editMessageText(
        `📅 Расписание\n\n` +
        `Выберите период:`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback('📆 Сегодня', 'schedule_today'),
            Markup.button.callback('📅 Неделя', 'schedule_week'),
          ],
          [
            Markup.button.callback('📆 Месяц', 'schedule_month'),
            Markup.button.callback('➕ Добавить', 'schedule_add'),
          ],
          [
            Markup.button.callback('◀️ Назад', 'menu_main'),
          ],
        ])
      );
      await ctx.answerCbQuery();
    } catch (error) {
      console.error('Error in schedule menu:', error);
      await ctx.answerCbQuery('Произошла ошибка');
    }
  });

  // Schedule today
  bot.action('schedule_today', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.answerCbQuery('Пожалуйста, сначала используйте /start');
        return;
      }

      const today = new Date();
      const plans = await dailyPlanDb.findByUserIdAndDate(user.id, today);

      if (plans.length === 0) {
        await ctx.editMessageText(
          `📅 План на сегодня (${today.toLocaleDateString('ru-RU')}):\n\n` +
          `На сегодня планов нет. Отдыхайте! 😊`,
          require('telegraf').Markup.inlineKeyboard([
            [require('telegraf').Markup.button.callback('➕ Добавить план', 'schedule_add')],
            [require('telegraf').Markup.button.callback('◀️ Назад', 'menu_schedule')],
          ])
        );
      } else {
        let message = `📅 План на сегодня (${today.toLocaleDateString('ru-RU')}):\n\n`;
        plans.forEach((plan, idx) => {
          const status = plan.completed ? '✅' : '⏳';
          const time = plan.time ? `${plan.time} - ` : '';
          message += `${status} ${idx + 1}. ${time}${plan.title}\n`;
          if (plan.description) {
            message += `   ${plan.description}\n`;
          }
        });

        const { Markup } = require('telegraf');
        const buttons = [];
        plans.forEach((plan, idx) => {
          if (!plan.completed) {
            buttons.push([
              Markup.button.callback(`✅ Выполнить: ${plan.title.substring(0, 20)}`, `complete_${plan.id}`),
            ]);
          }
        });
        buttons.push([Markup.button.callback('◀️ Назад', 'menu_schedule')]);

        await ctx.editMessageText(message, Markup.inlineKeyboard(buttons));
      }
      await ctx.answerCbQuery();
    } catch (error) {
      console.error('Error in schedule today:', error);
      await ctx.answerCbQuery('Произошла ошибка');
    }
  });

  // Schedule week
  bot.action('schedule_week', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.answerCbQuery('Пожалуйста, сначала используйте /start');
        return;
      }

      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)

      const plans = await dailyPlanDb.findByUserIdAndDateRange(user.id, weekStart, weekEnd);

      if (plans.length === 0) {
        await ctx.editMessageText(
          `📅 План на неделю:\n\n` +
          `На эту неделю планов нет.`,
          require('telegraf').Markup.inlineKeyboard([
            [require('telegraf').Markup.button.callback('➕ Добавить план', 'schedule_add')],
            [require('telegraf').Markup.button.callback('◀️ Назад', 'menu_schedule')],
          ])
        );
      } else {
        // Group plans by date
        const plansByDate: Record<string, any[]> = {};
        plans.forEach(plan => {
          const date = plan.date;
          if (!plansByDate[date]) {
            plansByDate[date] = [];
          }
          plansByDate[date].push(plan);
        });

        let message = `📅 План на неделю:\n\n`;
        Object.keys(plansByDate).sort().forEach(date => {
          const dateObj = new Date(date);
          message += `\n📆 ${dateObj.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}:\n`;
          plansByDate[date].forEach((plan, idx) => {
            const status = plan.completed ? '✅' : '⏳';
            const time = plan.time ? `${plan.time} - ` : '';
            message += `${status} ${time}${plan.title}\n`;
          });
        });

        const { Markup } = require('telegraf');
        await ctx.editMessageText(
          message,
          Markup.inlineKeyboard([
            [Markup.button.callback('◀️ Назад', 'menu_schedule')],
          ])
        );
      }
      await ctx.answerCbQuery();
    } catch (error) {
      console.error('Error in schedule week:', error);
      await ctx.answerCbQuery('Произошла ошибка');
    }
  });

  // Schedule month
  bot.action('schedule_month', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.answerCbQuery('Пожалуйста, сначала используйте /start');
        return;
      }

      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const plans = await dailyPlanDb.findByUserIdAndDateRange(user.id, monthStart, monthEnd);

      if (plans.length === 0) {
        await ctx.editMessageText(
          `📅 План на месяц:\n\n` +
          `На этот месяц планов нет.`,
          require('telegraf').Markup.inlineKeyboard([
            [require('telegraf').Markup.button.callback('➕ Добавить план', 'schedule_add')],
            [require('telegraf').Markup.button.callback('◀️ Назад', 'menu_schedule')],
          ])
        );
      } else {
        // Count plans by date
        const plansByDate: Record<string, number> = {};
        plans.forEach(plan => {
          const date = plan.date;
          plansByDate[date] = (plansByDate[date] || 0) + 1;
        });

        let message = `📅 План на месяц (${today.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}):\n\n`;
        message += `Всего планов: ${plans.length}\n`;
        message += `Дней с планами: ${Object.keys(plansByDate).length}\n\n`;
        message += `Используйте "Сегодня" или "Неделя" для детального просмотра.`;

        const { Markup } = require('telegraf');
        await ctx.editMessageText(
          message,
          Markup.inlineKeyboard([
            [Markup.button.callback('📆 Сегодня', 'schedule_today')],
            [Markup.button.callback('📅 Неделя', 'schedule_week')],
            [Markup.button.callback('◀️ Назад', 'menu_schedule')],
          ])
        );
      }
      await ctx.answerCbQuery();
    } catch (error) {
      console.error('Error in schedule month:', error);
      await ctx.answerCbQuery('Произошла ошибка');
    }
  });

  // Goals menu
  bot.action('menu_goals', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.answerCbQuery('Пожалуйста, сначала используйте /start');
        return;
      }

      const goals = await goalsDb.findByUserId(user.id);

      if (goals.length === 0) {
        await ctx.editMessageText(
          `🎯 Ваши цели:\n\n` +
          `У вас пока нет целей. Создайте их в приложении!`,
          require('telegraf').Markup.inlineKeyboard([
            [require('telegraf').Markup.button.callback('◀️ Назад', 'menu_main')],
          ])
        );
      } else {
        let message = `🎯 Ваши цели:\n\n`;
        goals.forEach((goal, idx) => {
          const status = goal.completed ? '✅' : '⏳';
          message += `${status} ${idx + 1}. ${goal.title}\n`;
          if (goal.target_value) {
            const progress = goal.current_value / goal.target_value * 100;
            message += `   Прогресс: ${goal.current_value}${goal.unit || ''} / ${goal.target_value}${goal.unit || ''} (${Math.round(progress)}%)\n`;
          }
          if (goal.deadline) {
            message += `   Дедлайн: ${new Date(goal.deadline).toLocaleDateString('ru-RU')}\n`;
          }
          message += `\n`;
        });

        const { Markup } = require('telegraf');
        await ctx.editMessageText(
          message,
          Markup.inlineKeyboard([
            [Markup.button.callback('◀️ Назад', 'menu_main')],
          ])
        );
      }
      await ctx.answerCbQuery();
    } catch (error) {
      console.error('Error in goals menu:', error);
      await ctx.answerCbQuery('Произошла ошибка');
    }
  });

  // Metrics menu
  bot.action('menu_metrics', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.answerCbQuery('Пожалуйста, сначала используйте /start');
        return;
      }

      const { Markup } = require('telegraf');
      await ctx.editMessageText(
        `📊 Метрики здоровья\n\n` +
        `Выберите метрику для внесения:`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback('⚖️ Вес', 'metric_weight'),
            Markup.button.callback('👣 Шаги', 'metric_steps'),
          ],
          [
            Markup.button.callback('😴 Сон', 'metric_sleep'),
            Markup.button.callback('😊 Настроение', 'metric_mood'),
          ],
          [
            Markup.button.callback('🍎 Калории', 'metric_calories'),
          ],
          [
            Markup.button.callback('◀️ Назад', 'menu_main'),
          ],
        ])
      );
      await ctx.answerCbQuery();
    } catch (error) {
      console.error('Error in metrics menu:', error);
      await ctx.answerCbQuery('Произошла ошибка');
    }
  });

  // Notes menu
  bot.action('menu_notes', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.answerCbQuery('Пожалуйста, сначала используйте /start');
        return;
      }

      await ctx.editMessageText(
        `📝 Заметки\n\n` +
        `Для добавления заметки используйте команду:\n` +
        `/note [текст заметки]\n\n` +
        `Пример: /note Сегодня отличный день!`,
        Markup.inlineKeyboard([
          [Markup.button.callback('◀️ Назад', 'menu_main')],
        ])
      );
      await ctx.answerCbQuery();
    } catch (error) {
      console.error('Error in notes menu:', error);
      await ctx.answerCbQuery('Произошла ошибка');
    }
  });

  // Settings menu
  bot.action('menu_settings', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.answerCbQuery('Пожалуйста, сначала используйте /start');
        return;
      }

      const settings = await telegramBotSettingsDb.findByUserId(user.id);

      await ctx.editMessageText(
        `⚙️ Настройки уведомлений:\n\n` +
        `Уведомления: ${settings?.notifications_enabled ? '✅ Включены' : '❌ Выключены'}\n` +
        `Напоминания: ${settings?.reminders_enabled ? '✅ Включены' : '❌ Выключены'}\n` +
        `Отслеживание метрик: ${settings?.metric_tracking_enabled ? '✅ Включено' : '❌ Выключено'}\n\n` +
        `Время напоминаний: ${settings?.reminder_times?.join(', ') || '08:00, 12:00, 18:00'}\n\n` +
        `Используйте команду /settings для изменения настроек.`,
        Markup.inlineKeyboard([
          [Markup.button.callback('◀️ Назад', 'menu_main')],
        ])
      );
      await ctx.answerCbQuery();
    } catch (error) {
      console.error('Error in settings menu:', error);
      await ctx.answerCbQuery('Произошла ошибка');
    }
  });

  // Help menu
  bot.action('menu_help', async (ctx: Context) => {
    await ctx.editMessageText(
      `📋 Доступные команды:\n\n` +
      `• /start - Начать работу с ботом\n` +
      `• /menu - Главное меню\n` +
      `• /help - Показать справку\n` +
      `• /settings - Настройки уведомлений\n` +
      `• /today - План на сегодня\n` +
      `• /metrics - Внести метрики\n` +
      `• /goals - Мои цели\n` +
      `• /complete <номер> - Отметить задачу выполненной\n` +
      `• /note <текст> - Добавить заметку\n\n` +
      `💡 Вы также можете использовать кнопки меню для быстрого доступа.`,
      require('telegraf').Markup.inlineKeyboard([
        [require('telegraf').Markup.button.callback('◀️ Назад', 'menu_main')],
      ])
    );
    await ctx.answerCbQuery();
  });

  // Quick actions
  bot.action('quick_today', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.answerCbQuery('Пожалуйста, сначала используйте /start');
        return;
      }

      const today = new Date();
      const plans = await dailyPlanDb.findByUserIdAndDate(user.id, today);

      if (plans.length === 0) {
        await ctx.editMessageText(
          `📅 План на сегодня (${today.toLocaleDateString('ru-RU')}):\n\n` +
          `На сегодня планов нет. Отдыхайте! 😊`,
          Markup.inlineKeyboard([
            [Markup.button.callback('◀️ Назад', 'menu_main')],
          ])
        );
      } else {
        let message = `📅 План на сегодня (${today.toLocaleDateString('ru-RU')}):\n\n`;
        plans.forEach((plan, idx) => {
          const status = plan.completed ? '✅' : '⏳';
          const time = plan.time ? `${plan.time} - ` : '';
          message += `${status} ${idx + 1}. ${time}${plan.title}\n`;
          if (plan.description) {
            message += `   ${plan.description}\n`;
          }
        });

        const buttons = [];
        plans.forEach((plan) => {
          if (!plan.completed) {
            buttons.push([
              Markup.button.callback(`✅ Выполнить: ${plan.title.substring(0, 20)}`, `complete_${plan.id}`),
            ]);
          }
        });
        buttons.push([Markup.button.callback('◀️ Назад', 'menu_main')]);

        await ctx.editMessageText(message, Markup.inlineKeyboard(buttons));
      }
      await ctx.answerCbQuery();
    } catch (error) {
      console.error('Error in quick_today:', error);
      await ctx.answerCbQuery('Произошла ошибка');
    }
  });

  bot.action('quick_metrics', async (ctx: Context) => {
    await ctx.editMessageText(
      `📊 Метрики здоровья\n\n` +
      `Выберите метрику для внесения:`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback('⚖️ Вес', 'metric_weight'),
          Markup.button.callback('👣 Шаги', 'metric_steps'),
        ],
        [
          Markup.button.callback('😴 Сон', 'metric_sleep'),
          Markup.button.callback('😊 Настроение', 'metric_mood'),
        ],
        [
          Markup.button.callback('🍎 Калории', 'metric_calories'),
        ],
        [
          Markup.button.callback('◀️ Назад', 'menu_main'),
        ],
      ])
    );
    await ctx.answerCbQuery();
  });

  bot.action('quick_goals', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.answerCbQuery('Пожалуйста, сначала используйте /start');
        return;
      }

      const goals = await goalsDb.findByUserId(user.id);

      if (goals.length === 0) {
        await ctx.editMessageText(
          `🎯 Ваши цели:\n\n` +
          `У вас пока нет целей. Создайте их в приложении!`,
          Markup.inlineKeyboard([
            [Markup.button.callback('◀️ Назад', 'menu_main')],
          ])
        );
      } else {
        let message = `🎯 Ваши цели:\n\n`;
        goals.forEach((goal, idx) => {
          const status = goal.completed ? '✅' : '⏳';
          message += `${status} ${idx + 1}. ${goal.title}\n`;
          if (goal.target_value) {
            const progress = goal.current_value / goal.target_value * 100;
            message += `   Прогресс: ${goal.current_value}${goal.unit || ''} / ${goal.target_value}${goal.unit || ''} (${Math.round(progress)}%)\n`;
          }
          if (goal.deadline) {
            message += `   Дедлайн: ${new Date(goal.deadline).toLocaleDateString('ru-RU')}\n`;
          }
          message += `\n`;
        });

        await ctx.editMessageText(
          message,
          Markup.inlineKeyboard([
            [Markup.button.callback('◀️ Назад', 'menu_main')],
          ])
        );
      }
      await ctx.answerCbQuery();
    } catch (error) {
      console.error('Error in quick_goals:', error);
      await ctx.answerCbQuery('Произошла ошибка');
    }
  });

  // Health direction actions (placeholders for now)
  bot.action('direction_movement', async (ctx: Context) => {
    await ctx.editMessageText(
      `🏃 Движение\n\n` +
      `Этот раздел находится в разработке.\n` +
      `Пока используйте команды:\n` +
      `• /today - план на сегодня\n` +
      `• /metrics - внести метрики\n\n` +
      `Скоро здесь будет полный функционал для отслеживания активности!`,
      Markup.inlineKeyboard([
        [Markup.button.callback('◀️ Назад', 'menu_main')],
      ])
    );
    await ctx.answerCbQuery();
  });

  bot.action('direction_nutrition', async (ctx: Context) => {
    await ctx.editMessageText(
      `🍎 Питание\n\n` +
      `Этот раздел находится в разработке.\n` +
      `Пока используйте команды:\n` +
      `• /metrics - внести метрики (калории)\n\n` +
      `Скоро здесь будет полный функционал для отслеживания питания!`,
      Markup.inlineKeyboard([
        [Markup.button.callback('◀️ Назад', 'menu_main')],
      ])
    );
    await ctx.answerCbQuery();
  });

  bot.action('direction_sleep', async (ctx: Context) => {
    await ctx.editMessageText(
      `😴 Сон\n\n` +
      `Этот раздел находится в разработке.\n` +
      `Пока используйте команды:\n` +
      `• /metrics - внести метрики (сон)\n\n` +
      `Скоро здесь будет полный функционал для отслеживания сна!`,
      Markup.inlineKeyboard([
        [Markup.button.callback('◀️ Назад', 'menu_main')],
      ])
    );
    await ctx.answerCbQuery();
  });

  bot.action('direction_psychology', async (ctx: Context) => {
    await ctx.editMessageText(
      `🧠 Психология\n\n` +
      `Этот раздел находится в разработке.\n` +
      `Пока используйте команды:\n` +
      `• /metrics - внести метрики (настроение)\n\n` +
      `Скоро здесь будет полный функционал для отслеживания психологического состояния!`,
      Markup.inlineKeyboard([
        [Markup.button.callback('◀️ Назад', 'menu_main')],
      ])
    );
    await ctx.answerCbQuery();
  });

  // Back to main menu
  bot.action('menu_main', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.answerCbQuery('Пожалуйста, сначала используйте /start');
        return;
      }

      const { Markup } = require('telegraf');
      await ctx.editMessageText(
        `📋 Главное меню\n\n` +
        `Выберите действие:`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback('📅 Расписание', 'menu_schedule'),
            Markup.button.callback('🎯 Цели', 'menu_goals'),
          ],
          [
            Markup.button.callback('📊 Метрики', 'menu_metrics'),
            Markup.button.callback('📝 Заметки', 'menu_notes'),
          ],
          [
            Markup.button.callback('⚙️ Настройки', 'menu_settings'),
            Markup.button.callback('ℹ️ Помощь', 'menu_help'),
          ],
        ])
      );
      await ctx.answerCbQuery();
    } catch (error) {
      console.error('Error in main menu:', error);
      await ctx.answerCbQuery('Произошла ошибка');
    }
  });

  // Complete task from callback
  bot.action(/^complete_(\d+)$/, async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.answerCbQuery('Пожалуйста, сначала используйте /start');
        return;
      }

      const match = ctx.match;
      if (!match || !match[1]) return;

      const planId = parseInt(match[1]);
      await dailyPlanDb.updateCompleted(planId, true);

      const plan = await dailyPlanDb.findByUserIdAndDate(user.id, new Date());
      const foundPlan = plan.find(p => p.id === planId);

      await telegramBotLogsDb.create(user.id, {
        action_type: 'goal_completed',
        message: `Задача "${foundPlan?.title || 'неизвестная'}" отмечена как выполненная`,
      });

      await ctx.answerCbQuery('✅ Задача отмечена как выполненная!');
      
      // Refresh today's schedule by calling the handler directly
      const today = new Date();
      const plans = await dailyPlanDb.findByUserIdAndDate(user.id, today);

      if (plans.length === 0) {
        await ctx.editMessageText(
          `📅 План на сегодня (${today.toLocaleDateString('ru-RU')}):\n\n` +
          `На сегодня планов нет. Отдыхайте! 😊`,
          Markup.inlineKeyboard([
            [Markup.button.callback('➕ Добавить план', 'schedule_add')],
            [Markup.button.callback('◀️ Назад', 'menu_schedule')],
          ])
        );
      } else {
        let message = `📅 План на сегодня (${today.toLocaleDateString('ru-RU')}):\n\n`;
        plans.forEach((plan, idx) => {
          const status = plan.completed ? '✅' : '⏳';
          const time = plan.time ? `${plan.time} - ` : '';
          message += `${status} ${idx + 1}. ${time}${plan.title}\n`;
          if (plan.description) {
            message += `   ${plan.description}\n`;
          }
        });

        const buttons = [];
        plans.forEach((plan) => {
          if (!plan.completed) {
            buttons.push([
              Markup.button.callback(`✅ Выполнить: ${plan.title.substring(0, 20)}`, `complete_${plan.id}`),
            ]);
          }
        });
        buttons.push([Markup.button.callback('◀️ Назад', 'menu_schedule')]);

        await ctx.editMessageText(message, Markup.inlineKeyboard(buttons));
      }
    } catch (error) {
      console.error('Error completing task:', error);
      await ctx.answerCbQuery('Произошла ошибка');
    }
  });

  // Schedule add (placeholder - will need conversation handler)
  bot.action('schedule_add', async (ctx: Context) => {
    await ctx.editMessageText(
      `➕ Добавить план\n\n` +
      `Для добавления плана используйте команду:\n` +
      `/addplan [дата] [время] [название]\n\n` +
      `Пример: /addplan 2025-02-16 10:00 Утренняя зарядка\n\n` +
      `Или создайте план в веб-приложении.`,
      require('telegraf').Markup.inlineKeyboard([
        [require('telegraf').Markup.button.callback('◀️ Назад', 'menu_schedule')],
      ])
    );
    await ctx.answerCbQuery();
  });

  // Metric handlers (show input prompts)
  bot.action('metric_weight', async (ctx: Context) => {
    await ctx.editMessageText(
      `⚖️ Записать вес\n\n` +
      `Используйте команду:\n` +
      `/weight [кг]\n\n` +
      `Пример: /weight 57.5`,
      require('telegraf').Markup.inlineKeyboard([
        [require('telegraf').Markup.button.callback('◀️ Назад', 'menu_metrics')],
      ])
    );
    await ctx.answerCbQuery();
  });

  bot.action('metric_steps', async (ctx: Context) => {
    await ctx.editMessageText(
      `👣 Записать шаги\n\n` +
      `Используйте команду:\n` +
      `/steps [количество]\n\n` +
      `Пример: /steps 10000`,
      require('telegraf').Markup.inlineKeyboard([
        [require('telegraf').Markup.button.callback('◀️ Назад', 'menu_metrics')],
      ])
    );
    await ctx.answerCbQuery();
  });

  bot.action('metric_sleep', async (ctx: Context) => {
    await ctx.editMessageText(
      `😴 Записать сон\n\n` +
      `Используйте команду:\n` +
      `/sleep [часы]\n\n` +
      `Пример: /sleep 8.5`,
      require('telegraf').Markup.inlineKeyboard([
        [require('telegraf').Markup.button.callback('◀️ Назад', 'menu_metrics')],
      ])
    );
    await ctx.answerCbQuery();
  });

  bot.action('metric_mood', async (ctx: Context) => {
    await ctx.editMessageText(
      `😊 Записать настроение\n\n` +
      `Используйте команду:\n` +
      `/mood [1-10]\n\n` +
      `Пример: /mood 8`,
      require('telegraf').Markup.inlineKeyboard([
        [require('telegraf').Markup.button.callback('◀️ Назад', 'menu_metrics')],
      ])
    );
    await ctx.answerCbQuery();
  });

  bot.action('metric_calories', async (ctx: Context) => {
    await ctx.editMessageText(
      `🍎 Записать калории\n\n` +
      `Используйте команду:\n` +
      `/calories [ккал]\n\n` +
      `Пример: /calories 2000`,
      require('telegraf').Markup.inlineKeyboard([
        [require('telegraf').Markup.button.callback('◀️ Назад', 'menu_metrics')],
      ])
    );
    await ctx.answerCbQuery();
  });

  // Note command
  bot.command('note', async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    try {
      const user = await userDb.findByTelegramId(telegramId);
      if (!user) {
        await ctx.reply('Пожалуйста, сначала используйте /start');
        return;
      }

      const args = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ') : [];
      const note = args.slice(1).join(' ');

      if (!note) {
        await ctx.reply('Пожалуйста, укажите текст заметки: /note Сегодня отличный день!');
        return;
      }

      await healthMetricsDb.create(user.id, {
        metric_type: 'note',
        value: 0,
        notes: note,
      });

      await telegramBotLogsDb.create(user.id, {
        action_type: 'note_added',
        message: note,
      });

      await ctx.reply(`✅ Заметка добавлена! 📝\n\n"${note}"`);
    } catch (error) {
      console.error('Error in /note command:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  });

  // Error handling
  bot.catch((err, ctx) => {
    console.error('❌ Telegram bot error:', err);
    try {
      ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    } catch (replyError) {
      console.error('Failed to send error message:', replyError);
    }
  });

  // Log all incoming messages for debugging
  bot.use(async (ctx, next) => {
    const messageTime = Date.now();
    if (ctx.message && 'text' in ctx.message) {
      console.log(`📥 Message: ${ctx.message.text?.substring(0, 50)} from ${ctx.from?.id}`);
    }
    await next();
    console.log(`✅ Message processed in ${Date.now() - messageTime}ms`);
  });

  console.log('✅ Telegram bot handlers initialized');
}

export function startTelegramBot() {
  if (bot && TELEGRAM_BOT_TOKEN) {
    console.log('🚀 Launching bot with polling...');
    bot.launch({
      polling: {
        timeout: 10,
        limit: 100,
        allowedUpdates: ['message', 'callback_query'],
      },
    });
    console.log('✅ Telegram bot launched and ready to receive messages');
    
    // Start hourly reminders (async, don't block)
    setTimeout(() => {
      try {
        const { startHourlyReminders, setBot } = require('./telegram-reminders');
        setBot(bot);
        startHourlyReminders();
        console.log('✅ Hourly reminders started');
      } catch (error) {
        console.error('⚠️ Failed to start reminders:', error);
      // Don't exit, bot can work without reminders
      }
    }, 2000); // Start after 2 seconds
    
    // Graceful stop
    process.once('SIGINT', () => {
      console.log('🛑 Received SIGINT, stopping bot...');
      bot?.stop('SIGINT');
    });
    process.once('SIGTERM', () => {
      console.log('🛑 Received SIGTERM, stopping bot...');
      bot?.stop('SIGTERM');
    });
  } else {
    console.error('❌ Cannot start bot: bot or token missing');
    console.error('Bot exists:', !!bot);
    console.error('Token exists:', !!TELEGRAM_BOT_TOKEN);
  }
}

export { bot };
