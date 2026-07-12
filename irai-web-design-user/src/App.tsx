import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserLayout from './components/UserLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import Onboarding from './pages/Onboarding';

import Home from './pages/user/Home';
import Booking from './pages/user/Booking';
import Sessions from './pages/user/Sessions';
import GroupSessions from './pages/user/GroupSessions';
import Insights from './pages/user/Insights';
import Profile from './pages/user/Profile';
import HealthVault from './pages/user/HealthVault';
import SessionRoom from './pages/user/SessionRoom';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/onboarding" element={<Onboarding />} />

          <Route path="/user" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="booking" element={<Booking />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="group-sessions" element={<GroupSessions />} />
            <Route path="insights" element={<Insights />} />
            <Route path="profile" element={<Profile />} />
            <Route path="health-vault" element={<HealthVault />} />
          </Route>

          <Route path="/user/session-room" element={<ProtectedRoute><SessionRoom /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
