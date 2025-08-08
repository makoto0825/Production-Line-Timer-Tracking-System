import { Build } from '../models/Build';
import { IBuild } from '../types';

// Sample build data
const buildData: Partial<IBuild>[] = [
  {
    buildNumber: 'B00001',
    numberOfParts: 1,
    timePerPart: 1,
  },
  {
    buildNumber: 'B00002',
    numberOfParts: 1,
    timePerPart: 0.2,
  },
  {
    buildNumber: 'B00003',
    numberOfParts: 20,
    timePerPart: 3,
  },
  {
    buildNumber: 'B00004',
    numberOfParts: 40,
    timePerPart: 1,
  },
  {
    buildNumber: 'B00005',
    numberOfParts: 15,
    timePerPart: 2.5,
  },
  {
    buildNumber: 'B00006',
    numberOfParts: 35,
    timePerPart: 1.8,
  },
  {
    buildNumber: 'B00007',
    numberOfParts: 28,
    timePerPart: 2.2,
  },
  {
    buildNumber: '123463',
    numberOfParts: 22,
    timePerPart: 1.9,
  },
];

export const seedBuilds = async (): Promise<void> => {
  try {
    console.log('🌱 Starting build seeder...');

    // Clear existing builds
    await Build.deleteMany({});
    console.log('🗑️  Cleared existing builds');

    // Insert new builds
    const builds = await Build.insertMany(buildData);
    console.log(`✅ Successfully seeded ${builds.length} builds`);

    // Log the created builds
    builds.forEach((build) => {
      console.log(
        `   - Build ${build.buildNumber}: ${build.numberOfParts} parts, ${build.timePerPart} min/part`
      );
    });
  } catch (error) {
    console.error('❌ Error seeding builds:', error);
    throw error;
  }
};

export const clearBuilds = async (): Promise<void> => {
  try {
    await Build.deleteMany({});
    console.log('🗑️  All builds cleared');
  } catch (error) {
    console.error('❌ Error clearing builds:', error);
    throw error;
  }
};
