import { Router, Request, Response } from 'express';

const router = Router();

// Utility to send an SSE data event
const sendEvent = (res: Response, data: unknown) => {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

// SSE endpoint: streams server time every second
router.get('/timer', (req: Request, res: Response) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });

  // Send initial event to confirm connection
  sendEvent(res, { action: 'connected', serverTime: new Date().toISOString() });

  // Heartbeat + server time broadcast
  const intervalId = setInterval(() => {
    sendEvent(res, {
      action: 'serverTime',
      serverTime: new Date().toISOString(),
    });
  }, 1000);

  // Cleanup when client disconnects
  req.on('close', () => {
    clearInterval(intervalId);
  });
});

export default router;
