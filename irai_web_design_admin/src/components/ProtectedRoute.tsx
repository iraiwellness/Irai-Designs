import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type Role } from '../context/AuthContext';

export default function ProtectedRoute({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || user?.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}
