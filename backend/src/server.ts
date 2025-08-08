import dotenv from 'dotenv';
import { connectDB } from './config/database';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;

// connect to database
connectDB();

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
