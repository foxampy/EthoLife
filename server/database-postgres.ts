// Postgres database adapter for Vercel/Supabase

import { Pool } from 'pg';

// Initialize connection pool
let pool: Pool | null = null;
let connectionError: string | null = null;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!connectionString) {
      connectionError = 'DATABASE_URL or POSTGRES_URL environment variable is required';
      console.error('[Database] ERROR:', connectionError);
      throw new Error(connectionError);
    }

    try {
      pool = new Pool({
        connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });
      
      console.log('[Database] Connected successfully');
    } catch (error) {
      connectionError = `Failed to connect to database: ${error}`;
      console.error('[Database] ERROR:', connectionError);
      throw new Error(connectionError);
    }
  }
  
  return pool;
}

// Check if database is configured
export function isDatabaseConfigured(): boolean {
  return !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

// Get connection error if any
export function getConnectionError(): string | null {
  return connectionError;
}

// Simple query helper function
export async function query(text: string, params?: any[]) {
  const client = await getPool().connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}

// Initialize database schema
export async function initDatabase() {
  const client = await getPool().connect();
  
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        password_hash TEXT,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        telegram_id TEXT UNIQUE,
        telegram_username TEXT,
        telegram_connected_at TIMESTAMP,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date_of_birth DATE,
        height INTEGER,
        weight REAL,
        gender TEXT,
        blood_type TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Documents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        file_path TEXT,
        document_type TEXT DEFAULT 'medical',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Daily plans table
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        time TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, date, time, title)
      )
    `);

    // Health metrics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS health_metrics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        metric_type TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      )
    `);

    // Goals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        target_value REAL,
        current_value REAL DEFAULT 0,
        unit TEXT,
        deadline DATE,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Telegram bot settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS telegram_bot_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        notifications_enabled BOOLEAN DEFAULT TRUE,
        reminders_enabled BOOLEAN DEFAULT TRUE,
        metric_tracking_enabled BOOLEAN DEFAULT TRUE,
        reminder_times TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Telegram bot logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS telegram_bot_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        action_type TEXT NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Postgres database initialized successfully');
  } finally {
    client.release();
  }
}

// User operations
export const userDb = {
  create: async (data: { email?: string; password_hash?: string; name: string; telegram_id?: string; telegram_username?: string }) => {
    const client = await getPool().connect();
    try {
      const result = await client.query(
        `INSERT INTO users (email, password_hash, name, telegram_id, telegram_username, telegram_connected_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          data.email || null,
          data.password_hash || null,
          data.name,
          data.telegram_id || null,
          data.telegram_username || null,
          data.telegram_id ? new Date().toISOString() : null,
        ]
      );
      return { lastInsertRowid: result.rows[0].id, ...result.rows[0] };
    } finally {
      client.release();
    }
  },

  findByEmail: async (email: string) => {
    const client = await getPool().connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  },

  findByTelegramId: async (telegramId: string) => {
    const client = await getPool().connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  },

  findById: async (id: number) => {
    const client = await getPool().connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  },

  connectTelegram: async (userId: number, telegramId: string, telegramUsername?: string) => {
    const client = await getPool().connect();
    try {
      await client.query(
        `UPDATE users 
         SET telegram_id = $1, telegram_username = $2, telegram_connected_at = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [telegramId, telegramUsername || null, new Date().toISOString(), userId]
      );
    } finally {
      client.release();
    }
  },

  // Get all users with Telegram connected
  findAllWithTelegram: async () => {
    const client = await getPool().connect();
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE telegram_id IS NOT NULL AND telegram_id != \'\''
      );
      return result.rows;
    } finally {
      client.release();
    }
  },
};

