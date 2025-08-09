import Swal from 'sweetalert2';
import { timeUpPopupConfig } from '../../../modalUI/swalConfigs';
import { getSessionData } from './sessionUtils';
import { initSSE, subscribeSSE, getLatestServerTime } from './serverTimeClient';
import type { PauseRecord } from './pauseUtils';

// ============================================================================
// CONSTANTS
// ============================================================================

// Frontend-only submission endpoint (adjust as needed)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const SESSIONS_API_URL = `${API_BASE_URL}/api/sessions`;
const SESSION_LOCKS_API_URL = `${API_BASE_URL}/api/session-locks`;

// Timer settings from environment variables
const COUNTDOWN_DURATION = parseInt(
  import.meta.env.VITE_COUNTDOWN_DURATION || '600',
  10
);
const POPUP_INTERVAL = parseInt(
  import.meta.env.VITE_POPUP_INTERVAL || '600',
  10
);

// Helper: get server "now" (fallback to client time)
const getServerNow = (): Date => getLatestServerTime() ?? new Date();

// ============================================================================
// interface
// ============================================================================

// Types for better type safety
interface PopupTimeData {
  popupStartTime: string;
  popupEndTime: string;
}

interface CountdownState {
  interval: number | null;
  isActive: boolean;
  unsubscribe: (() => void) | null;
}

