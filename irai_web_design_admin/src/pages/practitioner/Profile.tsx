import { useState } from 'react';
import {
  LogOut, Shield, CreditCard, Bell, ChevronRight, Edit3, Star, Users,
  CheckCircle2, Clock, AlertTriangle, ShieldAlert, Upload,
  Download, UserX, Plus, X, Video,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import {
  MOCK_PRACTITIONER, MOCK_PERSONAL_PROFILE, MOCK_PROFESSIONAL_PROFILE,
  LOOKUP_SPECIALIZATIONS, LOOKUP_LANGUAGES, MOCK_PRACTITIONER_EXPORT_DATA,
} from '../../mockData';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';
type ProfilePractitioner = typeof MOCK_PRACTITIONER & {
  verificationStatus?: VerificationStatus;
  rejectionReason?: string;
  totalSessions?: number | string;
};

const VERIFICATION_CONFIG: Record<Exclude<VerificationStatus, 'verified'>, {
  icon: typeof Clock;
  border: string;
  bg: string;
  iconColor: string;
  title: string;
}> = {
  pending: {
    icon: Clock,
    border: 'border-amber-200',
    bg: 'bg-[#fdf8ee]',
    iconColor: 'text-amber-600',
    title: 'Awaiting admin verification',
  },
  rejected: {
    icon: AlertTriangle,
    border: 'border-terracotta/30',
    bg: 'bg-[#fdf3ec]',
    iconColor: 'text-terracotta',
    title: 'Verification rejected',
  },
  suspended: {
    icon: ShieldAlert,
    border: 'border-red-200',
    bg: 'bg-red-50',
    iconColor: 'text-red-600',
    title: 'Account suspended',
  },
};

const ACCOUNT_PREFERENCES = [
  { icon: Bell,       label: 'Notifications',      desc: 'Email and push alerts' },
  { icon: Shield,     label: 'Security & Privacy', desc: 'Password, 2FA, data' },
  { icon: CreditCard, label: 'Payout Settings',    desc: 'Bank account, tax info' },
];

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', ml: 'Malayalam', kn: 'Kannada',
};

function specName(slug: string) {
  return LOOKUP_SPECIALIZATIONS.find(s => s.slug === slug)?.name ?? slug;
}

