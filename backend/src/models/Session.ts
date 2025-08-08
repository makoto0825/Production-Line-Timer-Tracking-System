import { Schema, model, Document } from 'mongoose';

export interface PopupInteraction {
  type: 'YES' | 'NO' | 'AUTO_SUBMIT';
  timestamp: Date;
}

export interface PauseRecord {
  start: Date;
  end?: Date;
}

export interface SessionDocument extends Document {
  loginId: string;
  buildNumber: string;
  numberOfParts: number;
  timePerPart: number;
  startTime: Date;
  endTime?: Date;
  totalPausedTime: number;
  totalParts?: number;
  defects: number;
  pauseRecords: PauseRecord[];
  popupInteractions: PopupInteraction[];
  submissionType?: 'AUTO_SUBMIT' | 'MANUAL';
  totalActiveTimeSec?: number;
  totalInactiveTimeSec?: number;
  popupWaitAccumSec?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PauseRecordSchema = new Schema<PauseRecord>(
  {
    start: { type: Date, required: true },
    end: { type: Date },
  },
  { _id: false }
);

const PopupInteractionSchema = new Schema<PopupInteraction>(
  {
    type: {
      type: String,
      enum: ['YES', 'NO', 'AUTO_SUBMIT'],
      required: true,
    },
    timestamp: { type: Date, required: true },
  },
  { _id: false }
);

const SessionSchema = new Schema<SessionDocument>(
  {
    loginId: { type: String, required: true, index: true },
    buildNumber: { type: String, required: true, index: true },
    numberOfParts: { type: Number, required: true },
    timePerPart: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    totalPausedTime: { type: Number, default: 0 },
    totalParts: { type: Number, default: 0 },
    defects: { type: Number, default: 0 },
    pauseRecords: { type: [PauseRecordSchema], default: [] },
    popupInteractions: { type: [PopupInteractionSchema], default: [] },
    submissionType: { type: String, enum: ['AUTO_SUBMIT', 'MANUAL'] },
    totalActiveTimeSec: { type: Number },
    totalInactiveTimeSec: { type: Number },
    popupWaitAccumSec: { type: Number },
  },
  { timestamps: true }
);

SessionSchema.index({ buildNumber: 1, createdAt: -1 });
SessionSchema.index({ loginId: 1, createdAt: -1 });

const Session = model<SessionDocument>('Session', SessionSchema);

export default Session;
