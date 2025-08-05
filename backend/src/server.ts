// server.js
import dotenv from 'dotenv';
import app from './app';

dotenv.config();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
