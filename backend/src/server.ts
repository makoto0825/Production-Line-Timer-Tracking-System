import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { Test } from './models/Test';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connect to database
connectDB();

// test endpoint
app.post('/api/test', async (req, res) => {
  try {
    const test = new Test({ message: 'Connection test successful!' });
    await test.save();
    res.json({ success: true, message: 'Data saved successfully!' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/test', async (req, res) => {
  try {
    const tests = await Test.find().sort({ timestamp: -1 });
    res.json({ success: true, data: tests });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
