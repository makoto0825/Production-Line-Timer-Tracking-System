import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const useLogin = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [buildNumber, setBuildNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //handle submit login
  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔍 Checking build number:', buildNumber);

      const buildExists = await checkBuildNumber(buildNumber);

      if (buildExists) {
        console.log('✅ Login successful:', {
          loginId: loginId,
          buildNumber: buildNumber,
        });
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
      //show alert
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

  //handle login id change
  const handleLoginIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginId(e.target.value);
  };

  //handle build number change
  const handleBuildNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuildNumber(e.target.value);
  };

  return {
    loginId,
    buildNumber,
    isLoading,
    handleSubmitLogin,
    handleLoginIdChange,
    handleBuildNumberChange,
  };
};

// functions
const checkBuildNumber = async (buildNumber: string) => {
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
      const data = await response.json();
      console.log('✅ Build number exists:', data);
      return true;
    } else {
      console.log('❌ Build number not found');
      return false;
    }
  } catch (error) {
    console.error('❌ Can not connect to server:', error);
    throw error;
  }
};
