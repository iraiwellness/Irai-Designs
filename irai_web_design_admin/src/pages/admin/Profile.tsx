import { useState } from 'react';
import {
  LogOut, Shield, Bell, ChevronRight, Users, CheckCircle2,
  ShieldCheck, Download, UserX, AlertTriangle, Upload, Plus, X,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import { MOCK_ADMIN_PERSONAL_PROFILE, LOOKUP_LANGUAGES } from '../../mockData';
import {
  MOCK_ADMIN_EXPORT_DATA, MOCK_ADMIN_STAFF_PROFILE, MOCK_ADMIN_ACCOUNT_STATS,
  LOOKUP_ADMIN_SCOPES,
} from '../../adminData';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import type { AdminStaffProfileFields } from '../../types';

const ACCOUNT_PREFERENCES = [
  { icon: Bell,   label: 'Notifications',      desc: 'Email and platform alerts' },
  { icon: Shield, label: 'Security & Privacy', desc: 'Password, 2FA, sessions' },
  { icon: ShieldCheck, label: 'Staff Permissions', desc: 'Access scopes and audit trail' },
];

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', ml: 'Malayalam', kn: 'Kannada',
};

function scopeName(slug: string) {
  return LOOKUP_ADMIN_SCOPES.find(s => s.slug === slug)?.name ?? slug;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminProfile() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [personal, setPersonal] = useState(MOCK_ADMIN_PERSONAL_PROFILE);
  const [staff, setStaff] = useState<AdminStaffProfileFields>(MOCK_ADMIN_STAFF_PROFILE);
  const [editingSection, setEditingSection] = useState<'personal' | 'staff' | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [deactivated, setDeactivated] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [newResponsibility, setNewResponsibility] = useState('');

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

  const addScope = (slug: string) => {
    if (staff.accessScopes.includes(slug)) return;
    setStaff(s => ({ ...s, accessScopes: [...s.accessScopes, slug] }));
  };

  const removeScope = (slug: string) => {
    setStaff(s => ({ ...s, accessScopes: s.accessScopes.filter(x => x !== slug) }));
  };

  const addLanguage = (code: string) => {
    if (staff.languages.includes(code)) return;
    setStaff(s => ({ ...s, languages: [...s.languages, code] }));
  };

  const removeLanguage = (code: string) => {
    setStaff(s => ({ ...s, languages: s.languages.filter(l => l !== code) }));
  };

  const addResponsibility = () => {
    const r = newResponsibility.trim();
    if (!r || staff.responsibilities.includes(r)) return;
    setStaff(s => ({ ...s, responsibilities: [...s.responsibilities, r] }));
    setNewResponsibility('');
  };

  const availableScopes = LOOKUP_ADMIN_SCOPES.filter(s => !staff.accessScopes.includes(s.slug));
  const availableLangs = LOOKUP_LANGUAGES.filter(l => !staff.languages.includes(l.code));

  return (
    <div className="p-6 lg:p-8">
      {deactivated && (
        <div className="mb-6 rounded-2xl border border-forest/20 bg-[#f0f4ee] p-4 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-forest" />
          <p className="text-[13px] font-medium text-forest">Account deactivated. Signing out…</p>
        </div>
      )}

      {staff.isSuspended && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <ShieldAlert size={18} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] font-bold text-slate">Account suspended</p>
            {staff.suspensionReason && (
              <p className="text-[13px] text-gray-500 mt-1">{staff.suspensionReason}</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#263d23] to-[#192b16] rounded-2xl p-6 text-white text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-2xl border-4 border-white/20 bg-forest flex items-center justify-center mx-auto text-2xl font-bold">
                {personal.firstName[0]}{personal.lastName[0]}
              </div>
              <button type="button" title="Upload avatar"
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md">
                <Upload size={13} className="text-forest" />
              </button>
            </div>
            <h2 className="serif text-2xl leading-none mb-1">{displayName}</h2>
            <p className="small-caps text-[9px] text-white/40">{staff.title}</p>
            <p className="text-[12px] text-white/30 mt-3">{user?.email}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold">
              <ShieldCheck size={12} /> Staff Access
            </div>
            <p className="text-[10px] text-white/30 mt-2">
              Member since {formatDate(staff.dateJoined)}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm">
            <div className="grid grid-cols-3 divide-x divide-brand-border">
              {[
                { icon: Users,        value: MOCK_ADMIN_ACCOUNT_STATS.usersManaged,        label: 'Users',         color: 'text-forest' },
                { icon: CheckCircle2, value: MOCK_ADMIN_ACCOUNT_STATS.verificationsProcessed, label: 'Verified',   color: 'text-amber-500' },
                { icon: Shield,       value: MOCK_ADMIN_ACCOUNT_STATS.disputesResolved,      label: 'Disputes',    color: 'text-[#4B7399]' },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="flex flex-col items-center py-5 gap-1.5">
                  <Icon size={16} className={color} />
                  <p className={cn('text-xl font-bold', color)}>{value}</p>
                  <p className="small-caps text-[8px] text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-5 space-y-3">
            <p className="small-caps text-[8px] text-gray-400">Account</p>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400">Role</span>
              <span className="font-semibold text-slate capitalize">admin</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400">Department</span>
              <span className="font-semibold text-slate">{staff.department}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400">Phone verified</span>
              <span className={cn('font-semibold', staff.phoneVerified ? 'text-forest' : 'text-gray-400')}>
                {staff.phoneVerified ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400">Staff access</span>
              <span className={cn('font-semibold', staff.isStaff ? 'text-forest' : 'text-gray-400')}>
                {staff.isStaff ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          <button type="button" onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-terracotta/20 bg-[#fdf3ec] text-terracotta font-bold text-[13px] hover:bg-[#fce8dc] transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        <div className="xl:col-span-2 space-y-4">
          {/* Personal */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="small-caps text-gray-400">Personal</p>
              </div>
              <button type="button" onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
                className="text-[12px] font-bold text-forest hover:underline">
                {editingSection === 'personal' ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                { label: 'First name', key: 'firstName' as const },
                { label: 'Last name', key: 'lastName' as const },
                { label: 'Phone', key: 'phone' as const },
                { label: 'Timezone', key: 'timezone' as const },
              ]).map(field => (
                <div key={field.key}>
                  <p className="small-caps text-[8px] text-gray-400 mb-1">{field.label}</p>
                  {editingSection === 'personal' ? (
                    <input value={personal[field.key]} onChange={e => setPersonal(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30" />
                  ) : (
                    <p className="text-[14px] font-semibold text-slate">{personal[field.key]}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-brand-border grid grid-cols-2 gap-4">
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1">Onboarding completed</p>
                {editingSection === 'personal' ? (
                  <button type="button" onClick={() => setPersonal(p => ({ ...p, onboardingCompleted: !p.onboardingCompleted }))}
                    className={cn('px-3 py-1.5 rounded-lg text-[12px] font-bold border',
                      personal.onboardingCompleted ? 'bg-forest text-white border-forest' : 'bg-white text-gray-500 border-brand-border')}>
                    {personal.onboardingCompleted ? 'Yes' : 'No'}
                  </button>
                ) : (
                  <p className="text-[14px] font-semibold text-slate">{personal.onboardingCompleted ? 'Yes' : 'No'}</p>
                )}
              </div>
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1">Onboarding step</p>
                {editingSection === 'personal' ? (
                  <input type="number" min={0} max={10} value={personal.onboardingStep}
                    onChange={e => setPersonal(p => ({ ...p, onboardingStep: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30" />
                ) : (
                  <p className="text-[14px] font-semibold text-slate">{personal.onboardingStep} / 10</p>
                )}
              </div>
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
                    {editingSection === 'personal' ? (
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

          {/* Staff & Access */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="small-caps text-gray-400">Staff & Access</p>
              </div>
              <button type="button" onClick={() => setEditingSection(editingSection === 'staff' ? null : 'staff')}
                className="text-[12px] font-bold text-forest hover:underline">
                {editingSection === 'staff' ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Title" editing={editingSection === 'staff'}
                  value={staff.title} onChange={v => setStaff(s => ({ ...s, title: v }))} />
                <Field label="Department" editing={editingSection === 'staff'}
                  value={staff.department} onChange={v => setStaff(s => ({ ...s, department: v }))} />
              </div>
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1">Bio</p>
                {editingSection === 'staff' ? (
                  <textarea value={staff.bio} onChange={e => setStaff(s => ({ ...s, bio: e.target.value }))}
                    className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30 min-h-[80px] resize-none" />
                ) : (
                  <p className="text-[14px] text-gray-500 leading-relaxed">{staff.bio}</p>
                )}
              </div>
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-2">Responsibilities</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {staff.responsibilities.map(r => (
                    <span key={r} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-50 border border-brand-border text-slate flex items-center gap-1">
                      {r}
                      {editingSection === 'staff' && (
                        <button type="button" onClick={() => setStaff(s => ({ ...s, responsibilities: s.responsibilities.filter(x => x !== r) }))}>
                          <X size={12} className="text-gray-400" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {editingSection === 'staff' && (
                  <div className="flex gap-2">
                    <input value={newResponsibility} onChange={e => setNewResponsibility(e.target.value)} placeholder="Add responsibility..."
                      className="flex-1 bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30" />
                    <button type="button" onClick={addResponsibility}
                      className="px-3 py-2 rounded-xl bg-forest text-white text-[12px] font-bold">
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-1">Date joined</p>
                  <p className="text-[14px] font-semibold text-slate">{formatDate(staff.dateJoined)}</p>
                </div>
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-1">Phone verified</p>
                  {editingSection === 'staff' ? (
                    <button type="button" onClick={() => setStaff(s => ({ ...s, phoneVerified: !s.phoneVerified }))}
                      className={cn('px-3 py-1.5 rounded-lg text-[12px] font-bold border',
                        staff.phoneVerified ? 'bg-forest text-white border-forest' : 'bg-white text-gray-500 border-brand-border')}>
                      {staff.phoneVerified ? 'Yes' : 'No'}
                    </button>
                  ) : (
                    <p className="text-[14px] font-semibold text-slate">{staff.phoneVerified ? 'Yes' : 'No'}</p>
                  )}
                </div>
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-1">Staff access</p>
                  {editingSection === 'staff' ? (
                    <button type="button" onClick={() => setStaff(s => ({ ...s, isStaff: !s.isStaff }))}
                      className={cn('px-3 py-1.5 rounded-lg text-[12px] font-bold border',
                        staff.isStaff ? 'bg-forest text-white border-forest' : 'bg-white text-gray-500 border-brand-border')}>
                      {staff.isStaff ? 'Enabled' : 'Disabled'}
                    </button>
                  ) : (
                    <p className="text-[14px] font-semibold text-slate">{staff.isStaff ? 'Enabled' : 'Disabled'}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-brand-border">
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-1">Google account</p>
                  <p className="text-[12px] font-mono text-gray-500 truncate">{staff.googleId ?? 'Not linked'}</p>
                </div>
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-1">Apple account</p>
                  <p className="text-[12px] font-mono text-gray-500 truncate">{staff.appleId ?? 'Not linked'}</p>
                </div>
              </div>
              {Object.keys(staff.metadata).length > 0 && (
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-2">metadata</p>
                  <div className="bg-brand-50 rounded-xl border border-brand-border p-3 space-y-1">
                    {Object.entries(staff.metadata).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[12px]">
                        <span className="text-gray-400 font-mono">{k}</span>
                        <span className="text-slate font-medium">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Access Scopes */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
            <div className="mb-4">
              <p className="small-caps text-gray-400">Access Scopes</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {staff.accessScopes.map(slug => (
                <span key={slug} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#f0f4ee] text-forest flex items-center gap-1.5">
                  {scopeName(slug)}
                  <button type="button" onClick={() => removeScope(slug)} title="Remove">
                    <X size={12} className="opacity-60 hover:opacity-100" />
                  </button>
                </span>
              ))}
              {staff.accessScopes.length === 0 && (
                <p className="text-[13px] text-gray-400">No access scopes assigned</p>
              )}
            </div>
            {availableScopes.length > 0 && (
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-2">Add from catalog</p>
                <div className="flex flex-wrap gap-2">
                  {availableScopes.map(s => (
                    <button key={s.slug} type="button" onClick={() => addScope(s.slug)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-dashed border-brand-border text-gray-500 hover:border-forest hover:text-forest flex items-center gap-1">
                      <Plus size={12} /> {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
            <div className="mb-4">
              <p className="small-caps text-gray-400">My Languages</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {staff.languages.map(code => (
                <span key={code} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#eef3f9] text-[#4B7399] flex items-center gap-1.5">
                  {LANGUAGE_LABELS[code] ?? code}
                  <button type="button" onClick={() => removeLanguage(code)} title="Remove">
                    <X size={12} className="opacity-60 hover:opacity-100" />
                  </button>
                </span>
              ))}
            </div>
            {availableLangs.length > 0 && (
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-2">Add from catalog</p>
                <div className="flex flex-wrap gap-2">
                  {availableLangs.map(l => (
                    <button key={l.code} type="button" onClick={() => addLanguage(l.code)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-dashed border-brand-border text-gray-500 hover:border-[#4B7399] hover:text-[#4B7399] flex items-center gap-1">
                      <Plus size={12} /> {l.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                  <p className="text-[12px] text-gray-400">Download a copy of your data</p>
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
                  <p className="text-[12px] text-gray-400">Permanently deactivate your account</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      <Modal open={showExport} onClose={() => setShowExport(false)} title="Export My Data" maxWidth="max-w-lg">
        <p className="text-[13px] text-gray-500 mb-4">
          Download a copy of your personal and staff data in JSON format.
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
            This will soft-deactivate your account. You will be signed out and unable to log in until another admin reactivates your account.
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

function Field({ label, value, editing, onChange, type = 'text' }: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <p className="small-caps text-[8px] text-gray-400 mb-1">{label}</p>
      {editing ? (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30" />
      ) : (
        <p className="text-[14px] font-semibold text-slate">{value || '—'}</p>
      )}
    </div>
  );
}
