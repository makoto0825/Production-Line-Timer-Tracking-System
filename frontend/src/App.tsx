import { useState } from 'react';
import Login from './components/Login/Login';
import Timer from './components/Timer/Timer';

const App = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'timer'>('login');

  const handleLoginSuccess = () => {
    setCurrentPage('timer');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  return (
    <>
      {currentPage === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 'timer' && <Timer onBackToLogin={handleBackToLogin} />}
    </>
  );
};

export default App;
