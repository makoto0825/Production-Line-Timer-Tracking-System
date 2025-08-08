// Frontend SSE client utility
// Provides a singleton EventSource connection, subscription management,
// and access to the latest server time.

export type SSEBaseMessage = {
  action: string;
  [key: string]: unknown;
};

export type SSEServerTimeMessage = {
  action: 'connected' | 'serverTime';
  serverTime: string;
};

export type SSEMessage = SSEServerTimeMessage | SSEBaseMessage;

export type SSECallback = (data: SSEMessage) => void;

let eventSource: EventSource | null = null;
let latestServerTimeIso: string | null = null;
const subscribers = new Set<SSECallback>();

const DEFAULT_TIMER_URL = 'http://localhost:5000/api/timer';

const isServerTimeMessage = (
  data: SSEMessage
): data is SSEServerTimeMessage => {
  return data.action === 'connected' || data.action === 'serverTime';
};

export const initSSE = (url: string = DEFAULT_TIMER_URL): void => {
  if (eventSource) return; // already initialized

  eventSource = new EventSource(url);

  eventSource.onmessage = (event: MessageEvent) => {
    try {
      const data: SSEMessage = JSON.parse(event.data);
      if (typeof (data as SSEBaseMessage)?.action === 'string') {
        if (isServerTimeMessage(data)) {
          const serverTime = data.serverTime;
          if (serverTime) {
            latestServerTimeIso = serverTime;
          }
        }
        // Notify subscribers
        subscribers.forEach((cb) => {
          try {
            cb(data);
          } catch {
            // ignore subscriber errors
          }
        });
      }
    } catch {
      // ignore parse errors
      // console.warn('SSE parse error', e);
    }
  };

  eventSource.onerror = () => {
    // EventSource retries automatically; leave it to reconnect
    // console.warn('SSE connection error');
  };
};

export const subscribeSSE = (callback: SSECallback): (() => void) => {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
};

export const getLatestServerTime = (): Date | null => {
  return latestServerTimeIso ? new Date(latestServerTimeIso) : null;
};

export const closeSSE = (): void => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  subscribers.clear();
  latestServerTimeIso = null;
};
