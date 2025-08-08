import { useState, useEffect } from 'react';

export const useFinalSubmission = () => {
  const [totalParts, setTotalParts] = useState('0');

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

  return {
    totalParts,
    handleTotalPartsChange,
  };
};
