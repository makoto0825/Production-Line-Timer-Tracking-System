import { Request, Response } from 'express';
import Session from '../models/Session';

const parseNumber = (v: unknown): number | undefined => {
  if (v === undefined || v === null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const parseDate = (v: unknown): Date | undefined => {
  if (!v) return undefined;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? undefined : d;
};

export const createSession = async (req: Request, res: Response) => {
  try {
    const payload = req.body ?? {};

    // Required fields check
    const loginId = String(payload.loginId || '').trim();
    const buildNumber = String(payload.buildNumber || '').trim();
    const numberOfParts = parseNumber(payload.numberOfParts);
    const timePerPart = parseNumber(payload.timePerPart);
    const startTime = parseDate(payload.startTime);

    if (
      !loginId ||
      !buildNumber ||
      numberOfParts === undefined ||
      timePerPart === undefined ||
      !startTime
    ) {
      return res.status(400).json({
        message: 'Missing or invalid required fields',
        required: [
          'loginId',
          'buildNumber',
          'numberOfParts',
          'timePerPart',
          'startTime',
        ],
      });
    }

    // Optional fields
    const endTime = parseDate(payload.endTime);
    const totalPausedTime = parseNumber(payload.totalPausedTime) ?? 0;
    const totalParts = parseNumber(payload.totalParts);
    const defects = parseNumber(payload.defects) ?? 0;
    const totalActiveTimeSec = parseNumber(payload.totalActiveTimeSec);
    const totalInactiveTimeSec = parseNumber(payload.totalInactiveTimeSec);
    const popupWaitAccumSec = parseNumber(payload.popupWaitAccumSec);

    const submissionType =
      payload.submissionType === 'AUTO_SUBMIT' ||
      payload.submissionType === 'MANUAL'
        ? payload.submissionType
        : undefined;

    const pauseRecords = Array.isArray(payload.pauseRecords)
      ? payload.pauseRecords
          .map((r: any) => ({
            start: parseDate(r?.start),
            end: parseDate(r?.end),
          }))
          .filter((r: any) => r.start)
      : [];

    const popupInteractions = Array.isArray(payload.popupInteractions)
      ? payload.popupInteractions
          .map((p: any) => ({
            type: p?.type,
            timestamp: parseDate(p?.timestamp),
          }))
          .filter(
            (p: any) =>
              p.timestamp && ['YES', 'NO', 'AUTO_SUBMIT'].includes(p.type)
          )
      : [];

    const doc = await Session.create({
      loginId,
      buildNumber,
      numberOfParts,
      timePerPart,
      startTime,
      endTime,
      totalPausedTime,
      totalParts,
      defects,
      pauseRecords,
      popupInteractions,
      submissionType,
      totalActiveTimeSec,
      totalInactiveTimeSec,
      popupWaitAccumSec,
    });

    return res.status(201).json({ id: doc._id, createdAt: doc.createdAt });
  } catch (err) {
    console.error('createSession error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
