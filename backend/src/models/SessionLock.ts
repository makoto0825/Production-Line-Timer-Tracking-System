import mongoose, { Schema, Document } from 'mongoose';

export interface ISessionLock extends Document {
  loginId: string;
  acquiredAt: Date;
  expiresAt: Date;
}

const SessionLockSchema: Schema = new Schema<ISessionLock>({
  loginId: { type: String, required: true, unique: true, index: true },
  acquiredAt: { type: Date, required: true, default: () => new Date() },
  // TTL index to auto-expire locks in case of abnormal termination
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export default mongoose.model<ISessionLock>('SessionLock', SessionLockSchema);
