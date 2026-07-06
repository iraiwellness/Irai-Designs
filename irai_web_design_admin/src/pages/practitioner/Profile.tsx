import { useState } from 'react';
import {
  LogOut, Shield, CreditCard, Bell, ChevronRight, Edit3, Star, Users,
  CheckCircle2, Clock, AlertTriangle, ShieldAlert, Globe, Phone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  MOCK_PRACTITIONER, MOCK_PERSONAL_PROFILE, MOCK_PROFESSIONAL_PROFILE,
} from '../../mockData';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import type { VerificationStatus } from '../../types';

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
  en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu',
};

export default function Profile() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const displayName = user?.name ?? MOCK_PRACTITIONER.name;
  const [personal, setPersonal] = useState(MOCK_PERSONAL_PROFILE);
  const [professional, setProfessional] = useState(MOCK_PROFESSIONAL_PROFILE);
  const [editingSection, setEditingSection] = useState<'personal' | 'professional' | null>(null);

  const handleLogout = () => { logout(); navigate('/', { replace: true }); };
  const verification = MOCK_PRACTITIONER.verificationStatus;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <p className="small-caps text-gray-400 mb-1">Practitioner</p>
        <h1 className="serif text-4xl text-slate leading-tight">Profile</h1>
      </div>

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
            {MOCK_PRACTITIONER.rejectionReason && (
              <p className="text-[13px] text-gray-500 mt-1">{MOCK_PRACTITIONER.rejectionReason}</p>
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
              <button type="button" className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md">
                <Edit3 size={13} className="text-forest" />
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
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm">
            <div className="grid grid-cols-3 divide-x divide-brand-border">
              {[
                { icon: CheckCircle2, value: MOCK_PRACTITIONER.totalSessions, label: 'Sessions', color: 'text-forest' },
                { icon: Star,         value: MOCK_PRACTITIONER.rating,       label: 'Rating',   color: 'text-amber-500' },
                { icon: Users,        value: MOCK_PRACTITIONER.totalClients, label: 'Clients',  color: 'text-[#4B7399]' },
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
          {/* Personal — PATCH /accounts/me/ */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="small-caps text-gray-400">Personal</p>
                <p className="text-[11px] text-gray-300 mt-0.5">PATCH /accounts/me/</p>
              </div>
              <button type="button" onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
                className="text-[12px] font-bold text-forest hover:underline">
                {editingSection === 'personal' ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'First name', key: 'firstName' as const },
                { label: 'Last name', key: 'lastName' as const },
                { label: 'Phone', key: 'phone' as const, icon: Phone },
                { label: 'Timezone', key: 'timezone' as const, icon: Globe },
              ].map(field => (
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
            <div className="mt-4 pt-4 border-t border-brand-border">
              <p className="small-caps text-[8px] text-gray-400 mb-3">Emergency Contact</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
                <div><span className="text-gray-400">Name</span><p className="font-medium text-slate">{personal.emergencyName}</p></div>
                <div><span className="text-gray-400">Phone</span><p className="font-medium text-slate">{personal.emergencyPhone}</p></div>
                <div><span className="text-gray-400">Relation</span><p className="font-medium text-slate">{personal.emergencyRelation}</p></div>
              </div>
            </div>
          </div>

          {/* Professional — PATCH /accounts/practitioner/profile/ */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="small-caps text-gray-400">Professional</p>
                <p className="text-[11px] text-gray-300 mt-0.5">PATCH /accounts/practitioner/profile/</p>
              </div>
              <button type="button" onClick={() => setEditingSection(editingSection === 'professional' ? null : 'professional')}
                className="text-[12px] font-bold text-forest hover:underline">
                {editingSection === 'professional' ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1">Title</p>
                {editingSection === 'professional' ? (
                  <input value={professional.title} onChange={e => setProfessional(p => ({ ...p, title: e.target.value }))}
                    className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 px-3 text-[13px] outline-none focus:border-forest/30" />
                ) : (
                  <p className="text-[14px] font-semibold text-slate">{professional.title}</p>
                )}
              </div>
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
                {[
                  { label: 'Fee (₹)', key: 'consultationFee' as const },
                  { label: 'Experience (yrs)', key: 'experienceYears' as const },
                  { label: 'Max/day', key: 'maxSessionsPerDay' as const },
                  { label: 'Max/week', key: 'maxSessionsPerWeek' as const },
                ].map(f => (
                  <div key={f.key}>
                    <p className="small-caps text-[8px] text-gray-400 mb-1">{f.label}</p>
                    <p className="text-[14px] font-semibold text-slate">{professional[f.key]}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <p className="small-caps text-[8px] text-gray-400 w-full">Languages</p>
                {professional.languages.map(code => (
                  <span key={code} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#f0f4ee] text-forest capitalize">
                    {LANGUAGE_LABELS[code] ?? code}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full', professional.isOnline ? 'bg-forest' : 'bg-gray-300')} />
                <span className="text-[13px] text-slate">{professional.isOnline ? 'Online — accepting clients' : 'Offline'}</span>
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
        </div>
      </div>
    </div>
  );
}
