import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Shield, CreditCard, Bell, ChevronRight, Star, Flame, CalendarRange,
  FileHeart, CheckCircle2, AlertTriangle, Upload, Download, UserX,
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import {
  PLANS, MOCK_SESSIONS, MOCK_PERSONAL_PROFILE, MOCK_PATIENT_PROFILE,
  MOCK_PATIENT_EXPORT_DATA,
} from '../../userData';
import { cn } from '../../lib/utils';

const ACCOUNT_PREFERENCES = [
  { icon: Bell, label: 'Notifications', desc: 'Session reminders & AI insights' },
  { icon: Shield, label: 'Security & Privacy', desc: 'Password, 2FA, data consent' },
  { icon: CreditCard, label: 'Billing & Plan', desc: 'Subscription, invoices, upgrades' },
];

const QUICK_LINKS = [
  { icon: CalendarRange, label: 'My Sessions', desc: 'View and reschedule', path: '/user/sessions' },
  { icon: FileHeart, label: 'Health Vault', desc: 'Medical documents & AI summary', path: '/user/health-vault' },
];

const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
] as const;

const YOGA_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'some', label: 'Some experience' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'active', label: 'Active' },
] as const;

const DURATION_OPTIONS = [30, 45, 60, 90];

const TIER_LABELS: Record<string, string> = {
  bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum',
};

