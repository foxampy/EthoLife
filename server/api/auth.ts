import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, isDatabaseConfigured } from '../database-postgres';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
const generateToken = (userId: string | number, email: string, role: string = 'user') => {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Check database connection
const checkDatabase = () => {
  if (!isDatabaseConfigured()) {
    return { error: 'Database not configured. Please set DATABASE_URL in environment variables.' };
  }
  return null;
};

// Register with email/password
router.post('/register', async (req, res) => {
  try {
    // Check database configuration
    const dbError = checkDatabase();
    if (dbError) {
      console.error('[Auth] Database not configured');
      return res.status(503).json({ error: 'Server not configured properly. Please contact support.' });
    }
    
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email exists
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      `INSERT INTO users (email, password_hash, name, created_at, role) 
       VALUES ($1, $2, $3, NOW(), 'user') 
       RETURNING id, email, name, role`,
      [email, passwordHash, name]
    );

    const user = result[0];
    const token = generateToken(user.id, user.email, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    // Check database configuration
    const dbError = checkDatabase();
    if (dbError) {
      console.error('[Auth] Database not configured');
      return res.status(503).json({ error: 'Server not configured properly. Please contact support.' });
    }
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const users = await query(
      'SELECT id, email, name, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    const token = generateToken(user.id, user.email, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Telegram auth - support both endpoints
router.post('/telegram', async (req, res) => {
  await handleTelegramAuth(req, res);
});

router.post('/telegram-auth', async (req, res) => {
  await handleTelegramAuth(req, res);
});

async function handleTelegramAuth(req: any, res: any) {
  try {
    // Check database configuration
    const dbError = checkDatabase();
    if (dbError) {
      console.error('[Auth] Database not configured');
      return res.status(503).json({ error: 'Server not configured properly. Please contact support.' });
    }
    
    const { telegram_id, telegram_username, first_name, last_name } = req.body;

    if (!telegram_id) {
      return res.status(400).json({ error: 'Telegram ID is required' });
    }

    // Check if user exists by telegram_id
    let users = await query(
      'SELECT id, email, name, role FROM users WHERE telegram_id = $1',
      [telegram_id.toString()]
    );

    let user;

    if (users.length === 0) {
      // Create new user
      const name = `${first_name || ''} ${last_name || ''}`.trim() || telegram_username || 'Telegram User';
      const email = `tg_${telegram_id}@ethoslife.local`;
      const passwordHash = await bcrypt.hash(require('crypto').randomBytes(32).toString('hex'), 10);

      const result = await query(
        `INSERT INTO users (email, password_hash, name, telegram_id, telegram_username, created_at, role) 
         VALUES ($1, $2, $3, $4, $5, NOW(), 'user') 
         RETURNING id, email, name, role`,
        [email, passwordHash, name, telegram_id.toString(), telegram_username]
      );

      user = result[0];
    } else {
      user = users[0];
      // Update telegram_username if changed
      if (telegram_username) {
        await query(
          'UPDATE users SET telegram_username = $1 WHERE id = $2',
          [telegram_username, user.id]
        );
      }
    }

    const token = generateToken(user.id, user.email, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Telegram auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Get fresh user data
    const users = await query(
      'SELECT id, email, name, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      valid: true,
      user: users[0],
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const users = await query(
      'SELECT id, email, name, role, telegram_username, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Google OAuth callback
router.post('/google', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'Google OAuth not configured' });
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Google token error:', tokenData);
      return res.status(400).json({ error: 'Failed to exchange code for tokens' });
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userResponse.json();

    if (!userResponse.ok) {
      console.error('Google user info error:', googleUser);
      return res.status(400).json({ error: 'Failed to get user info from Google' });
    }

    // Check if user exists
    let users = await query(
      'SELECT id, email, name, role FROM users WHERE email = $1',
      [googleUser.email]
    );

    let user;

    if (users.length === 0) {
      // Create new user
      const passwordHash = await bcrypt.hash(require('crypto').randomBytes(32).toString('hex'), 10);
      
      const result = await query(
        `INSERT INTO users (email, password_hash, name, created_at, role) 
         VALUES ($1, $2, $3, NOW(), 'user') 
         RETURNING id, email, name, role`,
        [googleUser.email, passwordHash, googleUser.name]
      );

      user = result[0];
    } else {
      user = users[0];
    }

    const token = generateToken(user.id, user.email, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

export default router;
