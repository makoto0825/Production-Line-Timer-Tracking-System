import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const useTimer = () => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [defects, setDefects] = useState('');

  // Mock data for UI demonstration
  const mockData = {
    loginId: 'John Doe',
    buildNumber: 'B00001',
    numberOfParts: 25,
    timePerPart: 2,
    timeLeft: '00:45:30', // Mock timer display
  };

  //handle pause
  const handlePause = () => {
    setIsPaused(true);
    //show alert
    Swal.fire({
      title: 'Timer Paused',
      html: `
        <div class="text-center">
          <p>Work is currently paused. Click Resume to continue.</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: false,
      confirmButtonText: 'Resume',
      confirmButtonColor: '#ec4899',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCloseButton: false,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton:
          'bg-gradient-to-r from-pink-500 to-orange-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIsPaused(false);
      }
    });
  };

  //handle next
  const handleNext = () => {
    console.log('Navigate to Page 3');
    navigate('/login');
  };

  //handle defects change
  const handleDefectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefects(e.target.value);
  };

  return {
    isPaused,
    defects,
    mockData,
    handlePause,
    handleNext,
    handleDefectsChange,
  };
};
