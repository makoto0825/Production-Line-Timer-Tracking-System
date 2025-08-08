import { useState, useEffect } from 'react';

// API endpoint for session submission
const SESSIONS_API_URL = 'http://localhost:5000/api/sessions';

export const useFinalSubmission = () => {
  const [totalParts, setTotalParts] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load totalParts from session data on component mount
  useEffect(() => {
    const sessionData = localStorage.getItem('sessionData');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        if (parsed.totalParts !== undefined) {
          setTotalParts(parsed.totalParts.toString());
        } else {
          // Initialize totalParts if not exists
          const updated = {
            ...parsed,
            totalParts: 0,
          };
          localStorage.setItem('sessionData', JSON.stringify(updated));
          setTotalParts(parsed.totalParts?.toString() || '0');
        }
      } catch (e) {
        console.warn('Failed to parse session data:', e);
      }
    }
  }, []);

  const handleTotalPartsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTotalParts(newValue);

    // Update session data in localStorage
    const sessionData = localStorage.getItem('sessionData');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        const updated = {
          ...parsed,
          totalParts: parseInt(newValue) || 0,
        };
        localStorage.setItem('sessionData', JSON.stringify(updated));
        console.log('Updated totalParts in session data:', updated.totalParts);
      } catch (e) {
        console.warn('Failed to update session data:', e);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log('Manual submitting session data...');

    try {
      const sessionData = localStorage.getItem('sessionData');
      if (!sessionData) {
        throw new Error('No session data found');
      }

      const parsed = JSON.parse(sessionData);

      // Calculate session times
      const endTimeIso = new Date().toISOString();
      const totalSessionTimeSec =
        (new Date(endTimeIso).getTime() -
          new Date(parsed.startTime).getTime()) /
        1000;
      const popupWaitAccumSec = parsed.popupWaitAccumSec || 0;
      const totalInactiveTimeSec =
        (parsed.totalPausedTime || 0) + popupWaitAccumSec;
      const totalActiveTimeSec = Math.max(
        0,
        totalSessionTimeSec - totalInactiveTimeSec
      );

      // Build submission payload
      const payload = {
        loginId: parsed.loginId,
        buildNumber: parsed.buildData?.buildNumber,
        numberOfParts: parsed.buildData?.numberOfParts,
        timePerPart: parsed.buildData?.timePerPart,
        startTime: parsed.startTime,
        totalPausedTime: parsed.totalPausedTime,
        defects: parsed.defects,
        totalParts: parsed.totalParts,
        pauseRecords: parsed.pauseRecords,
        popupInteractions: parsed.popupInteractions,
        submissionType: 'MANUAL',
        endTime: endTimeIso,
        totalActiveTimeSec,
        totalInactiveTimeSec,
        popupWaitAccumSec,
      };

      // Send to backend API
      const res = await fetch(SESSIONS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Submission failed with status: ${res.status}`);
      }

      console.log('Manual session submission succeeded');

      // Clear session data and redirect to login
      localStorage.removeItem('sessionData');
      window.location.href = '/login';
    } catch (error) {
      console.error('Manual submission error:', error);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    totalParts,
    handleTotalPartsChange,
    handleSubmit,
    isSubmitting,
  };
};
