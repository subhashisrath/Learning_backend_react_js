import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth';

export function Authguard({children}) {
    const {isAuthenticated } = useAuth();
    const location = useLocation();
    if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    return children;
}

export function RoleGuard({ roles, children }) {
  const { role } = useAuth();
  if (roles && !roles.includes(role)) return <Navigate to="/not-authorized" replace />;
  return children;
}

export { Authguard as AuthGuard };