export default function Profile() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const practitioner = MOCK_PRACTITIONER as ProfilePractitioner;
  const displayName = user?.name ?? practitioner.name;
  const [personal, setPersonal] = useState(MOCK_PERSONAL_PROFILE);
  const [professional, setProfessional] = useState(MOCK_PROFESSIONAL_PROFILE);
  const [editingSection, setEditingSection] = useState<'personal' | 'professional' | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [deactivated, setDeactivated] = useState(false);
  const [newQualification, setNewQualification] = useState('');

  const handleLogout = () => { logout(); navigate('/', { replace: true }); };
  const verification = practitioner.verificationStatus ?? 'verified';

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(MOCK_PRACTITIONER_EXPORT_DATA, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'irai-practitioner-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
    setExportDone(true);
  };

  const handleDeactivate = () => {
    setDeactivated(true);
    setShowDeactivate(false);
    setTimeout(() => { logout(); navigate('/', { replace: true }); }, 1500);
  };

  const addSpecialization = (slug: string) => {
    if (professional.specializations.includes(slug)) return;
    setProfessional(p => ({ ...p, specializations: [...p.specializations, slug] }));
  };

  const removeSpecialization = (slug: string) => {
    setProfessional(p => ({ ...p, specializations: p.specializations.filter(s => s !== slug) }));
  };

  const addLanguage = (code: string) => {
    if (professional.languages.includes(code)) return;
    setProfessional(p => ({ ...p, languages: [...p.languages, code] }));
  };

  const removeLanguage = (code: string) => {
    setProfessional(p => ({ ...p, languages: p.languages.filter(l => l !== code) }));
  };

  const addQualification = () => {
    const q = newQualification.trim();
    if (!q || professional.qualifications.includes(q)) return;
    setProfessional(p => ({ ...p, qualifications: [...p.qualifications, q] }));
    setNewQualification('');
  };

  const availableSpecs = LOOKUP_SPECIALIZATIONS.filter(s => !professional.specializations.includes(s.slug));
  const availableLangs = LOOKUP_LANGUAGES.filter(l => !professional.languages.includes(l.code));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <p className="small-caps text-gray-400 mb-1">Practitioner</p>
        <h1 className="serif text-4xl text-slate leading-tight">Profile</h1>
      </div>

      {deactivated && (
        <div className="mb-6 rounded-2xl border border-forest/20 bg-[#f0f4ee] p-4 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-forest" />
          <p className="text-[13px] font-medium text-forest">Account deactivated. Signing out…</p>
        </div>
      )}

      {verification !== 'verified' && (
        <div className={cn(
          'mb-6 rounded-2xl border p-4 flex items-start gap-3',
          VERIFICATION_CONFIG[verification].border,
          VERIFICATION_CONFIG[verification].bg,
        )}>
          {(() => {
            const Icon = VERIFICATION_CONFIG[verification].icon;
            return <Icon size={18} className={VERIFICATION_CONFIG[verification].iconColor} />;
          })()}
          <div>
            <p className="text-[14px] font-bold text-slate">{VERIFICATION_CONFIG[verification].title}</p>
            {practitioner.rejectionReason && (
              <p className="text-[13px] text-gray-500 mt-1">{practitioner.rejectionReason}</p>
            )}
            {verification === 'pending' && (
              <p className="text-[13px] text-gray-500 mt-1">Complete your professional profile below. You won&apos;t appear in public listings until approved.</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#263d23] to-[#192b16] rounded-2xl p-6 text-white text-center">
            <div className="relative inline-block mb-4">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71f1536783?w=300&h=300&fit=crop"
                alt={displayName}
                className="w-24 h-24 rounded-2xl border-4 border-white/20 object-cover mx-auto"
              />
              <button type="button" title="Upload avatar"
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md">
                <Upload size={13} className="text-forest" />
              </button>
            </div>
            <h2 className="serif text-2xl leading-none mb-1">{displayName}</h2>
            <p className="small-caps text-[9px] text-white/40">{professional.title}</p>
            <p className="text-[12px] text-white/30 mt-3">{user?.email}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold capitalize">
              {verification === 'verified' ? (
                <><CheckCircle2 size={12} /> Verified</>
              ) : (
                <><Clock size={12} /> {verification}</>
              )}
            </div>
            {professional.verifiedAt && verification === 'verified' && (
              <p className="text-[10px] text-white/30 mt-2">
                Verified {new Date(professional.verifiedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm">
            <div className="grid grid-cols-3 divide-x divide-brand-border">
              {[
                { icon: CheckCircle2, value: practitioner.totalSessions ?? '1.2k', label: 'Sessions', color: 'text-forest' },
                { icon: Star,         value: practitioner.rating,                  label: 'Rating',   color: 'text-amber-500' },
                { icon: Users,        value: practitioner.totalClients,            label: 'Clients',  color: 'text-[#4B7399]' },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="flex flex-col items-center py-5 gap-1.5">
                  <Icon size={16} className={color} />
                  <p className={cn('text-xl font-bold', color)}>{value}</p>
                  <p className="small-caps text-[8px] text-gray-400">{label}</p>
                </div>
              ))}
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

          {/* Professional */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="small-caps text-gray-400">Professional</p>
              </div>
              <button type="button" onClick={() => setEditingSection(editingSection === 'professional' ? null : 'professional')}
                className="text-[12px] font-bold text-forest hover:underline">
                {editingSection === 'professional' ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="space-y-4">
              <Field label="Title" editing={editingSection === 'professional'}
                value={professional.title} onChange={v => setProfessional(p => ({ ...p, title: v }))} />
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1">Bio</p>
                {editingSection === 'professional' ? (
                  <textarea value={professional.bio} onChange={e => setProfessional(p => ({ ...p, bio: e.target.value }))}
                    className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30 min-h-[80px] resize-none" />
                ) : (
                  <p className="text-[14px] text-gray-500 leading-relaxed">{professional.bio}</p>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {([
                  { label: 'Fee (₹)', key: 'consultationFee' as const, type: 'number' },
                  { label: 'Experience (yrs)', key: 'experienceYears' as const, type: 'number' },
                  { label: 'Max/day', key: 'maxSessionsPerDay' as const, type: 'number' },
                  { label: 'Max/week', key: 'maxSessionsPerWeek' as const, type: 'number' },
                ]).map(f => (
                  <div key={f.key}>
                    <p className="small-caps text-[8px] text-gray-400 mb-1">{f.label}</p>
                    {editingSection === 'professional' ? (
                      <input type="number" value={professional[f.key]}
                        onChange={e => setProfessional(p => ({ ...p, [f.key]: parseInt(e.target.value, 10) || 0 }))}
                        className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30" />
                    ) : (
                      <p className="text-[14px] font-semibold text-slate">{professional[f.key]}</p>
                    )}
                  </div>
                ))}
              </div>
              <Field label="Booking buffer (days)" editing={editingSection === 'professional'}
                value={String(professional.bookingBufferDays)} type="number"
                onChange={v => setProfessional(p => ({ ...p, bookingBufferDays: parseInt(v, 10) || 0 }))} />
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1 flex items-center gap-1">
                  <Video size={12} /> Video intro URL
                </p>
                {editingSection === 'professional' ? (
                  <input value={professional.videoIntroUrl} onChange={e => setProfessional(p => ({ ...p, videoIntroUrl: e.target.value }))}
                    className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30 font-mono text-[12px]" />
                ) : (
                  <p className="text-[12px] font-mono text-gray-500 truncate">{professional.videoIntroUrl || '—'}</p>
                )}
              </div>
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-2">Qualifications</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {professional.qualifications.map(q => (
                    <span key={q} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-50 border border-brand-border text-slate flex items-center gap-1">
                      {q}
                      {editingSection === 'professional' && (
                        <button type="button" onClick={() => setProfessional(p => ({ ...p, qualifications: p.qualifications.filter(x => x !== q) }))}>
                          <X size={12} className="text-gray-400" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {editingSection === 'professional' && (
                  <div className="flex gap-2">
                    <input value={newQualification} onChange={e => setNewQualification(e.target.value)} placeholder="Add qualification..."
                      className="flex-1 bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30" />
                    <button type="button" onClick={addQualification}
                      className="px-3 py-2 rounded-xl bg-forest text-white text-[12px] font-bold">
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn('w-2 h-2 rounded-full', professional.isOnline ? 'bg-forest' : 'bg-gray-300')} />
                  <span className="text-[13px] text-slate">{professional.isOnline ? 'Online — accepting clients' : 'Offline'}</span>
                </div>
                {editingSection === 'professional' && (
                  <button type="button" onClick={() => setProfessional(p => ({ ...p, isOnline: !p.isOnline }))}
                    className={cn('px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors',
                      professional.isOnline ? 'bg-forest text-white border-forest' : 'bg-white text-gray-500 border-brand-border')}>
                    Toggle online
                  </button>
                )}
              </div>
              {Object.keys(professional.metadata).length > 0 && (
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-2">metadata</p>
                  <div className="bg-brand-50 rounded-xl border border-brand-border p-3 space-y-1">
                    {Object.entries(professional.metadata).map(([k, v]) => (
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

          {/* 3.4 Specializations */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
            <div className="mb-4">
              <p className="small-caps text-gray-400">My Specializations</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {professional.specializations.map(slug => (
                <span key={slug} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#f0f4ee] text-forest flex items-center gap-1.5">
                  {specName(slug)}
                  <button type="button" onClick={() => removeSpecialization(slug)} title="DELETE">
                    <X size={12} className="opacity-60 hover:opacity-100" />
                  </button>
                </span>
              ))}
              {professional.specializations.length === 0 && (
                <p className="text-[13px] text-gray-400">No specializations added</p>
              )}
            </div>
            {availableSpecs.length > 0 && (
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-2">Add from catalog</p>
                <div className="flex flex-wrap gap-2">
                  {availableSpecs.map(s => (
                    <button key={s.slug} type="button" onClick={() => addSpecialization(s.slug)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-dashed border-brand-border text-gray-500 hover:border-forest hover:text-forest flex items-center gap-1">
                      <Plus size={12} /> {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3.5 Languages */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
            <div className="mb-4">
              <p className="small-caps text-gray-400">My Languages</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {professional.languages.map(code => (
                <span key={code} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#eef3f9] text-[#4B7399] flex items-center gap-1.5">
                  {LANGUAGE_LABELS[code] ?? code}
                  <button type="button" onClick={() => removeLanguage(code)} title="DELETE">
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
          Download a copy of your personal and professional data in JSON format.
        </p>
        <pre className="bg-brand-50 border border-brand-border rounded-xl p-4 text-[11px] font-mono text-slate overflow-auto max-h-64 mb-4">
          {JSON.stringify(MOCK_PRACTITIONER_EXPORT_DATA, null, 2)}
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
            This will soft-deactivate your account. You will be signed out and unable to log in until an admin reactivates your account.
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
