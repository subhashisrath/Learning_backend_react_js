import { useState, useEffect, useCallback } from 'react';
import { ArrowDownTrayIcon, CurrencyRupeeIcon, ClockIcon, ChartBarIcon, BoltIcon } from '@heroicons/react/24/outline';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/auth';
import { api } from '@/services/api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const fmt = (n) => n.toLocaleString('en-IN');

export default function Reports() {
  const { user, isAdmin } = useAuth();
  const [dateRange, setDateRange] = useState('week');
  const [data, setData] = useState({ sessions: [], revenueTrend: [], hourly: [], zones: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, rRes, hRes, zRes] = await Promise.all([
        api.sessions.getAll(),
        api.dashboard.getRevenueTrend(),
        api.dashboard.getHourlyDistribution(),
        api.zones.getAll()
      ]);
      if (sRes.ok && rRes.ok && hRes.ok && zRes.ok) {
        let filteredSessions = sRes.data;
        let filteredZones = zRes.data;

        if (!isAdmin && user?.assignedZones) {
          filteredSessions = filteredSessions.filter(s => user.assignedZones.includes(s.zoneId));
          filteredZones = filteredZones.filter(z => user.assignedZones.includes(z.id));
        }

        setData({ sessions: filteredSessions, revenueTrend: rRes.data, hourly: hRes.data, zones: filteredZones });
      } else throw new Error('Analytics fetch failed');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user?.assignedZones]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { sessions: allSessions, revenueTrend, hourly, zones: allZones } = data;

  const totalSessions = allSessions.length;
  const totalRevenue = allSessions.reduce((s, se) => s + se.amount, 0);
  const avgDuration = '1h 24m';
  const peakHour = '6PM';

  const zoneRevenue = allZones
    .filter((z) => z.status === 'active')
    .map((z) => {
      const zoneSessions = allSessions.filter((s) => s.zoneId === z.id);
      return { 
        name: z.name.replace(' Zone', ''), 
        revenue: zoneSessions.reduce((s, se) => s + se.amount, 0), 
        sessions: zoneSessions.length,
        totalSpots: z.totalSpots,
        occupiedSpots: z.occupiedSpots
      };
    });

  const pieData = zoneRevenue.filter((z) => z.revenue > 0);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-200 border-t-primary-600" />
    </div>
  );

  if (error) return (
    <div className="card p-8 text-center text-red-600 border-red-100 bg-red-50">
      <p>{error}</p>
      <button onClick={fetchData} className="btn-primary mt-4">Retry</button>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">Reports</h2>
          <p className="text-sm text-surface-500">
            {isAdmin ? 'City-wide reporting and analytics' : 'Reports for assigned zones'}
          </p>
        </div>
        <div className="flex gap-2">
          {['day', 'week', 'month'].map((r) => (
            <button key={r} onClick={() => setDateRange(r)} className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${dateRange === r ? 'bg-primary-600 text-white' : 'border border-surface-300 text-surface-600 hover:bg-surface-50'}`}>
              {r}
            </button>
          ))}
          <button onClick={() => downloadCSV(allSessions, `reports_${dateRange}`)} className="btn-secondary text-xs transition-transform active:scale-95">
            <ArrowDownTrayIcon className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: CurrencyRupeeIcon, label: 'Total Revenue', value: `₹${fmt(totalRevenue)}`, color: 'bg-emerald-600' },
          { icon: ClockIcon, label: 'Total Sessions', value: totalSessions, color: 'bg-primary-600' },
          { icon: ChartBarIcon, label: 'Avg Duration', value: avgDuration, color: 'bg-amber-500' },
          { icon: BoltIcon, label: 'Peak Hour', value: peakHour, color: 'bg-purple-600' },
        ].map((kpi) => (
          <div key={kpi.label} className="card">
            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${kpi.color}`}>
              <kpi.icon className="h-4 w-4 text-white" />
            </div>
            <p className="text-xl font-bold text-surface-900">{kpi.value}</p>
            <p className="text-sm text-surface-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue Trend */}
        <div className="card">
          <h3 className="mb-1 text-base font-semibold text-surface-900">Revenue Trend</h3>
          <p className="mb-4 text-sm text-surface-500">Monthly revenue (₹)</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v) => [`₹${fmt(v)}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Zone Revenue Pie */}
        <div className="card">
          <h3 className="mb-1 text-base font-semibold text-surface-900">Revenue by Zone</h3>
          <p className="mb-4 text-sm text-surface-500">Revenue distribution</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: '11px' }}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`₹${fmt(v)}`, 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Distribution */}
      <div className="card">
        <h3 className="mb-1 text-base font-semibold text-surface-900">Hourly Session Distribution</h3>
        <p className="mb-4 text-sm text-surface-500">Average sessions per hour</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={hourly} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Zone Summary Table */}
      <div className="table-container">
        <div className="border-b border-surface-200 px-4 py-3">
          <h3 className="font-semibold text-surface-900">Zone-wise Summary</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Zone</th>
              <th>Sessions</th>
              <th>Revenue</th>
              <th>Capacity</th>
              <th>Occupancy</th>
            </tr>
          </thead>
          <tbody>
            {zoneRevenue.map((z) => {
              const occ = z.totalSpots > 0 ? Math.round((z.occupiedSpots / z.totalSpots) * 100) : 0;
              return (
                <tr key={z.name}>
                  <td className="font-medium text-surface-900">{z.name}</td>
                  <td>{z.sessions}</td>
                  <td className="font-medium">₹{fmt(z.revenue)}</td>
                  <td>{z.totalSpots || 0}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-surface-200">
                        <div className="h-1.5 rounded-full bg-primary-500" style={{ width: `${occ}%` }} />
                      </div>
                      <span className="text-xs">{occ}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
