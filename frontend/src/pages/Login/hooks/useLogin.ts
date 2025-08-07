import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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

      const buildData = await fetchBuildData(buildNumber);

      if (buildData) {
        console.log('✅ Login successful:', {
          loginId: loginId,
          buildNumber: buildNumber,
          buildData: buildData,
        });
        setBuildData(buildData);
        // TODO: Navigate to build info display page instead of timer
        navigate('/timer');
      } else {
        console.log('❌ Login failed: Build number does not exist');
        // Show alert
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Build number does not exist. Please check and try again.',
          confirmButtonColor: '#ec4899',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      // Show alert
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Failed to connect to server. Please check your connection and try again.',
        confirmButtonColor: '#ec4899',
        confirmButtonText: 'OK',
      });
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

// Functions
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
      console.log('✅ Build data fetched:', result.data);
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
