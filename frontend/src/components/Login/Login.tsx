import { useState } from 'react';

const Login = () => {
  const [loginId, setLoginId] = useState('');
  const [buildNumber, setBuildNumber] = useState('');

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Login successful:', {
      loginId: loginId,
      buildNumber: buildNumber,
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4'>
      <div className='bg-white p-8 rounded-xl shadow-lg w-full max-w-md'>
        <h1 className='text-3xl font-bold text-gray-900 text-center mb-8'>
          Login
        </h1>

        <form onSubmit={handleSubmitLogin} className='space-y-6'>
          <div>
            <label
              htmlFor='loginId'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Login ID
            </label>
            <input
              type='text'
              id='loginId'
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder='Enter your login ID'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors'
              required
            />
          </div>

          <div>
            <label
              htmlFor='buildNumber'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Build Number
            </label>
            <input
              type='text'
              id='buildNumber'
              value={buildNumber}
              onChange={(e) => setBuildNumber(e.target.value)}
              placeholder='Enter build number'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
