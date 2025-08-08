import type { SessionData } from './pauseUtils';

// Get session data from localStorage
export const getSessionData = (): SessionData | null => {
  const storedSession = localStorage.getItem('sessionData');
  if (storedSession) {
    try {
      const parsedSession = JSON.parse(storedSession);
      return {
        ...parsedSession,
        pauseRecords: parsedSession.pauseRecords || [],
      };
    } catch (error) {
      console.error('Error parsing session data:', error);
      return null;
    }
  }
  return null;
};

// Get pause status from session data
export const getIsPaused = (): boolean => {
  const sessionData = getSessionData();
  return sessionData?.status === 'paused';
};

// Check if session exists and is valid
export const isSessionValid = (): boolean => {
  const sessionData = getSessionData();
  return sessionData !== null;
};

// Get timer display data from session
export const getTimerDisplayData = (timeLeft: string) => {
  const sessionData = getSessionData();
  return {
    loginId: sessionData?.loginId || 'Unknown User',
    buildNumber: sessionData?.buildData?.buildNumber || 'Unknown Build',
    numberOfParts: sessionData?.buildData?.numberOfParts || 0,
    timePerPart: sessionData?.buildData?.timePerPart || 0,
    timeLeft: timeLeft,
  };
};
