import { useLogin } from './hooks/useLogin';

const Login = () => {
  const {
    loginId,
    buildNumber,
    isLoading,
    handleSubmitLogin,
    handleLoginIdChange,
    handleBuildNumberChange,
  } = useLogin(); //custom hook

  return (
    <div className='min-h-screen bg-gradient-to-br via-blue-50 to-indigo-100 from-slate-50'>
      {/* Title Section */}
      <div className='pt-16 pb-12 text-center'>
        <div className='inline-flex justify-center items-center mb-6 w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl shadow-lg'>
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
              d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <h1 className='px-4 font-black text-gray-800 sm:text-3xl md:text-4xl lg:text-5xl'>
          Production-Line-Timer-Tracking-System
        </h1>
      </div>

      {/* Login Form */}
      <div className='flex justify-center items-center px-4'>
        <div className='p-8 w-full max-w-md rounded-2xl border shadow-xl backdrop-blur-sm bg-white/80 border-white/20'>
          <h2 className='mb-8 text-2xl font-bold text-center text-gray-800'>
            Login
          </h2>

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
                onChange={handleLoginIdChange}
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
                onChange={handleBuildNumberChange}
                placeholder='Enter build number'
                className='px-4 py-3 w-full rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                required
                disabled={isLoading}
              />
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            >
              {isLoading ? 'Checking...' : 'Login'}
            </button>
          </form>

          {/* How to Use / External Link */}
          <div className='mt-6'>
            <a
              href='https://github.com/makoto0825/Production-Line-Timer-Tracking-System'
              target='_blank'
              rel='noopener noreferrer'
              className='block w-full text-center border border-pink-500 text-pink-600 font-semibold py-3 px-4 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white/70'
            >
              How to Use (GitHub)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
