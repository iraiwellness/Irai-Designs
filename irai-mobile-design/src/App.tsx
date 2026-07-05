import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import RolePicker from './pages/RolePicker';
import Login      from './pages/Login';

// Practitioner app
import Layout                  from './components/Layout';
import Home                    from './pages/Home';
import Clients                 from './pages/Clients';
import Schedule                from './pages/Schedule';
import Chats                   from './pages/Chats';
import Profile                 from './pages/Profile';
import PatientDetail           from './pages/PatientDetail';
import PractitionerSessionRoom from './pages/PractitionerSessionRoom';

// Admin app
import AdminLayout        from './components/AdminLayout';
import AdminDashboard     from './pages/admin/Dashboard';
import AdminBookings      from './pages/admin/Bookings';
import AdminGroupSessions from './pages/admin/GroupSessions';
import AdminTherapists    from './pages/admin/Therapists';
import AdminUsers         from './pages/admin/Users';
import AdminDisputes      from './pages/admin/Disputes';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public ──────────────────────────────────────────────── */}
          <Route path="/"      element={<RolePicker />} />
          <Route path="/login" element={<Login />} />

          {/* ── Practitioner App ────────────────────────────────────── */}
          <Route
            path="/practitioner"
            element={
              <ProtectedRoute role="practitioner">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index              element={<Home />} />
            <Route path="clients"     element={<Clients />} />
            <Route path="clients/:id" element={<PatientDetail />} />
            <Route path="schedule"    element={<Schedule />} />
            <Route path="chats"       element={<Chats />} />
            <Route path="profile"     element={<Profile />} />
          </Route>

          {/* ── Practitioner Session Room (outside Layout — full screen) ── */}
          <Route
            path="/practitioner/session/:id"
            element={
              <ProtectedRoute role="practitioner">
                <PractitionerSessionRoom />
              </ProtectedRoute>
            }
          />

          {/* ── Admin App ───────────────────────────────────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index                element={<AdminDashboard />} />
            <Route path="bookings"      element={<AdminBookings />} />
            <Route path="sessions"      element={<AdminGroupSessions />} />
            <Route path="therapists"    element={<AdminTherapists />} />
            <Route path="users"         element={<AdminUsers />} />
            <Route path="disputes"      element={<AdminDisputes />} />
          </Route>

          {/* ── Fallback ────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
