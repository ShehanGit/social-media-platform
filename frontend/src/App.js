import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedPage from './pages/ProtectedPage';
import CurrentWeather from './pages/CurrentWeather';
import Forecast from './pages/Forecast';
import CropApp from './pages/CropPage';
import CropDetails from './pages/CropDetails';
import FeedPage from './pages/FeedPage';
import { getToken } from './Utiliti/auth';

function App() {
  const isAuthenticated = !!getToken();

  return (
    <Router>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<CurrentWeather />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/forecast"
            element={isAuthenticated ? <Forecast /> : <Navigate to="/login" />}
          />

          <Route
            path="/feed"
            element={isAuthenticated ? <FeedPage /> : <Navigate to="/login" />}
          />
  
        </Routes>
      </div>
    </Router>
  );
}

export default App;
