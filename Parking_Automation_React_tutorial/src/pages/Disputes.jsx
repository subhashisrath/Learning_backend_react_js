import { useState, useMemo, useEffect, useCallback } from 'react';
import { EyeIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth, canPerformAction, getAssignedZoneNames } from '@/auth';
import { api } from '@/services/api';
import Toast from '@/components/Toast';

const STATUS_COLORS = { open: 'badge-red', 'under-review': 'badge-amber', resolved: 'badge-green', closed: 'badge-gray' };
const PRIORITY_COLORS = { high: 'badge-red', medium: 'badge-amber', low: 'badge-green' };
const TABS = ['all', 'open', 'under-review', 'resolved', 'closed'];

const fmtDate = (iso) => new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

export default function Disputes() {
  const { user, role, isAdmin } = useAuth();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [res, zonesRes] = await Promise.all([
        api.disputes.getAll(),
        api.zones.getAll()
      ]);
      if (res.ok && zonesRes.ok) {
        let scopedDisputes = res.data;

        if (!isAdmin) {
          const allowedZoneNames = getAssignedZoneNames(zonesRes.data, user?.assignedZones || []);
          scopedDisputes = scopedDisputes.filter((d) => allowedZoneNames.has(d.zoneName));
        }

        setDisputes(scopedDisputes);
      } else throw new Error('Disputes fetch failed');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user?.assignedZones]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => (
    tab === 'all' ? disputes : disputes.filter((d) => d.status === tab)
  ), [tab, disputes]);
  const canFlagDisputes = canPerformAction(role, 'disputes', 'flag');
  const canResolveDisputes = canPerformAction(role, 'disputes', 'resolve');
  const canCloseDisputes = canPerformAction(role, 'disputes', 'close');

  const handleResolve = async (id) => {
    if (!canResolveDisputes) return;
    try {
      const res = await api.disputes.updateStatus(id, 'resolved');
      if (res.ok) {
        setDisputes((prev) => prev.map((d) =>
          d.id === id ? { ...d, status: 'resolved', resolution: 'Resolved by admin after investigation.' } : d
        ));
        setSelected(null);
        setToast('Dispute resolved');
      }
    } catch (err) {
      setToast('Resolution failed');
    }
  };

  const handleFlag = async (id) => {
    if (!canFlagDisputes) return;
    try {
      const res = await api.disputes.updateStatus(id, 'under-review');
      if (res.ok) {
        setDisputes((prev) => prev.map((d) => d.id === id ? { ...d, status: 'under-review' } : d));
        setSelected((prev) => prev ? { ...prev, status: 'under-review' } : null);
        setToast('Dispute flagged');
      }
    } catch (err) {
      setToast('Action failed');
    }
  };

  const handleClose = async (id) => {
    if (!canCloseDisputes) return;
    try {
      const res = await api.disputes.updateStatus(id, 'closed');
      if (res.ok) {
        setDisputes((prev) => prev.map((d) => d.id === id ? { ...d, status: 'closed' } : d));
        setSelected(null);
        setToast('Dispute closed');
      }
    } catch (err) {
      setToast('Action failed');
    }
  };

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
      <div>
        <h2 className="text-2xl font-bold text-surface-900">Disputes</h2>
        <p className="text-sm text-surface-500">Review flagged sessions and manage dispute resolution</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Open', value: disputes.filter((d) => d.status === 'open').length, color: 'text-red-600' },
          { label: 'Under Review', value: disputes.filter((d) => d.status === 'under-review').length, color: 'text-amber-600' },
          { label: 'Resolved', value: disputes.filter((d) => d.status === 'resolved').length, color: 'text-emerald-600' },
          { label: 'Closed', value: disputes.filter((d) => d.status === 'closed').length, color: 'text-surface-500' },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-surface-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-surface-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition ${
              tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'
            }`}
          >
            {t.replace('-', ' ')}
            <span className="ml-1.5 rounded-full bg-surface-100 px-1.5 py-0.5 text-xs">
              {t === 'all' ? disputes.length : disputes.filter((d) => d.status === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Dispute ID</th>
              <th>Ticket Ref</th>
              <th>Type</th>
              <th>Zone</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Filed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id}>
                <td className="font-semibold text-primary-600">{d.id}</td>
                <td className="font-mono text-xs">{d.ticketRef}</td>
                <td>{d.type}</td>
                <td>{d.zoneName?.replace(' Zone', '') || '—'}</td>
                <td><span className={`badge ${PRIORITY_COLORS[d.priority]}`}>{d.priority}</span></td>
                <td><span className={`badge ${STATUS_COLORS[d.status]}`}>{d.status.replace('-', ' ')}</span></td>
                <td className="text-xs">{fmtDate(d.filedDate)}</td>
                <td>
                  <button onClick={() => setSelected(d)} className="btn-ghost p-1.5" title="View details">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="py-12 text-center text-surface-400">No disputes in this category</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-surface-900">Dispute Detail</h3>
              <button onClick={() => setSelected(null)} className="rounded-lg p-1 text-surface-400 hover:bg-surface-100"><XMarkIcon className="h-5 w-5" /></button>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <span className={`badge ${STATUS_COLORS[selected.status]}`}>{selected.status.replace('-', ' ')}</span>
              <span className={`badge ${PRIORITY_COLORS[selected.priority]}`}>{selected.priority} priority</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-5">
              {[
                ['Dispute ID', selected.id],
                ['Ticket Ref', selected.ticketRef],
                ['Type', selected.type],
                ['Zone', selected.zoneName],
                ['Filed Date', fmtDate(selected.filedDate)],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-surface-500">{label}</p>
                  <p className="font-medium text-surface-900">{val}</p>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <p className="text-sm text-surface-500 mb-1">Description</p>
              <p className="text-sm text-surface-700 leading-relaxed">{selected.description}</p>
            </div>

            {selected.resolution && (
              <div className="mb-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                <p className="font-medium mb-0.5">Resolution</p>
                <p>{selected.resolution}</p>
              </div>
            )}

            {/* Timeline */}
            <div className="mb-5">
              <p className="text-sm font-medium text-surface-700 mb-2">Timeline</p>
              <div className="space-y-3 border-l-2 border-surface-200 pl-4">
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 h-3 w-3 rounded-full border-2 border-red-500 bg-white" />
                  <p className="text-sm font-medium text-surface-800">Dispute Filed</p>
                  <p className="text-xs text-surface-500">{fmtDate(selected.filedDate)}</p>
                </div>
                {(selected.status !== 'open') && (
                  <div className="relative">
                    <div className="absolute -left-[21px] top-0.5 h-3 w-3 rounded-full border-2 border-amber-500 bg-white" />
                    <p className="text-sm font-medium text-surface-800">Under Review</p>
                    <p className="text-xs text-surface-500">Assigned for investigation</p>
                  </div>
                )}
                {(selected.status === 'resolved' || selected.status === 'closed') && (
                  <div className="relative">
                    <div className="absolute -left-[21px] top-0.5 h-3 w-3 rounded-full border-2 border-emerald-500 bg-white" />
                    <p className="text-sm font-medium text-surface-800">Resolved</p>
                    <p className="text-xs text-surface-500">Action taken and documented</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons — dynamic based on status and role */}
            {(selected.status === 'open' || selected.status === 'under-review') && (
              <div className="flex gap-3">
                {canResolveDisputes && (
                  <button onClick={() => handleResolve(selected.id)} className="btn-primary flex-1">
                    <CheckCircleIcon className="h-4 w-4" /> Resolve & Close
                  </button>
                )}
                {selected.status === 'open' && canFlagDisputes && (
                  <button onClick={() => handleFlag(selected.id)} className="btn-secondary flex-1">
                    Flag for Review
                  </button>
                )}
              </div>
            )}
            {selected.status === 'resolved' && canCloseDisputes && (
              <button onClick={() => handleClose(selected.id)} className="btn-secondary w-full">
                Close Dispute
              </button>
            )}
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
