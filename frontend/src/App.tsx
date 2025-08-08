import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login/Login';
import Timer from './pages/Timer/Timer';
import FinalSubmission from './pages/FinalSubmission';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<Login />} />
        <Route path='/timer' element={<Timer />} />
        <Route path='/final' element={<FinalSubmission />} />
      </Routes>
    </Router>
  );
};

export default App;
