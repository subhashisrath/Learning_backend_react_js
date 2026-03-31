import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { ROLES, findDemoUser } from './roles';

const STORAGE_KEY = 'parksmart_session';

const readSession = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { isAuthenticated: false, user: null, role: null };
    const parsed = JSON.parse(stored);
    if (parsed?.user && Object.values(ROLES).includes(parsed.role)) {
      return { isAuthenticated: true, user: parsed.user, role: parsed.role };
    }
  } catch { /* ignore */ }
  return { isAuthenticated: false, user: null, role: null };
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const login = useCallback((email, password) => {
    const user = findDemoUser(email, password);
    if (!user) return { ok: false, error: 'Invalid email or password.' };
    const safe = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, assignedZones: user.assignedZones };
    const next = { isAuthenticated: true, user: safe, role: safe.role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
    return { ok: true };
  }, []);

  const loginAs = useCallback((role) => {
    if (!Object.values(ROLES).includes(role)) return { ok: false, error: 'Invalid role.' };
    const user = role === ROLES.GOVT_ADMIN
      ? { id: 'gov-001', name: 'Rajesh Kumar', email: 'admin@gov.in', role, avatar: 'RK' }
      : { id: 'sup-001', name: 'Priya Sharma', email: 'supervisor@parking.in', role, avatar: 'PS', assignedZones: ['ZN-001', 'ZN-002', 'ZN-003'] };
    const next = { isAuthenticated: true, user, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession({ isAuthenticated: false, user: null, role: null });
  }, []);

  const value = useMemo(() => ({
    ...session,
    login,
    loginAs,
    logout,
    isAdmin: session.role === ROLES.GOVT_ADMIN,
    isSupervisor: session.role === ROLES.SUPERVISOR,
  }), [session, login, loginAs, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}