// Profile operations
export const profileDb = {
  createOrUpdate: async (userId: number, data: { date_of_birth?: Date; height?: number; weight?: number; gender?: string; blood_type?: string }) => {
    const client = await getPool().connect();
    try {
      const existing = await client.query('SELECT id FROM user_profiles WHERE user_id = $1', [userId]);
      
      if (existing.rows.length > 0) {
        await client.query(
          `UPDATE user_profiles 
           SET date_of_birth = $1, height = $2, weight = $3, gender = $4, blood_type = $5, updated_at = CURRENT_TIMESTAMP
           WHERE user_id = $6`,
          [
            data.date_of_birth?.toISOString().split('T')[0] || null,
            data.height || null,
            data.weight || null,
            data.gender || null,
            data.blood_type || null,
            userId,
          ]
        );
      } else {
        await client.query(
          `INSERT INTO user_profiles (user_id, date_of_birth, height, weight, gender, blood_type)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            userId,
            data.date_of_birth?.toISOString().split('T')[0] || null,
            data.height || null,
            data.weight || null,
            data.gender || null,
            data.blood_type || null,
          ]
        );
      }
    } finally {
      client.release();
    }
  },

  findByUserId: async (userId: number) => {
    const client = await getPool().connect();
    try {
      const result = await client.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  },
};

// Document operations
export const documentDb = {
  create: async (userId: number, data: { title: string; content: string; file_path?: string; document_type?: string }) => {
    const client = await getPool().connect();
    try {
      const result = await client.query(
        `INSERT INTO documents (user_id, title, content, file_path, document_type)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, data.title, data.content, data.file_path || null, data.document_type || 'medical']
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  findByUserId: async (userId: number) => {
    const client = await getPool().connect();
    try {
      const result = await client.query('SELECT * FROM documents WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      return result.rows;
    } finally {
      client.release();
    }
  },

  findById: async (id: number) => {
    const client = await getPool().connect();
    try {
      const result = await client.query('SELECT * FROM documents WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  },
};

// Daily plan operations
export const dailyPlanDb = {
  create: async (userId: number, data: { date: Date; title: string; description?: string; category?: string; time?: string }) => {
    const client = await getPool().connect();
    try {
      const result = await client.query(
        `INSERT INTO daily_plans (user_id, date, title, description, category, time)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          userId,
          data.date.toISOString().split('T')[0],
          data.title,
          data.description || null,
          data.category || null,
          data.time || null,
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  findByUserIdAndDate: async (userId: number, date: Date) => {
    const client = await getPool().connect();
    try {
      const result = await client.query(
        'SELECT * FROM daily_plans WHERE user_id = $1 AND date = $2 ORDER BY time ASC',
        [userId, date.toISOString().split('T')[0]]
      );
      return result.rows;
    } finally {
      client.release();
    }
  },

  findByUserIdAndDateRange: async (userId: number, startDate: Date, endDate: Date) => {
    const client = await getPool().connect();
    try {
      const result = await client.query(
        'SELECT * FROM daily_plans WHERE user_id = $1 AND date >= $2 AND date <= $3 ORDER BY date ASC, time ASC',
        [
          userId,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0],
        ]
      );
      return result.rows;
    } finally {
      client.release();
    }
  },

  updateCompleted: async (id: number, completed: boolean) => {
    const client = await getPool().connect();
    try {
      await client.query(
        'UPDATE daily_plans SET completed = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [completed, id]
      );
    } finally {
      client.release();
    }
  },
};

// Health metrics operations
export const healthMetricsDb = {
  create: async (userId: number, data: { metric_type: string; value: number; unit?: string; notes?: string }) => {
    const client = await getPool().connect();
    try {
      const result = await client.query(
        `INSERT INTO health_metrics (user_id, metric_type, value, unit, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, data.metric_type, data.value, data.unit || null, data.notes || null]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  findByUserId: async (userId: number, metricType?: string, limit: number = 100) => {
    const client = await getPool().connect();
    try {
      let result;
      if (metricType) {
        result = await client.query(
          'SELECT * FROM health_metrics WHERE user_id = $1 AND metric_type = $2 ORDER BY recorded_at DESC LIMIT $3',
          [userId, metricType, limit]
        );
      } else {
        result = await client.query(
          'SELECT * FROM health_metrics WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT $2',
          [userId, limit]
        );
      }
      return result.rows;
    } finally {
      client.release();
    }
  },
};

// Goals operations
export const goalsDb = {
  create: async (userId: number, data: { title: string; description?: string; category?: string; target_value?: number; unit?: string; deadline?: Date }) => {
    const client = await getPool().connect();
    try {
      const result = await client.query(
        `INSERT INTO goals (user_id, title, description, category, target_value, unit, deadline)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          userId,
          data.title,
          data.description || null,
          data.category || null,
          data.target_value || null,
          data.unit || null,
          data.deadline?.toISOString().split('T')[0] || null,
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  findByUserId: async (userId: number) => {
    const client = await getPool().connect();
    try {
      const result = await client.query('SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      return result.rows;
    } finally {
      client.release();
    }
  },
};

// Telegram bot settings operations
export const telegramBotSettingsDb = {
  createOrUpdate: async (userId: number, data: { notifications_enabled?: boolean; reminders_enabled?: boolean; metric_tracking_enabled?: boolean; reminder_times?: string[] }) => {
    const client = await getPool().connect();
    try {
      const existing = await client.query('SELECT id FROM telegram_bot_settings WHERE user_id = $1', [userId]);
      
      if (existing.rows.length > 0) {
        await client.query(
          `UPDATE telegram_bot_settings 
           SET notifications_enabled = $1, reminders_enabled = $2, metric_tracking_enabled = $3, 
               reminder_times = $4, updated_at = CURRENT_TIMESTAMP
           WHERE user_id = $5`,
          [
            data.notifications_enabled !== undefined ? data.notifications_enabled : null,
            data.reminders_enabled !== undefined ? data.reminders_enabled : null,
            data.metric_tracking_enabled !== undefined ? data.metric_tracking_enabled : null,
            data.reminder_times ? JSON.stringify(data.reminder_times) : null,
            userId,
          ]
        );
      } else {
        await client.query(
          `INSERT INTO telegram_bot_settings (user_id, notifications_enabled, reminders_enabled, metric_tracking_enabled, reminder_times)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            userId,
            data.notifications_enabled !== undefined ? data.notifications_enabled : true,
            data.reminders_enabled !== undefined ? data.reminders_enabled : true,
            data.metric_tracking_enabled !== undefined ? data.metric_tracking_enabled : true,
            data.reminder_times ? JSON.stringify(data.reminder_times) : JSON.stringify(['08:00', '12:00', '18:00']),
          ]
        );
      }
    } finally {
      client.release();
    }
  },

  findByUserId: async (userId: number) => {
    const client = await getPool().connect();
    try {
      const result = await client.query('SELECT * FROM telegram_bot_settings WHERE user_id = $1', [userId]);
      const settings = result.rows[0];
      if (settings && settings.reminder_times) {
        settings.reminder_times = JSON.parse(settings.reminder_times);
      }
      return settings || null;
    } finally {
      client.release();
    }
  },
};

// Telegram bot logs operations
export const telegramBotLogsDb = {
  create: async (userId: number, data: { action_type: string; message?: string }) => {
    const client = await getPool().connect();
    try {
      const result = await client.query(
        `INSERT INTO telegram_bot_logs (user_id, action_type, message)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, data.action_type, data.message || null]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  findByUserId: async (userId: number, limit: number = 50) => {
    const client = await getPool().connect();
    try {
      const result = await client.query(
        'SELECT * FROM telegram_bot_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
        [userId, limit]
      );
      return result.rows;
    } finally {
      client.release();
    }
  },
};

export { getPool };
export default getPool;
