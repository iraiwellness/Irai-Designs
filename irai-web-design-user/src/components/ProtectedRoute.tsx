import { Navigate } from 'react-router-dom';
import { useAuth, userHomePath } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireOnboarded = true }: {
  children: React.ReactNode;
  requireOnboarded?: boolean;
}) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (requireOnboarded && !user.onboarded) return <Navigate to={userHomePath(user)} replace />;

  return <>{children}</>;
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user) return <Navigate to={userHomePath(user)} replace />;
  return <>{children}</>;
}
