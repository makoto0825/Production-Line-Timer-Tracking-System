import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  updateSessionToPaused,
  updateSessionToActive,
} from '../utils/pauseUtils';
import { calculateTimeLeft, formatTime } from '../utils/timeUtils';
import {
  getSessionData,
  getIsPaused,
  getTimerDisplayData,
} from '../utils/sessionUtils';
import {
  handleTimeUpPopup,
  checkPopupCountdownOnLoad,
  checkScheduledPopup,
  calculateActiveTime,
} from '../utils/timeUpUtils';
import { timerPauseConfig } from '../../../modalUI/swalConfigs';

export const useTimer = () => {
  const navigate = useNavigate();

  // ===== STATE MANAGEMENT =====
  const [defects, setDefects] = useState('');
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  const [hasTimeUpPopupShown, setHasTimeUpPopupShown] = useState(false);

  // ===== SESSION MANAGEMENT =====
  // Check session data and redirect if not exists
  useEffect(() => {
    const sessionData = getSessionData();
    if (!sessionData) {
      console.log('No session data found, redirecting to login');
      navigate('/login');
      return;
    }

    // Restore scheduled popup state on page load
    if (sessionData.isPopupScheduled && sessionData.nextPopupActiveTime) {
      console.log('Restoring scheduled popup state on page load');
      // The scheduled popup will be checked in the timer interval
    }

    // Check if popup countdown should be resumed
    if (checkPopupCountdownOnLoad()) {
      // Show popup if countdown is still active
      setHasTimeUpPopupShown(true); // Set flag to prevent double popup
      return; // Popup countdown is being handled by checkPopupCountdownOnLoad
    }

    // Show pause modal if status is paused
    if (sessionData.status === 'paused') {
      Swal.fire(timerPauseConfig).then((result) => {
        if (result.isConfirmed) {
          handlePauseEnd();
        }
      });
    }
  }, [navigate]);

  // ===== TIMER LOGIC =====
  // Real-time timer update with time-up detection
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

      // Check for scheduled popup (considering pause time)
      if (checkScheduledPopup()) {
        console.log('Scheduled popup triggered');
        setHasTimeUpPopupShown(true);
        return;
      }

      // Time-up detection: when timeLeft becomes 0 or negative
      // But respect scheduled popup grace period
      if (timeLeftSeconds <= 0 && !hasTimeUpPopupShown) {
        // Check if there's a scheduled popup with grace period
        if (sessionData.isPopupScheduled && sessionData.nextPopupActiveTime) {
          const currentActiveTime = calculateActiveTime(
            sessionData.startTime,
            sessionData.totalPausedTime
          );

          // If we're still within the grace period, don't show popup
          if (currentActiveTime < sessionData.nextPopupActiveTime) {
            console.log(
              `Main timer is negative but within grace period. Current: ${currentActiveTime}s, Scheduled: ${sessionData.nextPopupActiveTime}s`
            );
            return;
          }
        }

        console.log('Time is up! Triggering popup...');
        setHasTimeUpPopupShown(true);
        handleTimeUpPopup();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasTimeUpPopupShown]);

  // ===== PAUSE FUNCTIONALITY =====
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

  // ===== NAVIGATION =====
  // Handle next page navigation
  const handleNext = () => {
    console.log('Navigate to Page 3');
    navigate('/login'); // TODO: Change to actual Page 3 route when implemented
  };

  // ===== USER INPUT HANDLERS =====
  // Handle defects input change
  const handleDefectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefects(e.target.value);
  };

  // Generate timer display data
  const timerData = getTimerDisplayData(timeLeft);

  return {
    isPaused: getIsPaused(),
    defects,
    mockData: timerData,
    handlePause,
    handleNext,
    handleDefectsChange,
  };
};
