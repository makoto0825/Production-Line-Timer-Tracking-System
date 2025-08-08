import { Request, Response } from 'express';

// Placeholder controller. Will be extended with validation and DB save.
export const createSession = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    // Basic payload presence check
    if (!payload) {
      return res.status(400).json({ message: 'Request body is required' });
    }

    // TODO: add validation & save to DB (Mongoose model)
    console.log('Received session payload:', payload);

    return res.status(201).json({ message: 'Session received' });
  } catch (err) {
    console.error('createSession error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
