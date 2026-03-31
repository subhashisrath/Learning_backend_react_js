import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/auth';
import Toast from '@/components/Toast';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const Section = ({ icon: Icon, title, description, children }) => (
  <div className="card">
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
        <Icon className="h-5 w-5 text-primary-600" />
      </div>
      <div>
        <h3 className="font-semibold text-surface-900">{title}</h3>
        <p className="text-sm text-surface-500">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

export default function Settings() {
  const { isAdmin } = useAuth();
  const readOnly = !isAdmin;
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    maxDuration: '', gracePeriod: '', baseRate: 0, penaltyRate: 0, freeParking: '',
    evidenceRetention: '', sessionRetention: '', disputeRecords: '', operatorLogs: '', autoArchive: false,
    smsAlerts: false, emailNotifs: false, whatsappUpdates: false, violationAlerts: false, dailySummary: false,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.settings.get();
      if (res.ok) {
        // Flatten or map data if needed
        const d = res.data;
        setSettings({
          maxDuration: '4 hours', gracePeriod: '15 minutes', baseRate: d.parkingPolicy.baseRate, penaltyRate: 100, freeParking: '10:00 PM',
          evidenceRetention: '90 days', sessionRetention: '365 days', disputeRecords: '2 years', operatorLogs: '180 days', autoArchive: true,
          smsAlerts: d.notifications.sms, emailNotifs: d.notifications.email, whatsappUpdates: d.notifications.whatsapp, violationAlerts: true, dailySummary: true,
        });
      }
    } catch { /* ... */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const update = (key, val) => {
    if (readOnly) return;
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    try {
      await api.settings.save(settings);
      setToast('Settings saved successfully');
    } catch {
      setToast('Failed to save');
    }
  };

  const handleReset = () => {
    setSettings({
      maxDuration: '4 hours', gracePeriod: '15 minutes', baseRate: 20, penaltyRate: 100, freeParking: '10:00 PM',
      evidenceRetention: '90 days', sessionRetention: '365 days', disputeRecords: '2 years', operatorLogs: '180 days', autoArchive: true,
      smsAlerts: true, emailNotifs: true, whatsappUpdates: false, violationAlerts: true, dailySummary: true,
    });
    setToast('Settings reset to defaults');
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-200 border-t-primary-600" />
    </div>
  );

  const FieldRow = ({ label, settingKey, type = 'text' }) => (
    <div className="flex items-center justify-between border-b border-surface-100 py-3 last:border-0">
      <label className="text-sm font-medium text-surface-700">{label}</label>
      {type === 'toggle' ? (
        <button
          type="button"
          onClick={() => update(settingKey, !settings[settingKey])}
          disabled={readOnly}
          className={`relative h-6 w-11 rounded-full transition ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${settings[settingKey] ? 'bg-primary-600' : 'bg-surface-300'}`}
        >
          <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings[settingKey] ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      ) : (
        <input
          type={type === 'number' ? 'number' : 'text'}
          value={settings[settingKey]}
          onChange={(e) => update(settingKey, type === 'number' ? Number(e.target.value) : e.target.value)}
          readOnly={readOnly}
          className={`input w-48 text-right ${readOnly ? 'bg-surface-50 cursor-not-allowed text-surface-500' : ''}`}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">Settings</h2>
        <p className="text-sm text-surface-500">
          {isAdmin ? 'Configure policies and system parameters' : 'View system configuration (read-only)'}
        </p>
      </div>

      {!isAdmin && (
        <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 ring-1 ring-inset ring-amber-600/20">
          ⚠️ You have read-only access. Contact a Government Admin to modify settings.
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <Section icon={Cog6ToothIcon} title="Parking Policy" description="Duration rules and pricing defaults">
          <FieldRow label="Max Parking Duration" settingKey="maxDuration" />
          <FieldRow label="Grace Period" settingKey="gracePeriod" />
          <FieldRow label="Base Rate (₹/hour)" settingKey="baseRate" type="number" />
          <FieldRow label="Penalty Rate (₹)" settingKey="penaltyRate" type="number" />
          <FieldRow label="Free Parking After" settingKey="freeParking" />
        </Section>

        <Section icon={ShieldCheckIcon} title="Retention Policy" description="Data and evidence retention settings">
          <FieldRow label="Evidence Retention" settingKey="evidenceRetention" />
          <FieldRow label="Session Data Retention" settingKey="sessionRetention" />
          <FieldRow label="Dispute Records" settingKey="disputeRecords" />
          <FieldRow label="Operator Logs" settingKey="operatorLogs" />
          <FieldRow label="Auto-archive Old Data" settingKey="autoArchive" type="toggle" />
        </Section>

        <Section icon={BellIcon} title="Notification Settings" description="Alert and notification preferences">
          <FieldRow label="SMS Alerts" settingKey="smsAlerts" type="toggle" />
          <FieldRow label="Email Notifications" settingKey="emailNotifs" type="toggle" />
          <FieldRow label="WhatsApp Updates" settingKey="whatsappUpdates" type="toggle" />
          <FieldRow label="Violation Alerts" settingKey="violationAlerts" type="toggle" />
          <FieldRow label="Daily Summary Email" settingKey="dailySummary" type="toggle" />
        </Section>

        <Section icon={InformationCircleIcon} title="System Info" description="Application and deployment details">
          <div className="flex items-center justify-between border-b border-surface-100 py-3">
            <span className="text-sm font-medium text-surface-700">App Version</span>
            <span className="text-sm text-surface-500">1.0.0-beta</span>
          </div>
          <div className="flex items-center justify-between border-b border-surface-100 py-3">
            <span className="text-sm font-medium text-surface-700">Last Sync</span>
            <span className="text-sm text-surface-500">10 Feb 2026, 4:30 PM</span>
          </div>
          <div className="flex items-center justify-between border-b border-surface-100 py-3">
            <span className="text-sm font-medium text-surface-700">Deployment</span>
            <span className="badge badge-amber">Staging</span>
          </div>
          <div className="flex items-center justify-between border-b border-surface-100 py-3">
            <span className="text-sm font-medium text-surface-700">API Endpoint</span>
            <span className="text-sm font-mono text-surface-500">api.parksmart.in</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-medium text-surface-700">Database</span>
            <span className="text-sm text-surface-500">PostgreSQL 16</span>
          </div>
        </Section>
      </div>

      {isAdmin && (
        <div className="flex justify-end gap-3">
          <button onClick={handleReset} className="btn-secondary">Reset to Defaults</button>
          <button onClick={handleSave} className="btn-primary">Save Changes</button>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
