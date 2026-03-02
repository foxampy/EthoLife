import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import API routes
import authRoutes from './api/auth.js';
import healthRoutes from './routes/health.js';

// Import and start Telegram bot
import './telegram-bot.js';
import aiRoutes from './api/ai.js';
import usersRoutes from './api/users.js';
import paymentsRoutes from './api/payments.js';
import specialistsRoutes from './api/specialists.js';
import bookingsRoutes from './api/bookings.js';
import dashboardRoutes from './api/dashboard.js';
import centerRoutes from './api/center.js';
import uploadRoutes from './api/upload.js';
import socialRoutes from './api/social.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'ethoslife-api',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/specialists', specialistsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/center', centerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/social', socialRoutes);

// Serve static files
const publicPath = path.join(__dirname, '../dist/public');
app.use(express.static(publicPath));

// SPA fallback
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(publicPath, 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Error handling
app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🔑 API Keys:`, {
    gemini: process.env.GEMINI_API_KEY ? '✅' : '❌',
    groq: process.env.GROQ_API_KEY ? '✅' : '❌',
  });
});
