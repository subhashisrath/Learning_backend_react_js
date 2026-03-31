import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ChevronDownIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/auth';
import { api } from '@/services/api';
import Toast from '@/components/Toast';

const STATUS_BADGE = { active: 'badge-green', inactive: 'badge-gray', maintenance: 'badge-amber' };

const emptyZone = { name: '', city: 'Bhubaneswar', streets: 0, totalSpots: 0, status: 'active' };

export default function Zones() {
  const { user, isAdmin } = useAuth();
  const [zones, setZones] = useState([]);
  const [streetsData, setStreetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyZone);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchZones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.zones.getAll();
      if (res.ok) {
        let filtered = res.data;
        if (!isAdmin && user?.assignedZones) {
          filtered = filtered.filter(z => user.assignedZones.includes(z.id));
        }
        setZones(filtered);
      } else throw new Error('Failed to load zones');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user?.assignedZones]);

  useEffect(() => {
    fetchZones();
    // In a real app, you'd fetch streets separately or embedded
    import('@/data/mockData').then(m => setStreetsData(m.streets));
  }, [fetchZones]);

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyZone);
    setShowModal(true);
  };

  const openEdit = (zone) => {
    setEditing(zone.id);
    setForm({ name: zone.name, city: zone.city || 'Bhubaneswar', streets: zone.streets, totalSpots: zone.totalSpots, status: zone.status });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const payload = {
      ...form,
      streets: Number(form.streets) || 0,
      totalSpots: Number(form.totalSpots) || 0,
    };

    try {
      if (editing) {
        const res = await api.zones.update(editing, payload);
        if (res.ok) {
          setZones((prev) => prev.map((z) => (z.id === editing ? { ...z, ...payload } : z)));
          setToast(`Zone "${payload.name}" updated`);
        }
      } else {
        const res = await api.zones.create(payload);
        if (res.ok) {
          setZones((prev) => [...prev, res.data]);
          setToast(`Zone "${payload.name}" created`);
        }
      }
      setShowModal(false);
      setEditing(null);
    } catch (err) {
      setToast('Operation failed. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.zones.delete(id);
      if (res.ok) {
        setZones((prev) => prev.filter((z) => z.id !== id));
        setToast('Zone deleted');
      }
    } catch (err) {
      setToast('Delete failed');
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
    </div>
  );

  if (error) return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <p className="text-red-800 font-semibold">{error}</p>
      <button onClick={fetchZones} className="btn-primary mt-4">Retry</button>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">Zones & Streets</h2>
          <p className="text-sm text-surface-500">Manage parking geography and zone assignments</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="btn-primary">
            <PlusIcon className="h-4 w-4" />
            Add Zone
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Zones', value: zones.length, color: 'text-primary-600' },
          { label: 'Active', value: zones.filter((z) => z.status === 'active').length, color: 'text-emerald-600' },
          { label: 'Total Spots', value: zones.reduce((s, z) => s + z.totalSpots, 0), color: 'text-surface-900' },
          { label: 'Occupied', value: zones.reduce((s, z) => s + z.occupiedSpots, 0), color: 'text-amber-600' },
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
              <th className="w-8"></th>
              <th>Zone ID</th>
              <th>Name</th>
              <th>Streets</th>
              <th>Capacity</th>
              <th>Occupancy</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => {
              const occ = z.totalSpots > 0 ? Math.round((z.occupiedSpots / z.totalSpots) * 100) : 0;
              const isOpen = expanded === z.id;
              const zoneStreets = streetsData.filter((s) => s.zoneId === z.id);
              return (
                <React.Fragment key={z.id}>
                  <tr className="cursor-pointer" onClick={() => toggle(z.id)}>
                    <td>
                      {isOpen ? <ChevronDownIcon className="h-4 w-4 text-surface-400" /> : <ChevronRightIcon className="h-4 w-4 text-surface-400" />}
                    </td>
                    <td className="font-mono text-xs font-medium text-primary-600">{z.id}</td>
                    <td className="font-semibold text-surface-900">{z.name}</td>
                    <td>{z.streets}</td>
                    <td>{z.occupiedSpots}/{z.totalSpots}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-surface-200">
                          <div className="h-1.5 rounded-full bg-primary-500 transition-all" style={{ width: `${occ}%` }} />
                        </div>
                        <span className="text-xs text-surface-500">{occ}%</span>
                      </div>
                    </td>
                    <td><span className={`badge ${STATUS_BADGE[z.status]}`}>{z.status}</span></td>
                    {isAdmin && (
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(z)} className="btn-ghost p-1.5" title="Edit"><PencilIcon className="h-4 w-4" /></button>
                          <button onClick={() => setDeleteConfirm(z.id)} className="btn-ghost p-1.5 text-red-500 hover:text-red-700" title="Delete"><TrashIcon className="h-4 w-4" /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                  {isOpen && zoneStreets.length > 0 && (
                    <tr key={`${z.id}-streets`}>
                      <td colSpan={isAdmin ? 8 : 7} className="!p-0">
                        <div className="bg-surface-50 px-8 py-3">
                          <p className="mb-2 text-xs font-semibold uppercase text-surface-500">Streets in {z.name}</p>
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {zoneStreets.map((st) => (
                              <div key={st.id} className="rounded-lg border border-surface-200 bg-white px-3 py-2">
                                <p className="text-sm font-medium text-surface-800">{st.name}</p>
                                <p className="text-xs text-surface-500">{st.spots} spots · {st.occupancy}% occupied</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Zone Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-surface-900">{editing ? 'Edit Zone' : 'Add New Zone'}</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-surface-400 hover:bg-surface-100"><XMarkIcon className="h-5 w-5" /></button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">Zone Name *</label>
                <input className="input" placeholder="e.g. Infocity Zone" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">City</label>
                <input className="input" placeholder="e.g. Bhubaneswar" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-surface-700">Streets</label>
                  <input type="number" min="0" className="input" value={form.streets} onChange={(e) => setForm({ ...form, streets: Number(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-surface-700">Total Spots</label>
                  <input type="number" min="0" className="input" value={form.totalSpots} onChange={(e) => setForm({ ...form, totalSpots: Number(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">Status</label>
                <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Save Changes' : 'Create Zone'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-surface-900">Delete Zone?</h3>
            <p className="mt-1 text-sm text-surface-500">This action cannot be undone. All associated streets will be unlinked.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger flex-1">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

