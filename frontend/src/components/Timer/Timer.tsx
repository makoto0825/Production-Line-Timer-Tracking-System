import { Card, Button, Input, InfoGrid } from './index';
import { useTimer } from './hooks/useTimer';

const Timer = () => {
  const {
    isPaused,
    defects,
    mockData,
    handlePause,
    handleNext,
    handleDefectsChange,
  } = useTimer(); //custom hook

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
          <Card
            title='Build Information'
            className='mb-6'
            content={
              <InfoGrid
                items={[
                  { label: 'Login ID', value: mockData.loginId },
                  { label: 'Build Number', value: mockData.buildNumber },
                  { label: 'Number of Parts', value: mockData.numberOfParts },
                  {
                    label: 'Time Per Part',
                    value: `${mockData.timePerPart} min`,
                  },
                ]}
              />
            }
          />

          {/* Timer Card */}
          <Card
            title='Production Timer'
            className='p-8 mb-6'
            content={
              <>
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
                  <Button
                    onClick={handlePause}
                    disabled={isPaused}
                    variant='secondary'
                  >
                    Pause
                  </Button>
                  <Button onClick={handleNext} variant='success'>
                    Next
                  </Button>
                </div>
              </>
            }
          />

          {/* Defects Entry Card */}
          <Card
            title='Defects Entry'
            content={
              <div className='mx-auto max-w-md'>
                <Input
                  type='number'
                  id='defects'
                  label='Number of Defects Encountered'
                  value={defects}
                  onChange={handleDefectsChange}
                  placeholder='Enter number of defects'
                  min='0'
                />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;