type EditSection = 'personal' | 'wellness' | null;

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const plan = PLANS.find(p => p.id === user?.planId);

  const [personal, setPersonal] = useState(MOCK_PERSONAL_PROFILE);
  const [wellness, setWellness] = useState(MOCK_PATIENT_PROFILE);
  const [editingSection, setEditingSection] = useState<EditSection>(null);
  const [showExport, setShowExport] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [deactivated, setDeactivated] = useState(false);

  const displayName = `${personal.firstName} ${personal.lastName}`.trim() || user?.name || 'Member';
  const completedSessions = MOCK_SESSIONS.filter(s => s.status === 'completed').length;

  const handleLogout = () => { logout(); navigate('/', { replace: true }); };

  const finishPersonalEdit = () => {
    updateUser({
      name: `${personal.firstName} ${personal.lastName}`.trim(),
      onboarded: personal.onboardingCompleted,
      onboardingStep: personal.onboardingStep,
    });
    setEditingSection(null);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(MOCK_PATIENT_EXPORT_DATA, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'irai-patient-data-export.json';
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
        <p className="small-caps text-gray-400 mb-1">Member</p>
        <h1 className="serif text-4xl text-slate leading-tight">Profile</h1>
      </div>

      {deactivated && (
        <div className="mb-6 rounded-2xl border border-forest/20 bg-[#f0f4ee] p-4 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-forest" />
          <p className="text-[13px] font-medium text-forest">Account deactivated. Signing out…</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#263d23] to-[#192b16] rounded-2xl p-6 text-white text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-2xl border-4 border-white/20 bg-white/10 flex items-center justify-center mx-auto">
                <span className="serif text-3xl text-white/80">
                  {personal.firstName.charAt(0)}{personal.lastName.charAt(0)}
                </span>
              </div>
              <button type="button" title="Upload avatar"
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md">
                <Upload size={13} className="text-forest" />
              </button>
            </div>
            <h2 className="serif text-2xl leading-none mb-1">{displayName}</h2>
            <p className="small-caps text-[9px] text-white/40 capitalize">{wellness.tier} tier</p>
            <p className="text-[12px] text-white/30 mt-3">{user?.email}</p>
            {plan && (
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold">
                {plan.name} Plan
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm">
            <div className="grid grid-cols-3 divide-x divide-brand-border">
              {[
                { icon: Star, value: wellness.wellnessScore, label: 'Wellness', color: 'text-forest' },
                { icon: Flame, value: wellness.streakDays, label: 'Streak', color: 'text-terracotta' },
                { icon: CalendarRange, value: completedSessions, label: 'Sessions', color: 'text-[#4B7399]' },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="flex flex-col items-center py-5 gap-1.5">
                  <Icon size={16} className={color} />
                  <p className={cn('text-xl font-bold', color)}>{value}</p>
                  <p className="small-caps text-[8px] text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
            {QUICK_LINKS.map((item, i) => (
              <button key={item.label} type="button" onClick={() => navigate(item.path)}
                className={cn('w-full px-5 py-4 flex items-center gap-4 hover:bg-brand-50/50 transition-colors text-left',
                  i < QUICK_LINKS.length - 1 && 'border-b border-brand-border')}>
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-gray-400">
                  <item.icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-slate">{item.label}</p>
                  <p className="text-[12px] text-gray-400">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            ))}
          </div>

          <button type="button" onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-terracotta/20 bg-[#fdf3ec] text-terracotta font-bold text-[13px] hover:bg-[#fce8dc] transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Main content */}
        <div className="xl:col-span-2 space-y-4">
          {/* Personal */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="small-caps text-gray-400">Personal</p>
              <button type="button"
                onClick={() => editingSection === 'personal' ? finishPersonalEdit() : setEditingSection('personal')}
                className="text-[12px] font-bold text-forest hover:underline">
                {editingSection === 'personal' ? 'Save' : 'Edit'}
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
                    <input value={personal[field.key]}
                      onChange={e => setPersonal(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30" />
                  ) : (
                    <p className="text-[14px] font-semibold text-slate">{personal[field.key] || '—'}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-brand-border grid grid-cols-2 gap-4">
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1">Onboarding completed</p>
                {editingSection === 'personal' ? (
                  <button type="button"
                    onClick={() => setPersonal(p => ({ ...p, onboardingCompleted: !p.onboardingCompleted }))}
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
                      <input value={personal[field.key]}
                        onChange={e => setPersonal(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full mt-1 bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30" />
                    ) : (
                      <p className="font-medium text-slate">{personal[field.key] || '—'}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wellness & Health */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="small-caps text-gray-400">Wellness & Health</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Patient profile · used for session personalisation</p>
              </div>
              <button type="button"
                onClick={() => setEditingSection(editingSection === 'wellness' ? null : 'wellness')}
                className="text-[12px] font-bold text-forest hover:underline">
                {editingSection === 'wellness' ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-1">Gender</p>
                  {editingSection === 'wellness' ? (
                    <select value={wellness.gender}
                      onChange={e => setWellness(w => ({ ...w, gender: e.target.value as typeof wellness.gender }))}
                      className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30">
                      <option value="">Select…</option>
                      {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <p className="text-[14px] font-semibold text-slate capitalize">
                      {GENDER_OPTIONS.find(o => o.value === wellness.gender)?.label ?? '—'}
                    </p>
                  )}
                </div>
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-1">Date of birth</p>
                  {editingSection === 'wellness' ? (
                    <input type="date" value={wellness.dateOfBirth}
                      onChange={e => setWellness(w => ({ ...w, dateOfBirth: e.target.value }))}
                      className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30" />
                  ) : (
                    <p className="text-[14px] font-semibold text-slate">
                      {wellness.dateOfBirth
                        ? new Date(wellness.dateOfBirth + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        : '—'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1">Primary concern</p>
                {editingSection === 'wellness' ? (
                  <textarea value={wellness.primaryConcern}
                    onChange={e => setWellness(w => ({ ...w, primaryConcern: e.target.value }))}
                    className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30 min-h-[72px] resize-none" />
                ) : (
                  <p className="text-[14px] text-gray-500 leading-relaxed">{wellness.primaryConcern || '—'}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-1">Yoga experience</p>
                  {editingSection === 'wellness' ? (
                    <select value={wellness.yogaExperience}
                      onChange={e => setWellness(w => ({ ...w, yogaExperience: e.target.value as typeof wellness.yogaExperience }))}
                      className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30">
                      <option value="">Select…</option>
                      {YOGA_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <p className="text-[14px] font-semibold text-slate">
                      {YOGA_OPTIONS.find(o => o.value === wellness.yogaExperience)?.label ?? '—'}
                    </p>
                  )}
                </div>
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-1">Activity level</p>
                  {editingSection === 'wellness' ? (
                    <select value={wellness.activityLevel}
                      onChange={e => setWellness(w => ({ ...w, activityLevel: e.target.value as typeof wellness.activityLevel }))}
                      className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30">
                      <option value="">Select…</option>
                      {ACTIVITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <p className="text-[14px] font-semibold text-slate capitalize">{wellness.activityLevel || '—'}</p>
                  )}
                </div>
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-1">Preferred duration</p>
                  {editingSection === 'wellness' ? (
                    <select value={wellness.preferredDurationMinutes}
                      onChange={e => setWellness(w => ({ ...w, preferredDurationMinutes: parseInt(e.target.value, 10) }))}
                      className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30">
                      {DURATION_OPTIONS.map(d => <option key={d} value={d}>{d} min</option>)}
                    </select>
                  ) : (
                    <p className="text-[14px] font-semibold text-slate">{wellness.preferredDurationMinutes} min</p>
                  )}
                </div>
              </div>

              <Field label="Location" editing={editingSection === 'wellness'}
                value={wellness.location} onChange={v => setWellness(w => ({ ...w, location: v }))} />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-brand-border">
                {([
                  { label: 'Wellness score', key: 'wellnessScore' as const },
                  { label: 'Current streak', key: 'streakDays' as const },
                  { label: 'Longest streak', key: 'longestStreak' as const },
                ]).map(f => (
                  <div key={f.key}>
                    <p className="small-caps text-[8px] text-gray-400 mb-1">{f.label}</p>
                    <p className="text-[14px] font-semibold text-slate">{wellness[f.key]}</p>
                  </div>
                ))}
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-1">Tier</p>
                  {editingSection === 'wellness' ? (
                    <select value={wellness.tier}
                      onChange={e => setWellness(w => ({ ...w, tier: e.target.value }))}
                      className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30">
                      {Object.entries(TIER_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  ) : (
                    <p className="text-[14px] font-semibold text-slate capitalize">{TIER_LABELS[wellness.tier] ?? wellness.tier}</p>
                  )}
                </div>
              </div>

              {wellness.lastSessionDate && (
                <p className="text-[12px] text-gray-400">
                  Last session: {new Date(wellness.lastSessionDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}

              {Object.keys(wellness.metadata).length > 0 && (
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-2">Metadata</p>
                  <div className="bg-brand-50 rounded-xl border border-brand-border p-3 space-y-1">
                    {Object.entries(wellness.metadata).map(([k, v]) => (
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

          {/* Account preferences */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-border">
              <p className="small-caps text-gray-400">Account Preferences</p>
            </div>
            {ACCOUNT_PREFERENCES.map((item, i) => (
              <button key={item.label} type="button"
                onClick={() => item.label === 'Billing & Plan' && navigate('/pricing')}
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
                    <p className="text-[12px] text-gray-400">
                      {item.label === 'Billing & Plan' && plan
                        ? `${plan.name} · ₹${plan.price.toLocaleString('en-IN')}/mo`
                        : item.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            ))}
          </div>

          {/* Account actions */}
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

      {/* Export modal */}
      <Modal open={showExport} onClose={() => setShowExport(false)} title="Export My Data" maxWidth="max-w-lg">
        <p className="text-[13px] text-gray-500 mb-4">
          Download a copy of your personal and wellness profile data in JSON format.
        </p>
        <pre className="bg-brand-50 border border-brand-border rounded-xl p-4 text-[11px] font-mono text-slate overflow-auto max-h-64 mb-4">
          {JSON.stringify(MOCK_PATIENT_EXPORT_DATA, null, 2)}
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

      {/* Deactivate modal */}
      <Modal open={showDeactivate} onClose={() => setShowDeactivate(false)} title="Deactivate Account">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={20} className="text-terracotta shrink-0 mt-0.5" />
          <p className="text-[13px] text-gray-600 leading-relaxed">
            This will soft-deactivate your account. You will be signed out and unable to log in until support reactivates your account.
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
