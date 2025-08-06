import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './components/Login/Login';
import Timer from './components/Timer/Timer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<Login />} />
        <Route path='/timer' element={<Timer />} />
      </Routes>
    </Router>
  );
};

export default App;
