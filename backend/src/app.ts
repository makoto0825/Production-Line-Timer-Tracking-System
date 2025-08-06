// src/app.ts

import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import buildsRouter from './routes/builds';
// read .env file
dotenv.config();

// create application instance
const app: Application = express();

// middleware settings
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL || 'http://localhost:5173']
      : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// dummy route (test)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from app.ts (TypeScript backend)' });
});

app.use('/api/builds', buildsRouter);

// import partsRouter from './routes/parts';
// app.use('/api/parts', partsRouter);

export default app;
