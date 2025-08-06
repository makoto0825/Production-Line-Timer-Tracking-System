import { Document } from 'mongoose';

// Build related interfaces
export interface IBuild extends Document {
  buildNumber: string;
  numberOfParts: number;
  timePerPart: number;
  createdAt?: Date;
  updatedAt?: Date;
}
