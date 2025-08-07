import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import type { SessionData } from '../utils/pauseUtils';
import {
  updateSessionToPaused,
  updateSessionToActive,
  calculateTotalPausedTime,
} from '../utils/pauseUtils';
import { timerPauseConfig } from '../../../modalUI/swalConfigs';

export const useTimer = () => {
  const navigate = useNavigate();
  const [defects, setDefects] = useState('');

  // getSessionData
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

  // getIsPaused
  const getIsPaused = (): boolean => {
    const sessionData = getSessionData();
    return sessionData?.status === 'paused';
  };

  // checkSessionData
  useEffect(() => {
    const sessionData = getSessionData();
    if (!sessionData) {
      console.log('No session data found, redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  // getTimerData
  const timerData = {
    loginId: getSessionData()?.loginId || 'Unknown User',
    buildNumber: getSessionData()?.buildData?.buildNumber || 'Unknown Build',
    numberOfParts: getSessionData()?.buildData?.numberOfParts || 0,
    timePerPart: getSessionData()?.buildData?.timePerPart || 0,
    timeLeft: '00:45:30', // Mock timer display - will be calculated based on startTime
  };

  // handlePauseStart
  const handlePauseStart = () => {
    const sessionData = getSessionData();
    if (!sessionData) return;

    const updatedSessionData = updateSessionToPaused(sessionData);
    localStorage.setItem('sessionData', JSON.stringify(updatedSessionData));
  };

  // handlePauseEnd
  const handlePauseEnd = () => {
    const sessionData = getSessionData();
    if (!sessionData) return;

    const updatedSessionData = updateSessionToActive(sessionData);
    localStorage.setItem('sessionData', JSON.stringify(updatedSessionData));
  };

  // handlePause
  const handlePause = () => {
    handlePauseStart();

    // Show pause modal using config
    Swal.fire(timerPauseConfig).then((result) => {
      if (result.isConfirmed) {
        handlePauseEnd();
      }
    });
  };

  // Handle next
  const handleNext = () => {
    console.log('Navigate to Page 3');
    navigate('/login');
  };

  // Handle defects change
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
