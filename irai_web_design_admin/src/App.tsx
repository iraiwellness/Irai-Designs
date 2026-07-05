import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import RolePicker from './pages/RolePicker';
import Login from './pages/Login';

import PractitionerLayout from './components/PractitionerLayout';
import PractitionerHome from './pages/practitioner/Home';
import Clients from './pages/practitioner/Clients';
import PatientDetail from './pages/practitioner/PatientDetail';
import Schedule from './pages/practitioner/Schedule';
import Messages from './pages/practitioner/Messages';
import Profile from './pages/practitioner/Profile';
import SessionRoom from './pages/practitioner/SessionRoom';

import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBookings from './pages/admin/Bookings';
import AdminGroupSessions from './pages/admin/GroupSessions';
import AdminTherapists from './pages/admin/Therapists';
import AdminUsers from './pages/admin/Users';
import AdminDisputes from './pages/admin/Disputes';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"      element={<RolePicker />} />
          <Route path="/login" element={<Login />} />

          <Route path="/practitioner" element={<ProtectedRoute role="practitioner"><PractitionerLayout /></ProtectedRoute>}>
            <Route index              element={<PractitionerHome />} />
            <Route path="clients"     element={<Clients />} />
            <Route path="clients/:id" element={<PatientDetail />} />
            <Route path="schedule"    element={<Schedule />} />
            <Route path="chats"       element={<Messages />} />
            <Route path="profile"     element={<Profile />} />
          </Route>

          <Route path="/practitioner/session/:id" element={<ProtectedRoute role="practitioner"><SessionRoom /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index           element={<AdminDashboard />} />
            <Route path="bookings"   element={<AdminBookings />} />
            <Route path="sessions"   element={<AdminGroupSessions />} />
            <Route path="therapists" element={<AdminTherapists />} />
            <Route path="users"      element={<AdminUsers />} />
            <Route path="disputes"   element={<AdminDisputes />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