interface PopupInteraction {
  type: 'YES' | 'NO' | 'AUTO_SUBMIT';
  timestamp: string;
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

// Main function: Handle time-up popup display and user interaction with countdown
export const handleTimeUpPopup = async () => {
  try {
    // Ensure SSE is initialized (idempotent)
    initSSE();

    // Calculate popup timing
    const popupData = calculatePopupTiming();

    // Update session data
    updateSessionWithPopupData(popupData);

    // Initialize countdown state
    const countdownState: CountdownState = {
      interval: null,
      isActive: true,
      unsubscribe: null,
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
  const now = getServerNow();
  const timeLeftMs = popupEnd.getTime() - now.getTime();

  // If countdown is still active, return true to indicate popup should be shown
  if (timeLeftMs > 0) {
    // Resume existing countdown instead of creating new one
    resumeExistingCountdown();
    return true;
  } else {
    // Countdown finished while page was closed, auto-submit
    handleAutoSubmit();
    return true;
  }
};

// Check if scheduled popup should be shown (considering pause time)
export const checkScheduledPopup = (): boolean => {
  const sessionData = getSessionData();
  if (!sessionData?.isPopupScheduled || !sessionData?.nextPopupActiveTime) {
    return false;
  }

  // Validate and restore scheduled popup state
  if (!validateScheduledPopup()) {
    return false;
  }

  const currentActiveTime = calculateActiveTime(
    sessionData.startTime,
    sessionData.totalPausedTime
  );
  const shouldShow = currentActiveTime >= sessionData.nextPopupActiveTime;

  if (shouldShow) {
    // Reset schedule and show popup
    resetPopupSchedule();
    handleTimeUpPopup();
    return true;
  }

  return false;
};

// Calculate active time (excluding pause time) using server now
export const calculateActiveTime = (
  startTime: string,
  totalPausedTime: number
): number => {
  const now = getServerNow().getTime();
  const start = new Date(startTime).getTime();
  const totalTime = (now - start) / 1000; // Convert to seconds
  return totalTime - totalPausedTime; // Active time only
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Validate and restore scheduled popup state
const validateScheduledPopup = (): boolean => {
  const sessionData = getSessionData();
  if (!sessionData?.isPopupScheduled || !sessionData?.nextPopupActiveTime) {
    return false;
  }

  const currentActiveTime = calculateActiveTime(
    sessionData.startTime,
    sessionData.totalPausedTime
  );

  // Allow popup even if the scheduled time has already passed slightly
  // to avoid missing the popup due to timer drift.
  console.log(
    `Scheduled popup check. Current: ${currentActiveTime}s, Scheduled: ${sessionData.nextPopupActiveTime}s`
  );
  return true;
};

// Resume existing countdown without creating new popup
const resumeExistingCountdown = async () => {
  // Ensure SSE is initialized (idempotent)
  initSSE();

  // Initialize countdown state
  const countdownState: CountdownState = {
    interval: null,
    isActive: true,
    unsubscribe: null,
  };

  // Create popup with existing countdown
  const result = await Swal.fire({
    ...timeUpPopupConfig,
    didOpen: () => setupCountdown(countdownState, handleAutoSubmit),
    willClose: () => cleanupCountdown(countdownState),
  });

  // Handle user interaction
  handleUserInteraction(result);

  return result;
};

// Schedule next popup considering active time
const scheduleNextPopup = (clickTime: string): void => {
  const sessionData = getSessionData();
  if (!sessionData) {
    console.warn('No session data found, cannot schedule next popup');
    return;
  }

  // Calculate current active time at click
  const currentActiveTime = calculateActiveTime(
    sessionData.startTime,
    sessionData.totalPausedTime
  );

  // Schedule next popup at current active time + interval
  const nextPopupActiveTime = currentActiveTime + POPUP_INTERVAL;

  const updatedSessionData = {
    ...sessionData,
    nextPopupActiveTime,
    lastPopupClickTime: clickTime,
    isPopupScheduled: true,
  };

  localStorage.setItem('sessionData', JSON.stringify(updatedSessionData));
};

// Reset popup schedule
const resetPopupSchedule = (): void => {
  const sessionData = getSessionData();
  if (!sessionData) return;

  const updatedSessionData = {
    ...sessionData,
    nextPopupActiveTime: undefined,
    lastPopupClickTime: undefined,
    isPopupScheduled: false,
  };

  localStorage.setItem('sessionData', JSON.stringify(updatedSessionData));
};

// Record popup interaction (use server time)
const recordPopupInteraction = (type: PopupInteraction['type']): void => {
  const sessionData = getSessionData();
  if (!sessionData) {
    console.warn('No session data found, cannot record popup interaction');
    return;
  }

  const interaction: PopupInteraction = {
    type,
    timestamp: getServerNow().toISOString(),
  };

  const currentInteractions = sessionData.popupInteractions || [];
  const updatedSessionData = {
    ...sessionData,
    popupInteractions: [...currentInteractions, interaction],
  };

  localStorage.setItem('sessionData', JSON.stringify(updatedSessionData));
};

// Format countdown time (mm:ss format)
const formatCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

// Calculate popup timing using server time
const calculatePopupTiming = (): PopupTimeData => {
  const popupStartTime = getServerNow().toISOString();
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

// Calculate remaining time (seconds) using server time
const calculateRemainingTime = (): number => {
  const currentSessionData = getSessionData();
  if (!currentSessionData?.popupEndTime) {
    return 0;
  }

  const popupEnd = new Date(currentSessionData.popupEndTime);
  const now = getServerNow();
  const timeLeftMs = popupEnd.getTime() - now.getTime();
  return Math.max(0, Math.floor(timeLeftMs / 1000));
};

// Calculate remaining time in milliseconds for precise timing using server time
const calculateRemainingTimeMs = (): number => {
  const currentSessionData = getSessionData();
  if (!currentSessionData?.popupEndTime) {
    return 0;
  }

  const popupEnd = new Date(currentSessionData.popupEndTime);
  const now = getServerNow();
  return Math.max(0, popupEnd.getTime() - now.getTime());
};

// Handle countdown update
const handleCountdownUpdate = (
  countdownState: CountdownState,
  onTimeUp: () => void | Promise<void>
): void => {
  const remainingSeconds = calculateRemainingTime();
  const remainingMs = calculateRemainingTimeMs();

  // Always update display and log countdown
  updateCountdownDisplay(remainingSeconds);

  // Check if countdown reached 0 using millisecond precision
  if (remainingMs <= 0) {
    if (countdownState.interval) {
      clearInterval(countdownState.interval);
      countdownState.interval = null;
    }
    if (countdownState.unsubscribe) {
      countdownState.unsubscribe();
      countdownState.unsubscribe = null;
    }
    onTimeUp();
    Swal.close();
  }
};

// Setup countdown functionality (driven by server time via SSE)
const setupCountdown = (
  countdownState: CountdownState,
  onTimeUp: () => void | Promise<void>
): void => {
  // Initial update
  handleCountdownUpdate(countdownState, onTimeUp);

  // Subscribe to SSE server time updates to drive countdown
  countdownState.unsubscribe = subscribeSSE(() => {
    handleCountdownUpdate(countdownState, onTimeUp);
  });
};

// Cleanup countdown
const cleanupCountdown = (countdownState: CountdownState): void => {
  if (countdownState.interval) {
    clearInterval(countdownState.interval);
    countdownState.interval = null;
  }

  if (countdownState.unsubscribe) {
    countdownState.unsubscribe();
    countdownState.unsubscribe = null;
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
  const clickTime = getServerNow().toISOString();

  if (result.isConfirmed) {
    recordPopupInteraction('YES');
    // Accumulate popup waiting time into session
    try {
      const sessionData = getSessionData();
      if (sessionData?.lastPopupTime && sessionData?.popupEndTime) {
        const waitStartMs = new Date(sessionData.lastPopupTime).getTime();
        const waitEndMs = Math.min(
          new Date(clickTime).getTime(),
          new Date(sessionData.popupEndTime).getTime()
        );
        const waitSec = Math.max(0, (waitEndMs - waitStartMs) / 1000);
        const updated: Record<string, unknown> = {
          ...sessionData,
          popupWaitAccumSec: (
            sessionData as unknown as { popupWaitAccumSec?: number }
          ).popupWaitAccumSec
            ? (sessionData as unknown as { popupWaitAccumSec?: number })
                .popupWaitAccumSec! + waitSec
            : waitSec,
        };
        localStorage.setItem('sessionData', JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Failed to accumulate popup wait time:', e);
    }

    scheduleNextPopup(clickTime);
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    recordPopupInteraction('NO');
    // Accumulate popup waiting time into session
    try {
      const sessionData = getSessionData();
      if (sessionData?.lastPopupTime && sessionData?.popupEndTime) {
        const waitStartMs = new Date(sessionData.lastPopupTime).getTime();
        const waitEndMs = Math.min(
          new Date(clickTime).getTime(),
          new Date(sessionData.popupEndTime).getTime()
        );
        const waitSec = Math.max(0, (waitEndMs - waitStartMs) / 1000);
        const updated: Record<string, unknown> = {
          ...sessionData,
          popupWaitAccumSec: (
            sessionData as unknown as { popupWaitAccumSec?: number }
          ).popupWaitAccumSec
            ? (sessionData as unknown as { popupWaitAccumSec?: number })
                .popupWaitAccumSec! + waitSec
            : waitSec,
        };
        localStorage.setItem('sessionData', JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Failed to accumulate popup wait time:', e);
    }

    scheduleNextPopup(clickTime);
  }
};

// Handle auto-submit when countdown reaches 0
const handleAutoSubmit = async (): Promise<void> => {
  // Record auto-submit interaction
  recordPopupInteraction('AUTO_SUBMIT');

  // Collect and log session data for submission (placeholder)
  const sessionData = getSessionData();
  if (sessionData) {
    // Compute and persist total active/inactive times (keep decimals)
    const endTimeIso = getServerNow().toISOString();
    const totalSessionTimeSec =
      (new Date(endTimeIso).getTime() -
        new Date(sessionData.startTime).getTime()) /
      1000;
    // totalInactiveTime = totalPausedTime + accumulated popup wait
    // Add final popup wait segment for AUTO_SUBMIT (no button clicked case)
    let popupWaitAccumSec =
      (sessionData as unknown as { popupWaitAccumSec?: number })
        .popupWaitAccumSec || 0;
    if (sessionData.lastPopupTime && sessionData.popupEndTime) {
      try {
        const waitStartMs = new Date(sessionData.lastPopupTime).getTime();
        const waitEndMs = Math.min(
          getServerNow().getTime(),
          new Date(sessionData.popupEndTime).getTime()
        );
        const waitSec = Math.max(0, (waitEndMs - waitStartMs) / 1000);
        popupWaitAccumSec += waitSec;
      } catch (e) {
        console.warn('Failed to compute popup wait for auto-submit:', e);
      }
    }
    const totalInactiveTimeSec =
      (sessionData.totalPausedTime || 0) + popupWaitAccumSec;
    const totalActiveTimeSec = Math.max(
      0,
      totalSessionTimeSec - totalInactiveTimeSec
    );

    // Save back to session object
    const updatedSession = {
      ...sessionData,
      totalActiveTimeSec,
      totalInactiveTimeSec,
      popupWaitAccumSec,
    };
    localStorage.setItem('sessionData', JSON.stringify(updatedSession));

    // Build submission payload
    const payload = {
      loginId: updatedSession.loginId,
      buildNumber: updatedSession.buildData?.buildNumber,
      numberOfParts: updatedSession.buildData?.numberOfParts,
      timePerPart: updatedSession.buildData?.timePerPart,
      startTime: updatedSession.startTime,
      totalPausedTime: updatedSession.totalPausedTime,
      defects: updatedSession.defects,
      totalParts: updatedSession.totalParts,
      pauseRecords: Array.isArray(updatedSession.pauseRecords)
        ? (updatedSession.pauseRecords as PauseRecord[]).map(
            (r: PauseRecord) => ({
              start: r.startTime,
              end: r.endTime,
            })
          )
        : [],
      popupInteractions: updatedSession.popupInteractions,
      submissionType: 'AUTO_SUBMIT',
      endTime: endTimeIso,
      totalActiveTimeSec,
      totalInactiveTimeSec,
      popupWaitAccumSec,
    };

    // Await POST to backend API (frontend only for now)
    try {
      const res = await fetch(SESSIONS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.warn('Session submission failed with status:', res.status);
      } else {
        // Best-effort release of session lock after successful auto submit
        try {
          await fetch(`${SESSION_LOCKS_API_URL}/release`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loginId: updatedSession.loginId }),
          });
        } catch (e) {
          console.warn('Failed to release session lock (auto submit):', e);
        }
      }
    } catch (err) {
      console.warn('Session submission error:', err);
    }
  }

  // Clear session data and redirect to login (simulate submission complete)
  localStorage.removeItem('sessionData');

  window.location.href = '/login';
};
