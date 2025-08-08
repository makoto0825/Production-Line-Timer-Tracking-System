import { Request, Response } from 'express';
import SessionLock from '../models/SessionLock';

const DEFAULT_LOCK_TTL_MINUTES = 120; // 2 hours

const calcExpiresAt = (minutes: number): Date => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d;
};

export const acquireLock = async (req: Request, res: Response) => {
  try {
    const { loginId, ttlMinutes } = req.body || {};
    if (!loginId) {
      return res.status(400).json({ message: 'loginId is required' });
    }

    const expiresAt = calcExpiresAt(
      typeof ttlMinutes === 'number' && ttlMinutes > 0
        ? ttlMinutes
        : DEFAULT_LOCK_TTL_MINUTES
    );

    // Try to create a new lock (unique index on loginId will enforce exclusivity)
    try {
      const lock = await SessionLock.create({
        loginId,
        acquiredAt: new Date(),
        expiresAt,
      });
      return res
        .status(201)
        .json({ message: 'Lock acquired', loginId, expiresAt: lock.expiresAt });
    } catch (err: any) {
      // Duplicate key error => lock already exists
      if (err?.code === 11000) {
        return res
          .status(409)
          .json({ message: 'Lock already acquired', loginId });
      }
      throw err;
    }
  } catch (error) {
    console.error('acquireLock error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const releaseLock = async (req: Request, res: Response) => {
  try {
    const { loginId } = req.body || {};
    if (!loginId) {
      return res.status(400).json({ message: 'loginId is required' });
    }

    await SessionLock.deleteOne({ loginId });
    return res.status(200).json({ message: 'Lock released', loginId });
  } catch (error) {
    console.error('releaseLock error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
