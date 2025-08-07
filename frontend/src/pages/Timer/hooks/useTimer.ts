import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import type { SessionData } from '../utils/pauseUtils';
import {
  updateSessionToPaused,
  updateSessionToActive,
  calculateTotalPausedTime,
} from '../utils/pauseUtils';
import { calculateTimeLeft, formatTime } from '../utils/timeUtils';
import { timerPauseConfig } from '../../../modalUI/swalConfigs';

export const useTimer = () => {
  const navigate = useNavigate();
  const [defects, setDefects] = useState('');
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  // Get session data from localStorage
  const getSessionData = (): SessionData | null => {
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

  // Get pause status
  const getIsPaused = (): boolean => {
    const sessionData = getSessionData();
    return sessionData?.status === 'paused';
  };

  // Check session data and redirect if not exists
  useEffect(() => {
    const sessionData = getSessionData();
    if (!sessionData) {
      console.log('No session data found, redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  // Real-time timer update
  useEffect(() => {
    const interval = setInterval(() => {
      const sessionData = getSessionData();
      if (!sessionData || getIsPaused()) return;

      const timeLeftSeconds = calculateTimeLeft(
        sessionData.buildData.numberOfParts,
        sessionData.buildData.timePerPart,
        sessionData.startTime,
        sessionData.totalPausedTime
      );

      setTimeLeft(formatTime(timeLeftSeconds));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Generate timer display data
  const timerData = {
    loginId: getSessionData()?.loginId || 'Unknown User',
    buildNumber: getSessionData()?.buildData?.buildNumber || 'Unknown Build',
    numberOfParts: getSessionData()?.buildData?.numberOfParts || 0,
    timePerPart: getSessionData()?.buildData?.timePerPart || 0,
    timeLeft: timeLeft,
  };

  // Handle pause start
  const handlePauseStart = () => {
    const sessionData = getSessionData();
    if (!sessionData) return;

    const updatedSessionData = updateSessionToPaused(sessionData);
    localStorage.setItem('sessionData', JSON.stringify(updatedSessionData));
  };

  // Handle pause end (resume)
  const handlePauseEnd = () => {
    const sessionData = getSessionData();
    if (!sessionData) return;

    const updatedSessionData = updateSessionToActive(sessionData);
    localStorage.setItem('sessionData', JSON.stringify(updatedSessionData));
  };

  // Handle pause with modal
  const handlePause = () => {
    handlePauseStart();

    // Show pause modal using config
    Swal.fire(timerPauseConfig).then((result) => {
      if (result.isConfirmed) {
        handlePauseEnd();
      }
    });
  };

  // Handle next page navigation
  const handleNext = () => {
    console.log('Navigate to Page 3');
    navigate('/login');
  };

  // Handle defects input change
  const handleDefectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefects(e.target.value);
  };

  // Calculate total paused time
  const getTotalPausedTime = (): number => {
    const sessionData = getSessionData();
    if (!sessionData) return 0;
    return calculateTotalPausedTime(sessionData.pauseRecords);
  };

  return {
    isPaused: getIsPaused(),
    defects,
    mockData: timerData,
    handlePause,
    handleNext,
    handleDefectsChange,
    getTotalPausedTime,
  };
};
