import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  createBuildInfoConfig,
  loginErrorConfig,
  connectionErrorConfig,
} from '../../../modalUI/swalConfigs';

// Build data interface
interface BuildData {
  buildNumber: string;
  numberOfParts: number;
  timePerPart: number;
  createdAt: string;
  updatedAt: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [buildNumber, setBuildNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buildData, setBuildData] = useState<BuildData | null>(null);

  // Handle submit login
  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔍 Fetching build data for:', buildNumber);

      const buildData = await fetchBuildData(buildNumber); //fetch build data from server

      if (buildData) {
        setBuildData(buildData);

        // Show build info using Swal
        const buildInfoConfig = createBuildInfoConfig(loginId, buildData);
        const result = await Swal.fire(buildInfoConfig);

        if (result.isConfirmed) {
          // Store start time and save to localStorage with all keys initialized
          const startTime = new Date().toISOString();
          const sessionData = {
            loginId,
            buildData,
            startTime,
            status: 'active',
            totalPausedTime: 0,
            defects: 0,
            totalParts: 0,
            // Popup countdown related properties
            lastPopupTime: undefined,
            popupEndTime: undefined,
            popupCountdownActive: false,
            // Popup interactions tracking
            popupInteractions: [],
            // Next popup scheduling properties
            nextPopupActiveTime: undefined,
            lastPopupClickTime: undefined,
            isPopupScheduled: false,
            // Pause records
            pauseRecords: [],
            // Time calculation properties (for submission)
            totalActiveTimeSec: undefined,
            totalInactiveTimeSec: undefined,
            popupWaitAccumSec: 0,
            endTime: undefined,
            submissionType: undefined,
          };

          // Save to localStorage
          localStorage.clear();
          localStorage.setItem('sessionData', JSON.stringify(sessionData));

          // Navigate to timer
          navigate('/timer');
        }
        // If cancelled, stay on login page (no navigation needed)
      } else {
        // Show alert
        Swal.fire(loginErrorConfig);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      // Show alert
      Swal.fire(connectionErrorConfig);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login id change
  const handleLoginIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginId(e.target.value);
  };

  // Handle build number change
  const handleBuildNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuildNumber(e.target.value);
  };

  return {
    loginId,
    buildNumber,
    isLoading,
    buildData,
    handleSubmitLogin,
    handleLoginIdChange,
    handleBuildNumberChange,
  };
};

// Fetch build data
const fetchBuildData = async (
  buildNumber: string
): Promise<BuildData | null> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/builds/validate/${buildNumber}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result.data;
    } else {
      console.log('❌ Build number not found');
      return null;
    }
  } catch (error) {
    console.error('❌ Can not connect to server:', error);
    throw error;
  }
};
