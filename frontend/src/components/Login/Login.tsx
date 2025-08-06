import { useState } from 'react';
import Swal from 'sweetalert2';

// component
const Login = () => {
  const [loginId, setLoginId] = useState('');
  const [buildNumber, setBuildNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      } else {
        console.log('❌ Login failed: Build number does not exist');
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

  return (
    <div className='flex justify-center items-center px-4 min-h-screen bg-white'>
      <div className='p-8 w-full max-w-md bg-white rounded-xl shadow-lg'>
        <h1 className='mb-8 text-3xl font-bold text-center text-gray-900'>
          Login
        </h1>

        <form onSubmit={handleSubmitLogin} className='space-y-6'>
          <div>
            <label
              htmlFor='loginId'
              className='block mb-2 text-sm font-medium text-gray-700'
            >
              Login ID
            </label>
            <input
              type='text'
              id='loginId'
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder='Enter your login ID'
              className='px-4 py-3 w-full rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent'
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor='buildNumber'
              className='block mb-2 text-sm font-medium text-gray-700'
            >
              Build Number
            </label>
            <input
              type='text'
              id='buildNumber'
              value={buildNumber}
              onChange={(e) => setBuildNumber(e.target.value)}
              placeholder='Enter build number'
              className='px-4 py-3 w-full rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent'
              required
              disabled={isLoading}
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
          >
            {isLoading ? 'Checking...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

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
