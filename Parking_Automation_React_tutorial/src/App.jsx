
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, ROUTE_ACCESS } from '@/auth';
import { AuthGuard, RoleGuard } from '@/components/guards';
import { DashboardLayout } from '@/components/Layouts';
import Login from '@/pages/Login';
import Overview from '@/pages/Overview';
import Sessions from '@/pages/Sessions';
import Zones from '@/pages/Zones';
import Operators from './pages/Operators';
import Supervisors from './pages/Supervisers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function AppRoutes(){
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }
      >
          <Route path="/dashboard" element={<RoleGuard roles={ROUTE_ACCESS.dashboard}><Overview /></RoleGuard>} />
          <Route path="/sessions" element={<RoleGuard roles={ROUTE_ACCESS.sessions}><Sessions /></RoleGuard>} />
          <Route path="/zones" element={<RoleGuard roles={ROUTE_ACCESS.zones}><Zones /></RoleGuard>} />
          <Route path="/operators" element={<RoleGuard roles={ROUTE_ACCESS.operators}><Operators /></RoleGuard>} />
          <Route path="/supervisors" element={<RoleGuard roles={ROUTE_ACCESS.supervisors}><Supervisors /></RoleGuard>} />
          <Route path="/reports" element={<RoleGuard roles={ROUTE_ACCESS.reports}><Reports /></RoleGuard>} />
          <Route path="/settings" element={<RoleGuard roles={ROUTE_ACCESS.settings}><Settings /></RoleGuard>} />

      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes/>
    </AuthProvider>
  );
}
