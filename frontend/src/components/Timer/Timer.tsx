import { useState } from 'react';

const Timer = () => {
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

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleNext = () => {
    console.log('Navigate to Page 3');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br via-blue-50 to-indigo-100 from-slate-50'>
      {/* Header Section */}
      <div className='pt-8 pb-6 text-center'>
        <h1 className='px-4 mb-5 text-xl font-black tracking-wider leading-normal text-gray-800 sm:text-2xl md:text-3xl'>
          Timer & Work Tracking
        </h1>
      </div>

      {/* Main Content */}
      <div className='flex justify-center items-start px-4 pb-8'>
        <div className='w-full max-w-4xl'>
          {/* Build Info Card */}
          <div className='p-6 mb-6 rounded-2xl border shadow-xl backdrop-blur-sm bg-white/80 border-white/20'>
            <h2 className='mb-4 text-lg font-bold text-center text-gray-800'>
              Build Information
            </h2>
            <div className='grid grid-cols-2 gap-4 text-center md:grid-cols-4'>
              <div className='p-3 bg-gray-50 rounded-lg'>
                <p className='text-sm text-gray-600'>Login ID</p>
                <p className='font-semibold text-gray-800'>
                  {mockData.loginId}
                </p>
              </div>
              <div className='p-3 bg-gray-50 rounded-lg'>
                <p className='text-sm text-gray-600'>Build Number</p>
                <p className='font-semibold text-gray-800'>
                  {mockData.buildNumber}
                </p>
              </div>
              <div className='p-3 bg-gray-50 rounded-lg'>
                <p className='text-sm text-gray-600'>Number of Parts</p>
                <p className='font-semibold text-gray-800'>
                  {mockData.numberOfParts}
                </p>
              </div>
              <div className='p-3 bg-gray-50 rounded-lg'>
                <p className='text-sm text-gray-600'>Time Per Part</p>
                <p className='font-semibold text-gray-800'>
                  {mockData.timePerPart} min
                </p>
              </div>
            </div>
          </div>

          {/* Timer Card */}
          <div className='p-8 mb-6 rounded-2xl border shadow-xl backdrop-blur-sm bg-white/80 border-white/20'>
            <h2 className='mb-6 text-lg font-bold text-center text-gray-800'>
              Production Timer
            </h2>
            <div className='mb-6 text-center'>
              <div className='inline-block p-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl shadow-lg'>
                <div className='text-4xl font-black tracking-wider text-white md:text-6xl'>
                  {mockData.timeLeft}
                </div>
                <p className='mt-2 text-sm text-white/80'>Remaining Time</p>
              </div>
            </div>

            {/* Timer Controls */}
            <div className='flex gap-4 justify-center mb-6'>
              <button
                onClick={handlePause}
                disabled={isPaused}
                className='px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              >
                Pause
              </button>
              <button
                onClick={handleNext}
                className='px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200'
              >
                Next
              </button>
            </div>
          </div>

          {/* Defects Entry Card */}
          <div className='p-6 rounded-2xl border shadow-xl backdrop-blur-sm bg-white/80 border-white/20'>
            <h2 className='mb-4 text-lg font-bold text-center text-gray-800'>
              Defects Entry
            </h2>
            <div className='mx-auto max-w-md'>
              <label
                htmlFor='defects'
                className='block mb-2 text-sm font-medium text-gray-700'
              >
                Number of Defects Encountered
              </label>
              <input
                type='number'
                id='defects'
                value={defects}
                onChange={(e) => setDefects(e.target.value)}
                placeholder='Enter number of defects'
                className='px-4 py-3 w-full rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                min='0'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <div className='flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-black/50'>
          <div className='p-8 mx-4 max-w-md bg-white rounded-2xl shadow-2xl'>
            <div className='text-center'>
              <div className='inline-flex justify-center items-center mb-4 w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl shadow-lg'>
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h3 className='mb-4 text-xl font-bold text-gray-800'>
                Timer Paused
              </h3>
              <p className='mb-6 text-gray-600'>
                Work is currently paused. Click Resume to continue.
              </p>
              <button
                onClick={handleResume}
                className='w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200'
              >
                Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
