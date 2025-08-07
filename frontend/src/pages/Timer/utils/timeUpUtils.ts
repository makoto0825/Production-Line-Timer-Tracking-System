import Swal from 'sweetalert2';
import { timeUpPopupConfig } from '../../../modalUI/swalConfigs';
import { getSessionData } from './sessionUtils';

// 10 minutes in seconds
const COUNTDOWN_DURATION = 10 * 60; // 10 minutes

// Types for better type safety
interface PopupTimeData {
  popupStartTime: string;
  popupEndTime: string;
}

interface CountdownState {
  interval: NodeJS.Timeout | null;
  isActive: boolean;
}

// Main function: Handle time-up popup display and user interaction with countdown
export const handleTimeUpPopup = async () => {
  console.log('Showing time-up popup with countdown...');

  try {
    // Calculate popup timing
    const popupData = calculatePopupTiming();

    // Update session data
    updateSessionWithPopupData(popupData);

    // Initialize countdown state
    const countdownState: CountdownState = {
      interval: null,
      isActive: true,
    };

    // Create custom popup with countdown
    const result = await Swal.fire({
      ...timeUpPopupConfig,
      didOpen: () => setupCountdown(countdownState, handleAutoSubmit),
      willClose: () => cleanupCountdown(countdownState),
    });

    // Handle user interaction
    handleUserInteraction(result);

    return result;
  } catch (error) {
    console.error('Error in handleTimeUpPopup:', error);
    throw error;
  }
};

// Check if popup countdown should be active on page load
export const checkPopupCountdownOnLoad = () => {
  const sessionData = getSessionData();
  if (!sessionData?.popupCountdownActive || !sessionData?.popupEndTime) {
    return false;
  }

  const popupEnd = new Date(sessionData.popupEndTime);
  const now = new Date();
  const timeLeftMs = popupEnd.getTime() - now.getTime();

  // If countdown is still active, return true to indicate popup should be shown
  if (timeLeftMs > 0) {
    console.log('Resuming popup countdown on page load');
    return true;
  } else {
    // Countdown finished while page was closed, auto-submit
    console.log('Countdown finished while page was closed, auto-submitting');
    handleAutoSubmit();
    return true;
  }
};

// Schedule next time-up popup in 10 minutes
export const scheduleNextTimeUpPopup = () => {
  console.log('Scheduling next popup in 10 minutes...');
  // TODO: Implement 10-minute interval popup functionality
  // This will be implemented in the next phase
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Format countdown time (mm:ss format)
const formatCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

// Calculate popup timing
const calculatePopupTiming = (): PopupTimeData => {
  const popupStartTime = new Date().toISOString();
  const popupEndTime = new Date(
    new Date(popupStartTime).getTime() + COUNTDOWN_DURATION * 1000
  ).toISOString();

  return { popupStartTime, popupEndTime };
};

// Update session data with popup information
const updateSessionWithPopupData = (popupData: PopupTimeData): void => {
  const sessionData = getSessionData();
  if (!sessionData) {
    throw new Error('No session data found');
  }

  const updatedSessionData = {
    ...sessionData,
    lastPopupTime: popupData.popupStartTime,
    popupEndTime: popupData.popupEndTime,
    popupCountdownActive: true,
  };

  localStorage.setItem('sessionData', JSON.stringify(updatedSessionData));
};

// Update countdown display
const updateCountdownDisplay = (remainingSeconds: number): void => {
  const countdownElement = document.getElementById('timeUpCountdown');
  if (countdownElement) {
    countdownElement.textContent = formatCountdown(remainingSeconds);
    console.log('Updated countdown element:', countdownElement.textContent);
  } else {
    console.log('Countdown element not found');
  }
};

// Calculate remaining time
const calculateRemainingTime = (): number => {
  const currentSessionData = getSessionData();
  if (!currentSessionData?.popupEndTime) {
    return 0;
  }

  const popupEnd = new Date(currentSessionData.popupEndTime);
  const now = new Date();
  const timeLeftMs = popupEnd.getTime() - now.getTime();
  return Math.max(0, Math.floor(timeLeftMs / 1000));
};

// Handle countdown update
const handleCountdownUpdate = (
  countdownState: CountdownState,
  onTimeUp: () => void
): void => {
  const remainingSeconds = calculateRemainingTime();

  if (remainingSeconds === 0) {
    // No popup end time found or countdown finished
    if (countdownState.interval) {
      clearInterval(countdownState.interval);
      countdownState.interval = null;
    }
    return;
  }

  console.log('Countdown:', formatCountdown(remainingSeconds));
  updateCountdownDisplay(remainingSeconds);

  // Check if countdown reached 0
  const currentSessionData = getSessionData();
  if (currentSessionData?.popupEndTime) {
    const popupEnd = new Date(currentSessionData.popupEndTime);
    const now = new Date();
    const timeLeftMs = popupEnd.getTime() - now.getTime();

    if (timeLeftMs <= 0) {
      if (countdownState.interval) {
        clearInterval(countdownState.interval);
        countdownState.interval = null;
      }
      console.log('Countdown finished - auto-submitting session');
      onTimeUp();
      Swal.close();
    }
  }
};

// Setup countdown functionality
const setupCountdown = (
  countdownState: CountdownState,
  onTimeUp: () => void
): void => {
  console.log('Popup opened, starting countdown...');

  // Initial update
  handleCountdownUpdate(countdownState, onTimeUp);

  // Start countdown interval
  countdownState.interval = setInterval(() => {
    handleCountdownUpdate(countdownState, onTimeUp);
  }, 1000);
};

// Cleanup countdown
const cleanupCountdown = (countdownState: CountdownState): void => {
  if (countdownState.interval) {
    clearInterval(countdownState.interval);
    countdownState.interval = null;
    console.log('Countdown interval cleared');
  }

  // Clear popup countdown status from session data
  const currentSessionData = getSessionData();
  if (currentSessionData) {
    const updatedSessionData = {
      ...currentSessionData,
      popupCountdownActive: false,
    };
    localStorage.setItem('sessionData', JSON.stringify(updatedSessionData));
  }
};

// Handle user interaction result
const handleUserInteraction = (result: {
  isConfirmed: boolean;
  dismiss?: Swal.DismissReason;
}): void => {
  if (result.isConfirmed) {
    console.log('User clicked Yes - continue work');
    // TODO: Schedule next popup in 10 minutes
    // scheduleNextTimeUpPopup();
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    console.log('User clicked No - continue work');
    // TODO: Schedule next popup in 10 minutes
    // scheduleNextTimeUpPopup();
  }
};

// Handle auto-submit when countdown reaches 0
const handleAutoSubmit = () => {
  console.log('Auto-submitting session data...');

  // TODO: Collect session data for submission
  // const sessionData = collectSessionDataForSubmission();
  // if (sessionData) {
  //   console.log('Session data collected:', sessionData);
  // }

  // Clear session data
  localStorage.removeItem('sessionData');

  // Show auto-submit notification
  Swal.fire({
    title: 'Session Auto-Submitted',
    text: 'Session has been automatically submitted due to inactivity.',
    icon: 'info',
    confirmButtonText: 'OK',
    confirmButtonColor: '#ec4899',
  }).then(() => {
    // Redirect to login page
    window.location.href = '/login';
  });
};
