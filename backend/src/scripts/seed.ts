import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import { seedBuilds, clearBuilds } from '../seeders/buildSeeder';

// Load environment variables
dotenv.config();

const runSeeder = async () => {
  try {
    console.log('🚀 Starting seeder script...');

    // Connect to MongoDB
    await connectDB();
    console.log('📦 Connected to database');

    // Check command line arguments
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'clear':
        await clearBuilds();
        break;
      case 'seed':
      default:
        await seedBuilds();
        break;
    }

    console.log('✅ Seeder script completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder script failed:', error);
    process.exit(1);
  }
};

// Run the seeder
runSeeder();
