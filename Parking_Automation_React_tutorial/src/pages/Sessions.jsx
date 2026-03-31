import { useState, useMemo, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/auth';
import { ArrowDownTrayIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const STATUS_COLORS = { active: 'badge-blue', completed: 'badge-green', expired: 'badge-amber', violation: 'badge-red' };

const fmtTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
};

export default function Sessions() {
  const { user, isAdmin } = useAuth();
  const [allSessions, setAllSessions] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const perPage = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, zRes] = await Promise.all([
        api.sessions.getAll(),
        api.zones.getAll()
      ]);
      if (sRes.ok && zRes.ok) {
        let filteredSessions = sRes.data;
        let filteredZones = zRes.data;

        if (!isAdmin && user?.assignedZones) {
          filteredSessions = filteredSessions.filter(s => user.assignedZones.includes(s.zoneId));
          filteredZones = filteredZones.filter(z => user.assignedZones.includes(z.id));
        }

        setAllSessions(filteredSessions);
        setAllZones(filteredZones);
      } else throw new Error('Failed to fetch data');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user?.assignedZones]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    return allSessions.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (zoneFilter !== 'all' && s.zoneId !== zoneFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!s.id.toLowerCase().includes(q) && !s.vehicle.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [allSessions, search, statusFilter, zoneFilter]);

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

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">Live Sessions</h2>
        <p className="text-sm text-surface-500">Track ongoing and completed parking sessions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by ticket or vehicle..." className="input pl-9" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="select w-36">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="expired">Expired</option>
          <option value="violation">Violation</option>
        </select>
        <select value={zoneFilter} onChange={(e) => { setZoneFilter(e.target.value); setPage(1); }} className="select w-44">
          <option value="all">All Zones</option>
          {allZones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
        </select>
        <button 
        //   onClick={() => downloadCSV(filtered, 'sessions_export')} 
          disabled={!filtered.length}
          className="btn-secondary text-xs flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
        >
          <ArrowDownTrayIcon className="h-4 w-4" /> Export CSV
        </button>
        <span className="text-sm text-surface-500">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Vehicle</th>
              <th>Zone</th>
              <th>Operator</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>Duration</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s) => (
              <tr key={s.id} className="cursor-pointer" onClick={() => setSelected(s)}>
                <td className="font-semibold text-primary-600">{s.id}</td>
                <td className="font-mono text-xs">{s.vehicle}</td>
                <td>{s.zoneName.replace(' Zone', '')}</td>
                <td>{s.operatorName}</td>
                <td className="text-xs">{fmtTime(s.entryTime)}</td>
                <td className="text-xs">{fmtTime(s.exitTime)}</td>
                <td>{s.duration}</td>
                <td className="font-medium">{s.amount > 0 ? `₹${s.amount}` : '—'}</td>
                <td><span className={`badge ${STATUS_COLORS[s.status]}`}>{s.status}</span></td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={9} className="py-12 text-center text-surface-400">No sessions found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-surface-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(page - 1)} disabled={page === 1} className="btn-secondary text-xs py-2 px-3 disabled:opacity-40">Previous</button>
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="btn-secondary text-xs py-2 px-3 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg animate-slide-up rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-surface-900">Session Detail</h3>
              <button onClick={() => setSelected(null)} className="rounded-lg p-1 text-surface-400 hover:bg-surface-100"><XMarkIcon className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Ticket ID', selected.id],
                ['Vehicle', selected.vehicle],
                ['Zone', selected.zoneName],
                ['Operator', selected.operatorName],
                ['Entry', fmtTime(selected.entryTime)],
                ['Exit', fmtTime(selected.exitTime)],
                ['Duration', selected.duration],
                ['Amount', selected.amount > 0 ? `₹${selected.amount}` : '—'],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-surface-500">{label}</p>
                  <p className="font-medium text-surface-900">{val}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <span className={`badge ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
            </div>
            {isAdmin && selected.status === 'violation' && (
              <button className="btn-primary mt-5 w-full">Override & Resolve</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
