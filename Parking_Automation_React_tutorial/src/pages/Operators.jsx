import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/auth';
import { PlusIcon, PencilIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Toast from '@/components/Toast';

const DUTY_BADGE = { 'on-duty': 'badge-green', 'off-duty': 'badge-gray', 'on-leave': 'badge-amber' };

const emptyOp = { name: '', phone: '', zoneId: '', zoneName: '', shift: 'Morning', status: 'on-duty' };

export default function Operators() {
  const { user, isAdmin } = useAuth();
  const [operators, setOperators] = useState([]);
  const [zonesData, setZonesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyOp);
  const [toast, setToast] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [opsRes, zonesRes] = await Promise.all([
        api.operators.getAll(),
        api.zones.getAll()
      ]);
      if (opsRes.ok && zonesRes.ok) {
        let filteredOps = opsRes.data;
        let filteredZones = zonesRes.data;

        if (!isAdmin && user?.assignedZones) {
          filteredOps = filteredOps.filter(o => user.assignedZones.includes(o.zoneId));
          filteredZones = filteredZones.filter(z => user.assignedZones.includes(z.id));
        }

        setOperators(filteredOps);
        setZonesData(filteredZones);
      } else throw new Error('Data fetch failed');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user?.assignedZones]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onDuty = operators.filter((o) => o.status === 'on-duty').length;
  const offDuty = operators.filter((o) => o.status === 'off-duty').length;
  const avgSessions = Math.round(operators.filter((o) => o.sessionsToday > 0).reduce((s, o) => s + o.sessionsToday, 0) / (onDuty || 1));

  const openAdd = () => { setEditing(null); setForm(emptyOp); setShowModal(true); };
  const openEdit = (op) => {
    setEditing(op.id);
    setForm({ name: op.name, phone: op.phone, zoneId: op.zoneId, zoneName: op.zoneName, shift: op.shift, status: op.status });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const selectedZone = zonesData.find((z) => z.id === form.zoneId);

    try {
      if (editing) {
        const res = await api.operators.update(editing, form);
        if (res.ok) {
          setOperators((prev) => prev.map((o) =>
            o.id === editing ? { ...o, ...form, zoneName: selectedZone?.name || form.zoneName } : o
          ));
          setToast(`Operator "${form.name}" updated`);
        }
      } else {
        const res = await api.operators.create(form);
        if (res.ok) {
          setOperators((prev) => [...prev, { ...res.data, zoneName: selectedZone?.name || '' }]);
          setToast(`Operator "${form.name}" added`);
        }
      }
      setShowModal(false);
    } catch (err) {
      setToast('Operation failed');
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

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          i < full ? <StarSolid key={i} className="h-3.5 w-3.5 text-amber-400" /> : <StarIcon key={i} className="h-3.5 w-3.5 text-surface-300" />
        ))}
        <span className="ml-1 text-xs text-surface-500">{rating}</span>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">Operators</h2>
          <p className="text-sm text-surface-500">Manage parking operators and zone assignments</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="btn-primary">
            <PlusIcon className="h-4 w-4" />
            Add Operator
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Operators', value: operators.length, color: 'text-primary-600' },
          { label: 'On Duty', value: onDuty, color: 'text-emerald-600' },
          { label: 'Off Duty', value: offDuty, color: 'text-surface-600' },
          { label: 'Avg Sessions/Day', value: avgSessions, color: 'text-amber-600' },
        ].map((kpi) => (
          <div key={kpi.label} className="card text-center">
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-sm text-surface-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Assigned Zone</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Sessions Today</th>
              <th>Rating</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {operators.map((op) => (
              <tr key={op.id}>
                <td className="font-mono text-xs font-medium text-primary-600">{op.id}</td>
                <td>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                      {op.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="font-medium text-surface-900">{op.name}</span>
                  </div>
                </td>
                <td className="text-xs text-surface-500">{op.phone}</td>
                <td>{op.zoneName?.replace(' Zone', '') || '—'}</td>
                <td>
                  <span className={`badge ${op.shift === 'Morning' ? 'badge-blue' : op.shift === 'Evening' ? 'badge-purple' : 'badge-gray'}`}>
                    {op.shift}
                  </span>
                </td>
                <td><span className={`badge ${DUTY_BADGE[op.status]}`}>{op.status.replace('-', ' ')}</span></td>
                <td className="font-medium">{op.sessionsToday}</td>
                <td>{renderStars(op.rating)}</td>
                {isAdmin && (
                  <td>
                    <button onClick={() => openEdit(op)} className="btn-ghost p-1.5" title="Edit"><PencilIcon className="h-4 w-4" /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Operator Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-surface-900">{editing ? 'Edit Operator' : 'Add Operator'}</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-surface-400 hover:bg-surface-100"><XMarkIcon className="h-5 w-5" /></button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">Full Name *</label>
                <input className="input" placeholder="e.g. Sunil Kumar" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">Phone</label>
                <input className="input" placeholder="e.g. 9876543220" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">Assign Zone</label>
                <select className="select" value={form.zoneId} onChange={(e) => setForm({ ...form, zoneId: e.target.value })}>
                  <option value="">Select Zone</option>
                  {zonesData.filter((z) => z.status === 'active').map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-surface-700">Shift</label>
                  <select className="select" value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })}>
                    <option>Morning</option>
                    <option>Evening</option>
                    <option>Night</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-surface-700">Status</label>
                  <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="on-duty">On Duty</option>
                    <option value="off-duty">Off Duty</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Save Changes' : 'Add Operator'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
