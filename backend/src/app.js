import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import tenantRoutes from './routes/tenant.routes.js';
import userRoutes from './routes/user.routes.js';




const app = express();

// CORS (Docker-safe)
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);

// Body parser
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api', userRoutes);


// Root test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is running'
  });
});

// Health check (MANDATORY)
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

export default app;
