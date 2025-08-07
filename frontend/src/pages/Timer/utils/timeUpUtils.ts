import Swal from 'sweetalert2';
import { timeUpPopupConfig } from '../../../modalUI/swalConfigs';
import { getSessionData } from './sessionUtils';

// 10 minutes in seconds
const COUNTDOWN_DURATION = 10 * 60; // 10 minutes

// Format countdown time (mm:ss format)
const formatCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

// Handle time-up popup display and user interaction with countdown
export const handleTimeUpPopup = async () => {
  console.log('Showing time-up popup with countdown...');

  // Get current session data
  const sessionData = getSessionData();
  if (!sessionData) {
    console.error('No session data found');
    return;
  }

  // Store popup start time and calculate end time
  const popupStartTime = new Date().toISOString();
  const popupEndTime = new Date(
    new Date(popupStartTime).getTime() + COUNTDOWN_DURATION * 1000
  ).toISOString();

  // Update session data with popup information
  const updatedSessionData = {
    ...sessionData,
    lastPopupTime: popupStartTime,
    popupEndTime: popupEndTime,
    popupCountdownActive: true,
  };

  localStorage.setItem('sessionData', JSON.stringify(updatedSessionData));

  let countdownInterval: NodeJS.Timeout;

  // Create custom popup with countdown
  const result = await Swal.fire({
    ...timeUpPopupConfig,
    didOpen: () => {
      console.log('Popup opened, starting countdown...');

      // Function to update countdown based on current time
      const updateCountdown = () => {
        const currentSessionData = getSessionData();
        if (!currentSessionData?.popupEndTime) {
          console.log('No popup end time found, stopping countdown');
          clearInterval(countdownInterval);
          return;
        }

        const popupEnd = new Date(currentSessionData.popupEndTime);
        const now = new Date();
        const timeLeftMs = popupEnd.getTime() - now.getTime();
        const remainingSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));

        console.log('Countdown:', formatCountdown(remainingSeconds));

        // Update countdown display
        const countdownElement = document.getElementById('timeUpCountdown');
        if (countdownElement) {
          countdownElement.textContent = formatCountdown(remainingSeconds);
          console.log(
            'Updated countdown element:',
            countdownElement.textContent
          );
        } else {
          console.log('Countdown element not found');
        }

        // Auto-submit when countdown reaches 0
        if (timeLeftMs <= 0) {
          clearInterval(countdownInterval);
          console.log('Countdown finished - auto-submitting session');
          handleAutoSubmit();
          Swal.close();
        }
      };

      // Initial update
      updateCountdown();

      // Start countdown when popup opens
      countdownInterval = setInterval(updateCountdown, 1000);
    },
    willClose: () => {
      // Clean up interval when popup closes
      if (countdownInterval) {
        clearInterval(countdownInterval);
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
    },
  });

  // Handle user interaction
  if (result.isConfirmed) {
    console.log('User clicked Yes - continue work');
    // TODO: Schedule next popup in 10 minutes
    // scheduleNextTimeUpPopup();
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    console.log('User clicked No - continue work');
    // TODO: Schedule next popup in 10 minutes
    // scheduleNextTimeUpPopup();
  }

  return result;
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
