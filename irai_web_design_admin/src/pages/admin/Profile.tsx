import { useState } from 'react';
import {
  LogOut, Shield, Bell, ChevronRight, Edit3, Globe, Phone,
  ShieldCheck, Download, UserX, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import { MOCK_ADMIN_PERSONAL_PROFILE } from '../../mockData';
import { MOCK_ADMIN_EXPORT_DATA } from '../../adminData';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const ACCOUNT_PREFERENCES = [
  { icon: Bell,   label: 'Notifications',      desc: 'Email and platform alerts' },
  { icon: Shield, label: 'Security & Privacy', desc: 'Password, 2FA, sessions' },
];

function initials(first: string, last: string) {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

export default function AdminProfile() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [personal, setPersonal] = useState(MOCK_ADMIN_PERSONAL_PROFILE);
  const [editing, setEditing] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [deactivated, setDeactivated] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const displayName = user?.name ?? `${personal.firstName} ${personal.lastName}`;
  const handleLogout = () => { logout(); navigate('/', { replace: true }); };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(MOCK_ADMIN_EXPORT_DATA, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'irai-admin-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
    setExportDone(true);
  };

  const handleDeactivate = () => {
    setDeactivated(true);
    setShowDeactivate(false);
    setTimeout(() => { logout(); navigate('/', { replace: true }); }, 1500);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <p className="small-caps text-gray-400 mb-1">Admin</p>
        <h1 className="serif text-4xl text-slate leading-tight">Profile</h1>
      </div>

      {deactivated && (
        <div className="mb-6 rounded-2xl border border-forest/20 bg-[#f0f4ee] p-4 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-forest" />
          <p className="text-[13px] font-medium text-forest">Account deactivated. Signing out…</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#263d23] to-[#192b16] rounded-2xl p-6 text-white text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-2xl border-4 border-white/20 bg-forest flex items-center justify-center mx-auto text-2xl font-bold">
                {initials(personal.firstName, personal.lastName)}
              </div>
              <button type="button" className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md">
                <Edit3 size={13} className="text-forest" />
              </button>
            </div>
            <h2 className="serif text-2xl leading-none mb-1">{displayName}</h2>
            <p className="small-caps text-[9px] text-white/40">Platform Administrator</p>
            <p className="text-[12px] text-white/30 mt-3">{user?.email}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold">
              <ShieldCheck size={12} /> Staff Access
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-5 space-y-3">
            <p className="small-caps text-[8px] text-gray-400">Account</p>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400">Role</span>
              <span className="font-semibold text-slate capitalize">admin</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400">Member since</span>
              <span className="font-semibold text-slate">Jan 2024</span>
            </div>
          </div>

          <button type="button" onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-terracotta/20 bg-[#fdf3ec] text-terracotta font-bold text-[13px] hover:bg-[#fce8dc] transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="small-caps text-gray-400">Personal</p>
                <p className="text-[11px] text-gray-300 mt-0.5">PATCH /accounts/me/</p>
              </div>
              <button type="button" onClick={() => setEditing(v => !v)}
                className="text-[12px] font-bold text-forest hover:underline">
                {editing ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'First name', key: 'firstName' as const },
                { label: 'Last name', key: 'lastName' as const },
                { label: 'Phone', key: 'phone' as const },
                { label: 'Timezone', key: 'timezone' as const },
              ].map(field => (
                <div key={field.key}>
                  <p className="small-caps text-[8px] text-gray-400 mb-1">{field.label}</p>
                  {editing ? (
                    <input value={personal[field.key]} onChange={e => setPersonal(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30" />
                  ) : (
                    <p className="text-[14px] font-semibold text-slate">{personal[field.key]}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-brand-border">
              <p className="small-caps text-[8px] text-gray-400 mb-3">Emergency Contact</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
                {([
                  { label: 'Name', key: 'emergencyName' as const },
                  { label: 'Phone', key: 'emergencyPhone' as const },
                  { label: 'Relation', key: 'emergencyRelation' as const },
                ]).map(field => (
                  <div key={field.key}>
                    <span className="text-gray-400">{field.label}</span>
                    {editing ? (
                      <input value={personal[field.key]} onChange={e => setPersonal(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full mt-1 bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30" />
                    ) : (
                      <p className="font-medium text-slate">{personal[field.key]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-border">
              <p className="small-caps text-gray-400">Account Preferences</p>
            </div>
            {ACCOUNT_PREFERENCES.map((item, i) => (
              <button key={item.label} type="button"
                className={cn(
                  'w-full px-6 py-4 flex items-center justify-between hover:bg-brand-50/50 transition-colors',
                  i < ACCOUNT_PREFERENCES.length - 1 && 'border-b border-brand-border',
                )}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-gray-400">
                    <item.icon size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-semibold text-slate">{item.label}</p>
                    <p className="text-[12px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-border">
              <p className="small-caps text-gray-400">Account Actions</p>
            </div>
            <button type="button" onClick={() => { setShowExport(true); setExportDone(false); }}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-brand-50/50 transition-colors border-b border-brand-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#eef3f9] flex items-center justify-center text-[#4B7399]">
                  <Download size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold text-slate">Export My Data</p>
                  <p className="text-[12px] text-gray-400">GET /accounts/me/export-data/</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
            <button type="button" onClick={() => setShowDeactivate(true)} disabled={deactivated}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#fdf3ec]/50 transition-colors disabled:opacity-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#fdf3ec] flex items-center justify-center text-terracotta">
                  <UserX size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold text-terracotta">Deactivate Account</p>
                  <p className="text-[12px] text-gray-400">POST /accounts/me/deactivate/</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      <Modal open={showExport} onClose={() => setShowExport(false)} title="Export My Data" maxWidth="max-w-lg">
        <p className="text-[13px] text-gray-500 mb-4">
          GDPR data export from <code className="text-[12px] bg-brand-50 px-1.5 py-0.5 rounded">GET /accounts/me/export-data/</code>
        </p>
        <pre className="bg-brand-50 border border-brand-border rounded-xl p-4 text-[11px] font-mono text-slate overflow-auto max-h-64 mb-4">
          {JSON.stringify(MOCK_ADMIN_EXPORT_DATA, null, 2)}
        </pre>
        {exportDone && (
          <p className="text-[13px] text-forest font-medium mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} /> Download started
          </p>
        )}
        <div className="flex gap-3">
          <button type="button" onClick={() => setShowExport(false)}
            className="flex-1 py-2.5 rounded-xl border border-brand-border text-[13px] font-bold hover:bg-brand-50">
            Close
          </button>
          <button type="button" onClick={handleExport}
            className="flex-1 py-2.5 rounded-xl bg-forest text-white text-[13px] font-bold hover:bg-[#3d5636] flex items-center justify-center gap-2">
            <Download size={14} /> Download JSON
          </button>
        </div>
      </Modal>

      <Modal open={showDeactivate} onClose={() => setShowDeactivate(false)} title="Deactivate Account">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={20} className="text-terracotta shrink-0 mt-0.5" />
          <p className="text-[13px] text-gray-600 leading-relaxed">
            This will soft-deactivate your account via <code className="text-[12px] bg-brand-50 px-1 py-0.5 rounded">POST /accounts/me/deactivate/</code>.
            You will be signed out and unable to log in until an admin reactivates your account.
          </p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setShowDeactivate(false)}
            className="flex-1 py-2.5 rounded-xl border border-brand-border text-[13px] font-bold hover:bg-brand-50">
            Cancel
          </button>
          <button type="button" onClick={handleDeactivate}
            className="flex-1 py-2.5 rounded-xl bg-terracotta text-white text-[13px] font-bold hover:bg-terracotta/90">
            Confirm Deactivate
          </button>
        </div>
      </Modal>
    </div>
  );
}
