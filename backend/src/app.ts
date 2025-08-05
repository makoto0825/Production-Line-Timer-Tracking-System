// src/app.ts

import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// read .env file
dotenv.config();

// create application instance
const app: Application = express();

// middleware settings
app.use(cors());
app.use(express.json());

// dummy route (test)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from app.ts (TypeScript backend)' });
});

// import and use routes here
// import partsRouter from './routes/parts';
// app.use('/api/parts', partsRouter);

export default app;
