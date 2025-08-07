import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface BuildData {
  buildNumber: string;
  numberOfParts: number;
  timePerPart: number;
}

interface SessionData {
  loginId: string;
  buildData: BuildData;
  startTime: string;
  status: string;
  totalPausedTime: number;
  defects: number;
}

export const useTimer = () => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [defects, setDefects] = useState('');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  // Load session data from localStorage on component mount
  useEffect(() => {
    const storedSession = localStorage.getItem('sessionData');
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        setSessionData(parsedSession);
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    }
  }, []);

  // Use session data from localStorage or fallback to default values
  const timerData = {
    loginId: sessionData?.loginId || 'Unknown User',
    buildNumber: sessionData?.buildData?.buildNumber || 'Unknown Build',
    numberOfParts: sessionData?.buildData?.numberOfParts || 0,
    timePerPart: sessionData?.buildData?.timePerPart || 0,
    timeLeft: '00:45:30', // Mock timer display - will be calculated based on startTime
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
    mockData: timerData,
    handlePause,
    handleNext,
    handleDefectsChange,
  };
};
