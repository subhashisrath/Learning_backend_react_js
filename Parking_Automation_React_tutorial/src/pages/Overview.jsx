import React, { useState, useEffect, useCallback } from 'react';
import {
  ClockIcon,
  CurrencyRupeeIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ChartBarSquareIcon,
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth, ROLES } from '@/auth';
import { api } from '@/services/api';

const fmt = (n) => n.toLocaleString('en-IN');

const KPICard = ({ icon: Icon, label, value, trend, trendUp, color }) => (
  <div className="card group">
    <div className="flex items-start justify-between">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color} transition-transform group-hover:scale-110`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      {trend && (
        <span className={`flex items-center gap-0.5 text-xs font-semibold ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
          {trendUp ? <ArrowTrendingUpIcon className="h-3.5 w-3.5" /> : <ArrowTrendingDownIcon className="h-3.5 w-3.5" />}
          {trend}
        </span>
      )}
    </div>
    <div className="mt-3">
      <p className="text-2xl font-bold text-surface-900">{value}</p>
      <p className="mt-0.5 text-sm text-surface-500">{label}</p>
    </div>
  </div>
);

export default function Overview() {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState({ kpis: {}, sessions: [], trend: [], occupancy: [], disputes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [kRes, sRes, tRes, oRes, dRes, opRes] = await Promise.all([
        api.dashboard.getStats(),
        api.sessions.getAll(),
        api.dashboard.getSessionsTrend(),
        api.zones.getAll(),
        api.disputes.getAll(),
        api.operators.getAll()
      ]);

      if (kRes.ok) {
        let filteredSessions = sRes.data || [];
        let filteredZones = oRes.data || [];
        let filteredDisputes = dRes.data || [];
        let filteredOperators = opRes.data || [];
        
        if (!isAdmin && user?.assignedZones) {
          filteredSessions = filteredSessions.filter(s => user.assignedZones.includes(s.zoneId));
          filteredZones = filteredZones.filter(z => user.assignedZones.includes(z.id));
          filteredDisputes = filteredDisputes.filter(d => filteredZones.some(z => z.name === d.zoneName));
          filteredOperators = filteredOperators.filter(o => user.assignedZones.includes(o.zoneId));
        }

        // Calculate KPIs locally to ensure data isolation
        const localKPIs = {
          activeSessions: filteredSessions.filter(s => s.status === 'active').length,
          todayRevenue: filteredSessions.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.amount, 0),
          occupancyRate: filteredZones.length 
            ? Math.round(filteredZones.reduce((s, z) => s + z.occupiedSpots, 0) / filteredZones.reduce((s, z) => s + (z.totalSpots || 1), 0) * 100) 
            : 0,
          openDisputes: filteredDisputes.filter(d => d.status === 'open' || d.status === 'under-review').length,
        };

        setData({ 
          kpis: localKPIs, 
          sessions: filteredSessions, 
          trend: tRes.data || [], // In a real app, trend would be filtered by API
          occupancy: filteredZones.map(z => ({ name: z.name.replace(' Zone', ''), occupancy: Math.round((z.occupiedSpots/(z.totalSpots || 1))*100) })),
          disputes: filteredDisputes.filter(d => d.status === 'open' || d.status === 'under-review')
        });
      } else throw new Error('Failed to load dashboard data');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user?.assignedZones]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const { kpis, sessions: allSessions, trend, occupancy, disputes: openDisputes } = data;
  const recentSessions = allSessions.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-surface-900">Dashboard</h2>
        <p className="text-sm text-surface-500">
          {isAdmin ? 'City-wide parking overview' : 'Your assigned zones overview'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={ClockIcon} label="Active Sessions" value={kpis.activeSessions} trend="+12%" trendUp color="bg-primary-600" />
        <KPICard icon={CurrencyRupeeIcon} label="Today's Revenue" value={`₹${fmt(kpis.todayRevenue)}`} trend="+8%" trendUp color="bg-emerald-600" />
        <KPICard icon={MapPinIcon} label="Zone Occupancy" value={`${kpis.occupancyRate}%`} trend="-3%" color="bg-amber-500" />
        <KPICard icon={ExclamationTriangleIcon} label="Open Disputes" value={kpis.openDisputes} trend="+2" color="bg-red-500" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Sessions Trend */}
        <div className="card">
          <h3 className="mb-1 text-base font-semibold text-surface-900">Sessions This Week</h3>
          <p className="mb-4 text-sm text-surface-500">Daily parking sessions</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorSessions)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Zone Occupancy */}
        <div className="card">
          <h3 className="mb-1 text-base font-semibold text-surface-900">Zone Occupancy</h3>
          <p className="mb-4 text-sm text-surface-500">Current occupancy by zone (%)</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={occupancy} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="occupancy" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Sessions */}
        <div className="lg:col-span-2">
          <div className="table-container">
            <div className="flex items-center justify-between border-b border-surface-200 px-4 py-3">
              <h3 className="font-semibold text-surface-900">Recent Sessions</h3>
              <a href="/sessions" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all →</a>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Vehicle</th>
                  <th>Zone</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((s) => (
                  <tr key={s.id}>
                    <td className="font-medium text-surface-900">{s.id}</td>
                    <td className="font-mono text-xs">{s.vehicle}</td>
                    <td>{s.zoneName.replace(' Zone', '')}</td>
                    <td>
                      <span className={`badge ${s.status === 'active' ? 'badge-blue' : s.status === 'completed' ? 'badge-green' : s.status === 'violation' ? 'badge-red' : 'badge-amber'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>{s.amount > 0 ? `₹${s.amount}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        <div className="card !p-0">
          <div className="border-b border-surface-200 px-5 py-3">
            <h3 className="font-semibold text-surface-900">Alerts & Disputes</h3>
          </div>
          <div className="divide-y divide-surface-100">
            {openDisputes.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-start gap-3 px-5 py-3">
                <div className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${d.priority === 'high' ? 'bg-red-500' : d.priority === 'medium' ? 'bg-amber-500' : 'bg-surface-400'}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-surface-800">{d.type}</p>
                  <p className="truncate text-xs text-surface-500">{d.ticketRef} · {d.zoneName.replace(' Zone', '')}</p>
                </div>
                <span className={`badge text-[10px] ${d.status === 'open' ? 'badge-red' : 'badge-amber'}`}>{d.status}</span>
              </div>
            ))}
            {openDisputes.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-surface-400">No open disputes 🎉</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
