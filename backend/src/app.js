import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';

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

// Root test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is running'
  });
});

export default app;
