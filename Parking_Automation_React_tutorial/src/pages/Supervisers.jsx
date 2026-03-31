import { useState, useEffect, useCallback } from 'react';
import { PlusIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth, canPerformAction } from '@/auth';
import { api } from '@/services/api';
import Toast from '@/components/Toast';

const STATUS_BADGE = {
  active: 'badge-green',
  inactive: 'badge-gray',
};

const emptySupervisor = {
  name: '',
  email: '',
  phone: '',
  status: 'active',
  assignedZones: [],
};

export default function Supervisors() {
  const { role } = useAuth();
  const canCreateSupervisor = canPerformAction(role, 'supervisors', 'create');
  const canEditSupervisor = canPerformAction(role, 'supervisors', 'edit');

  const [supervisors, setSupervisors] = useState([]);
  const [zonesData, setZonesData] = useState([]);
  const [operatorsData, setOperatorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptySupervisor);
  const [toast, setToast] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [supRes, zonesRes, opsRes] = await Promise.all([
        api.supervisors.getAll(),
        api.zones.getAll(),
        api.operators.getAll(),
      ]);

      if (supRes.ok && zonesRes.ok && opsRes.ok) {
        setSupervisors(supRes.data || []);
        setZonesData(zonesRes.data || []);
        setOperatorsData(opsRes.data || []);
      } else {
        throw new Error('Failed to load supervisors');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const zoneNameMap = zonesData.reduce((acc, zone) => {
    acc[zone.id] = zone.name;
    return acc;
  }, {});

  const getManagedOperators = (assignedZones = []) => {
    if (!assignedZones.length) return 0;
    return operatorsData.filter((op) => assignedZones.includes(op.zoneId)).length;
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptySupervisor);
    setShowModal(true);
  };

  const openEdit = (supervisor) => {
    setEditing(supervisor.id);
    setForm({
      name: supervisor.name,
      email: supervisor.email,
      phone: supervisor.phone,
      status: supervisor.status || 'active',
      assignedZones: supervisor.assignedZones || [],
    });
    setShowModal(true);
  };

  const toggleZone = (zoneId) => {
    setForm((prev) => {
      const hasZone = prev.assignedZones.includes(zoneId);
      const assignedZones = hasZone
        ? prev.assignedZones.filter((id) => id !== zoneId)
        : [...prev.assignedZones, zoneId];

      return { ...prev, assignedZones };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    const payload = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      operatorsManaged: getManagedOperators(form.assignedZones),
    };

    try {
      if (editing) {
        const res = await api.supervisors.update(editing, payload);
        if (res.ok) {
          setSupervisors((prev) => prev.map((sup) => (sup.id === editing ? { ...sup, ...payload } : sup)));
          setToast(`Supervisor "${payload.name}" updated`);
        }
      } else {
        const res = await api.supervisors.create(payload);
        if (res.ok) {
          setSupervisors((prev) => [...prev, { ...res.data, disputesReviewedThisMonth: 0 }]);
          setToast(`Supervisor "${payload.name}" created`);
        }
      }
      setShowModal(false);
      setEditing(null);
    } catch (err) {
      setToast('Operation failed');
    }
  };

  const activeSupervisors = supervisors.filter((sup) => sup.status === 'active').length;
  const totalAssignedZones = supervisors.reduce((sum, sup) => sum + (sup.assignedZones?.length || 0), 0);
  const totalManagedOperators = supervisors.reduce((sum, sup) => sum + getManagedOperators(sup.assignedZones), 0);

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">Supervisors</h2>
          <p className="text-sm text-surface-500">Manage supervisor assignments and oversight coverage</p>
        </div>
        {canCreateSupervisor && (
          <button onClick={openAdd} className="btn-primary">
            <PlusIcon className="h-4 w-4" />
            Add Supervisor
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Supervisors', value: supervisors.length, color: 'text-primary-600' },
          { label: 'Active', value: activeSupervisors, color: 'text-emerald-600' },
          { label: 'Assigned Zones', value: totalAssignedZones, color: 'text-amber-600' },
          { label: 'Operators Covered', value: totalManagedOperators, color: 'text-surface-900' },
        ].map((kpi) => (
          <div key={kpi.label} className="card text-center">
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-sm text-surface-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Assigned Zones</th>
              <th>Operators Managed</th>
              <th>Disputes Reviewed</th>
              <th>Status</th>
              {canEditSupervisor && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {supervisors.map((sup) => (
              <tr key={sup.id}>
                <td className="font-mono text-xs font-medium text-primary-600">{sup.id}</td>
                <td className="font-medium text-surface-900">{sup.name}</td>
                <td>
                  <div className="text-xs">
                    <p>{sup.email}</p>
                    <p className="text-surface-500">{sup.phone || '-'}</p>
                  </div>
                </td>
                <td>
                  <div className="flex max-w-xs flex-wrap gap-1">
                    {(sup.assignedZones || []).map((zoneId) => (
                      <span key={zoneId} className="rounded bg-surface-100 px-2 py-0.5 text-[11px] text-surface-700">
                        {(zoneNameMap[zoneId] || zoneId).replace(' Zone', '')}
                      </span>
                    ))}
                    {!sup.assignedZones?.length && <span className="text-surface-400">-</span>}
                  </div>
                </td>
                <td className="font-medium">{getManagedOperators(sup.assignedZones)}</td>
                <td className="font-medium">{sup.disputesReviewedThisMonth ?? 0}</td>
                <td><span className={`badge ${STATUS_BADGE[sup.status] || 'badge-gray'}`}>{sup.status}</span></td>
                {canEditSupervisor && (
                  <td>
                    <button onClick={() => openEdit(sup)} className="btn-ghost p-1.5" title="Edit">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-surface-900">{editing ? 'Edit Supervisor' : 'Add Supervisor'}</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-surface-400 hover:bg-surface-100">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">Full Name *</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rakesh Nayak"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">Email *</label>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@parking.in"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">Phone</label>
                <input
                  className="input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 9876500014"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-surface-700">Assigned Zones</label>
                <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-surface-200 p-3">
                  {zonesData.filter((zone) => zone.status !== 'inactive').map((zone) => (
                    <label key={zone.id} className="flex items-center gap-2 text-sm text-surface-700">
                      <input
                        type="checkbox"
                        checked={form.assignedZones.includes(zone.id)}
                        onChange={() => toggleZone(zone.id)}
                      />
                      <span>{zone.name.replace(' Zone', '')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">Status</label>
                <select
                  className="select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Save Changes' : 'Create Supervisor'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

