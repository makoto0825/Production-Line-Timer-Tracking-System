import mongoose from 'mongoose';
import { IBuild } from '../types';

// Mongoose schema definition
const buildSchema = new mongoose.Schema<IBuild>(
  {
    buildNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    numberOfParts: {
      type: Number,
      required: true,
      min: 1,
    },
    timePerPart: {
      type: Number,
      required: true,
      min: 0.1,
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt automatically
  }
);

// Create and export the model
export const Build = mongoose.model<IBuild>('Build', buildSchema);
