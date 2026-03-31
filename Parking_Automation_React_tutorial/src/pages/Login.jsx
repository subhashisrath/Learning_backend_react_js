import react, {useState} from 'react'
import {useAuth, ROLES, DEMO_USERS} from '@/auth'
import {Navigate, useLocation} from 'react-router-dom'

export default function Login() {
    const {isAuthenticated, login, loginAs} = useAuth();
    const location = useLocation();
    const from = location.state?.from || '/dashboard';
    const [email, setEmail] = useState(DEMO_USERS[0].email);
    const [password, setPassword] = useState(DEMO_USERS[0].password)
    const [error, setError] = useState(null);

    if (isAuthenticated) return <Navigate to={from} replace />;

    const handleSubmit = (e) => {
        e.preventDefault();
        const res = login(email, password);
        if (!res.ok) setError(res.error);
        else setError('');
    };

    const handleQuickLogin = (role) => {
        const res = loginAs(role);
        if (!res.ok) setError(res.error);
        else setError('');
    };

    return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-950 via-surface-900 to-primary-900 px-4">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Brand */}
        <div className="mb-8 text-center">
          <img src="/Assets/mivo.png" alt="Mivo" className="mx-auto mb-4 h-16 w-auto" />
          <h1 className="text-2xl font-bold text-white">Mivo Admin</h1>
          <p className="mt-1 text-sm text-surface-400">Smart On-Street Parking Management</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-inset ring-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-surface-500 backdrop-blur transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="name@parking.in"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-surface-500 backdrop-blur transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 hover:shadow-primary-500/30 active:scale-[0.98]">
              Sign In
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-surface-500 uppercase tracking-wider">Quick Demo</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickLogin(ROLES.GOVT_ADMIN)}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              🏛️ Govt Admin
            </button>
            <button
              onClick={() => handleQuickLogin(ROLES.SUPERVISOR)}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              👷 Supervisor
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}
