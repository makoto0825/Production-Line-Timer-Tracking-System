import React from 'react';
import Card from '../../commonComponents/Card';
import Button from '../../commonComponents/Button';

const FinalSubmission: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br via-blue-50 to-indigo-100 from-slate-50'>
      {/* Header Section */}
      <div className='pt-8 pb-6 text-center'>
        <h1 className='px-4 mb-5 text-xl font-black tracking-wider leading-normal text-gray-800 sm:text-2xl md:text-3xl'>
          Final Submission
        </h1>
      </div>

      {/* Main Content */}
      <div className='flex justify-center items-start px-4 pb-8'>
        <div className='w-full max-w-4xl'>
          {/* Total Parts Entry Card */}
          <Card
            title='Enter Total Parts'
            className='mb-6'
            content={
              <div className='mx-auto max-w-md'>
                <div>
                  <label
                    htmlFor='totalParts'
                    className='block mb-2 text-sm font-medium text-gray-700'
                  >
                    Total Parts Completed
                  </label>
                  <input
                    type='number'
                    id='totalParts'
                    placeholder='0'
                    min='0'
                    className='px-4 py-3 w-full rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                    disabled
                  />
                  <p className='mt-1 text-xs text-gray-400'>
                    (Layout only / disabled)
                  </p>
                </div>
              </div>
            }
          />

          {/* Action Buttons Card */}
          <Card
            title='Actions'
            content={
              <div className='flex gap-4 justify-center'>
                <Button variant='secondary' disabled>
                  Back
                </Button>
                <Button variant='success' disabled>
                  Submit
                </Button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default FinalSubmission;
