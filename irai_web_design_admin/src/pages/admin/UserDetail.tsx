import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Mail, Calendar, Activity, FileText, Shield,
  Ban, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Plus,
  Star, Sparkles,
} from 'lucide-react';
import {
  ADMIN_USERS, ADMIN_ACTIVITY, userFullName,
  type AdminUser, type PatientProfile, type PractitionerProfile,
  type TherapistStatus, type UserRole,
} from '../../adminData';
import { MOCK_PATIENTS } from '../../mockData';
import { cn } from '../../lib/utils';

const ROLE_STYLE: Record<UserRole, string> = {
  patient: 'text-[#4B7399] border-[#4B7399]/20 bg-[#eef3f9]',
  practitioner: 'text-forest border-forest/20 bg-[#f0f4ee]',
  admin: 'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
};

const PRACTITIONER_STATUS_STYLE: Record<TherapistStatus, string> = {
  verified: 'text-forest border-forest/20 bg-[#f0f4ee]',
  pending: 'text-amber-600 border-amber-200 bg-amber-50',
  rejected: 'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
  suspended: 'text-gray-400 border-gray-200 bg-gray-50',
};

const ADMIN_NOTES = [
  { session: 3, date: 'May 10, 2026', text: 'Account reviewed during routine compliance check. No issues flagged. Patient tier upgraded to silver.' },
  { session: 2, date: 'Apr 22, 2026', text: 'Responded to support ticket regarding booking cancellation. Refund policy explained.' },
];

function accountState(u: AdminUser): 'active' | 'inactive' | 'deleted' {
  if (u.isDeleted) return 'deleted';
  if (!u.isActive) return 'inactive';
  return 'active';
}

function formatDate(iso: string) {
  return new Date(iso + (iso.includes('T') ? '' : 'T12:00')).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function userSubtitle(user: AdminUser): string {
  if (user.patientProfile?.primaryConcern) return user.patientProfile.primaryConcern;
  if (user.practitionerProfile?.title) return user.practitionerProfile.title;
  if (user.role === 'admin') return 'Platform Administrator';
  return user.role;
}

function patientMatch(user: AdminUser) {
  return MOCK_PATIENTS.find(p => p.email === user.email);
}

function userActivity(user: AdminUser) {
  const name = userFullName(user);
  return ADMIN_ACTIVITY.filter(a =>
    a.description.includes(name) || a.description.includes(user.email),
  );
}

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = ADMIN_USERS.find(u => u.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'profile'>('overview');

  if (!user) {
    return (
      <div className="min-h-full bg-brand-50 p-6 lg:p-8">
        <button type="button" onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2 text-[13px] font-semibold text-forest hover:underline mb-6">
          <ArrowLeft size={16} /> Back to Users
        </button>
        <p className="text-[14px] text-gray-400">User not found.</p>
      </div>
    );
  }

  const state = accountState(user);
  const matchedPatient = patientMatch(user);
  const avatar = matchedPatient?.avatar;
  const phone = matchedPatient?.phone ?? '—';
  const activity = userActivity(user);
  const pp = user.patientProfile;
  const pr = user.practitionerProfile;

  const overviewStats = [
    {
      icon: Calendar,
      label: 'Joined',
      value: formatDate(user.dateJoined),
      bg: 'bg-[#f0f4ee]',
      iconColor: 'text-forest',
    },
    {
      icon: Activity,
      label: 'Status',
      value: state.charAt(0).toUpperCase() + state.slice(1),
      bg: state === 'active' ? 'bg-[#f0f4ee]' : state === 'inactive' ? 'bg-amber-50' : 'bg-gray-50',
      iconColor: state === 'active' ? 'text-forest' : state === 'inactive' ? 'text-amber-600' : 'text-gray-400',
    },
    ...(pp ? [
      {
        icon: Sparkles,
        label: 'Wellness',
        value: String(pp.wellnessScore),
        bg: 'bg-[#eef3f9]',
        iconColor: 'text-[#4B7399]',
      },
      {
        icon: Star,
        label: 'Tier',
        value: pp.tier.charAt(0).toUpperCase() + pp.tier.slice(1),
        bg: 'bg-amber-50',
        iconColor: 'text-amber-600',
      },
    ] : []),
    ...(pr && !pp ? [
      {
        icon: CheckCircle2,
        label: 'Verification',
        value: pr.status.charAt(0).toUpperCase() + pr.status.slice(1),
        bg: 'bg-[#f0f4ee]',
        iconColor: 'text-forest',
      },
      {
        icon: Activity,
        label: 'Sessions',
        value: String(pr.totalSessions),
        bg: 'bg-[#eef3f9]',
        iconColor: 'text-[#4B7399]',
      },
    ] : []),
  ];

  return (
    <div className="min-h-full bg-brand-50 pb-8">
      {/* Dark hero header */}
      <div className="bg-gradient-to-br from-[#263d23] to-[#192b16] relative overflow-hidden" style={{ minHeight: 230 }}>
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/[0.03] rounded-full" />
        <div className="absolute bottom-0 -left-12 w-40 h-40 bg-white/[0.03] rounded-full blur-2xl" />

        <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-4">
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="w-9 h-9 bg-white/10 border border-white/15 rounded-full flex items-center justify-center active:scale-95 transition-all"
          >
            <ArrowLeft size={16} className="text-white" />
          </button>
          <button
            type="button"
            className="w-9 h-9 bg-white/10 border border-white/15 rounded-full flex items-center justify-center active:scale-95 transition-all"
          >
            <Ban size={16} className="text-white" />
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center pb-7 px-5">
          {avatar ? (
            <img
              src={avatar}
              alt={userFullName(user)}
              className="w-20 h-20 rounded-[24px] border-4 border-white/20 shadow-xl object-cover mb-3"
            />
          ) : (
            <div className="w-20 h-20 rounded-[24px] border-4 border-white/20 shadow-xl bg-forest flex items-center justify-center text-white text-xl font-bold mb-3">
              {user.firstName[0]}{user.lastName[0]}
            </div>
          )}
          <h1 className="serif text-[24px] text-white leading-none mb-1">{userFullName(user)}</h1>
          <p className="small-caps text-[8px] text-white/40">{userSubtitle(user)}</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
            <span className={cn('text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border', ROLE_STYLE[user.role])}>
              {user.role}
            </span>
            {user.isStaff && (
              <span className="text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border text-terracotta border-terracotta/20 bg-[#fdf3ec]">
                Staff
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-brand-border px-5 flex gap-1">
        {(['overview', 'profile'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all',
              activeTab === tab
                ? 'border-forest text-forest'
                : 'border-transparent text-gray-400',
            )}
          >
            {tab === 'profile' && <FileText size={11} />}
            {tab === 'overview' ? 'Overview' : 'Profile'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5 space-y-4 max-w-3xl mx-auto"
          >
            {/* Action buttons */}
            <div className="flex gap-3">
              <button type="button"
                className="flex-1 bg-forest text-white py-3 rounded-2xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all">
                <Mail size={15} /> Email User
              </button>
              <button type="button" onClick={() => navigate('/admin/bookings')}
                className="flex-1 bg-white border border-brand-border text-slate py-3 rounded-2xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all">
                <FileText size={15} /> View Bookings
              </button>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              {overviewStats.map(({ icon: Icon, label, value, bg, iconColor }) => (
                <div key={label} className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 flex items-center gap-3">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', bg)}>
                    <Icon size={16} className={iconColor} />
                  </div>
                  <div>
                    <p className="small-caps text-[7px] text-gray-400">{label}</p>
                    <p className="text-[11px] font-bold text-slate">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Account */}
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-3">
              <p className="small-caps text-gray-400">Account</p>
              {[
                { label: 'User ID', value: user.id },
                { label: 'Role', value: user.role },
                { label: 'Staff access', value: user.isStaff ? 'Yes' : 'No' },
                { label: 'Deleted', value: user.isDeleted ? 'Yes' : 'No' },
              ].map(({ label, value }, i) => (
                <div key={label}>
                  {i > 0 && <div className="h-px bg-brand-border opacity-50" />}
                  <div className={cn('flex justify-between', i > 0 && 'pt-3')}>
                    <span className="small-caps text-[7px] text-gray-400">{label}</span>
                    <span className="text-[11px] font-medium text-slate capitalize">{value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-3">
              <p className="small-caps text-gray-400">Contact Info</p>
              {[
                { label: 'Email', value: user.email },
                { label: 'Phone', value: phone },
              ].map(({ label, value }, i) => (
                <div key={label}>
                  {i > 0 && <div className="h-px bg-brand-border opacity-50" />}
                  <div className={cn('flex justify-between', i > 0 && 'pt-3')}>
                    <span className="small-caps text-[7px] text-gray-400">{label}</span>
                    <span className="text-[11px] font-medium text-slate">{value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Patient quick summary */}
            {pp && (
              <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-3">
                <p className="small-caps text-[#4B7399]">Patient Summary</p>
                {pp.primaryConcern && (
                  <p className="text-[11px] text-gray-500 leading-relaxed">{pp.primaryConcern}</p>
                )}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {pp.location && (
                    <div>
                      <p className="text-gray-400">Location</p>
                      <p className="font-semibold text-slate">{pp.location}</p>
                    </div>
                  )}
                  {pp.lastSessionDate && (
                    <div>
                      <p className="text-gray-400">Last session</p>
                      <p className="font-semibold text-slate">{formatDate(pp.lastSessionDate)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400">Streak</p>
                    <p className="font-semibold text-slate">{pp.streakDays} days</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Activity</p>
                    <p className="font-semibold text-slate capitalize">{pp.activityLevel ?? '—'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Practitioner quick summary */}
            {pr && (
              <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-3">
                <p className="small-caps text-forest">Practitioner Summary</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', PRACTITIONER_STATUS_STYLE[pr.status])}>
                    {pr.status}
                  </span>
                  {pr.isOnline && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-forest/10 text-forest">Online</span>
                  )}
                  {pr.rating > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate">
                      <Star size={12} className="text-amber-500 fill-amber-500" /> {pr.rating}
                    </span>
                  )}
                </div>
                {pr.bio && <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3">{pr.bio}</p>}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <p className="text-gray-400">Experience</p>
                    <p className="font-semibold text-slate">{pr.experienceYears} yrs</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Fee</p>
                    <p className="font-semibold text-slate">₹{pr.consultationFee}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Clients</p>
                    <p className="font-semibold text-slate">{pr.totalClients}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Sessions</p>
                    <p className="font-semibold text-slate">{pr.totalSessions}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent activity */}
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="small-caps text-gray-400">Recent Activity</p>
                <button type="button" onClick={() => navigate('/admin/activity')}
                  className="small-caps text-[8px] text-forest font-bold">
                  View All
                </button>
              </div>
              {activity.length === 0 ? (
                <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 text-center">
                  <p className="text-[11px] text-gray-400">No recent activity for this user</p>
                </div>
              ) : (
                activity.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-1">
                    <p className="text-[11px] text-gray-600 leading-relaxed">{item.description}</p>
                    <p className="small-caps text-[7px] text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                ))
              )}
            </section>

            {/* Admin notes */}
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="small-caps text-gray-400">Admin Notes</p>
                <button type="button" className="flex items-center gap-1 small-caps text-[8px] text-forest">
                  <Plus size={11} /> Add Note
                </button>
              </div>
              {ADMIN_NOTES.map((note, i) => (
                <div key={i} className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="small-caps text-[7px] text-forest bg-[#f0f4ee] px-2 py-0.5 rounded-full border border-forest/20">
                      Note #{note.session}
                    </span>
                    <span className="small-caps text-[7px] text-gray-400">{note.date}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{note.text}</p>
                </div>
              ))}
            </section>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5 space-y-4 max-w-3xl mx-auto"
          >
            {/* Account profile */}
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-5 space-y-4">
              <p className="small-caps text-gray-400">Account Details</p>
              <div className="grid grid-cols-2 gap-3">
                <ProfileField label="User ID" value={user.id} />
                <ProfileField label="Email" value={user.email} />
                <ProfileField label="Role" value={<span className="capitalize">{user.role}</span>} />
                <ProfileField label="Account state" value={<span className="capitalize">{state}</span>} />
                <ProfileField label="Staff access" value={user.isStaff ? 'Yes' : 'No'} />
                <ProfileField label="Date joined" value={formatDate(user.dateJoined)} />
                <ProfileField label="Has patient profile" value={user.hasPatientProfile ? 'Yes' : 'No'} />
                <ProfileField label="Has practitioner profile" value={user.hasPractitionerProfile ? 'Yes' : 'No'} />
              </div>
            </div>

            {pp && (
              <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-5 space-y-4">
                <p className="small-caps text-[#4B7399]">Patient Profile</p>
                <PatientProfileDetail profile={pp} />
              </div>
            )}

            {pr && (
              <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-5 space-y-4">
                <p className="small-caps text-forest">Practitioner Profile</p>
                <PractitionerProfileDetail profile={pr} />
              </div>
            )}

            {!pp && !pr && (
              <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-8 text-center">
                <Shield size={28} className="mx-auto mb-3 text-gray-200" />
                <p className="text-[13px] text-gray-400">No nested profiles on this account</p>
                <p className="text-[11px] text-gray-300 mt-1">Only base account information is available</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-gray-400 text-[11px]">{label}</p>
      <p className="font-medium text-slate text-[13px]">{value ?? '—'}</p>
    </div>
  );
}

function PatientProfileDetail({ profile: p }: { profile: PatientProfile }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between text-left"
      >
        <p className="text-[13px] font-semibold text-slate">Full patient record</p>
        {expanded ? <ChevronUp size={16} className="text-gray-300" /> : <ChevronDown size={16} className="text-gray-300" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <ProfileField label="Profile ID" value={p.id} />
              <ProfileField label="Tier" value={<span className="capitalize">{p.tier}</span>} />
              <ProfileField label="Gender" value={p.gender ? <span className="capitalize">{p.gender}</span> : null} />
              <ProfileField label="Date of Birth" value={p.dateOfBirth ? formatDate(p.dateOfBirth) : null} />
              <ProfileField label="Location" value={p.location || null} />
              <ProfileField label="Yoga Experience" value={p.yogaExperience ? <span className="capitalize">{p.yogaExperience}</span> : null} />
              <ProfileField label="Activity Level" value={p.activityLevel ? <span className="capitalize">{p.activityLevel}</span> : null} />
              <ProfileField label="Preferred Duration" value={p.preferredDurationMinutes ? `${p.preferredDurationMinutes} min` : null} />
              <ProfileField label="Wellness Score" value={p.wellnessScore} />
              <ProfileField label="Streak" value={`${p.streakDays} days (best ${p.longestStreak})`} />
              <ProfileField label="Last Session" value={p.lastSessionDate ? formatDate(p.lastSessionDate) : null} />
            </div>
            {p.primaryConcern && (
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1">Primary Concern</p>
                <p className="text-[13px] text-gray-600 leading-relaxed">{p.primaryConcern}</p>
              </div>
            )}
            {Object.keys(p.metadata).length > 0 && <MetadataBlock metadata={p.metadata} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PractitionerProfileDetail({ profile: p }: { profile: PractitionerProfile }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <p className="text-[14px] font-semibold text-slate">{p.title}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', PRACTITIONER_STATUS_STYLE[p.status])}>{p.status}</span>
            {p.isOnline && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-forest/10 text-forest">Online</span>}
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-gray-300 shrink-0" /> : <ChevronDown size={16} className="text-gray-300 shrink-0" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-4"
          >
            {p.bio && (
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1">Bio</p>
                <p className="text-[13px] text-gray-600 leading-relaxed">{p.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <ProfileField label="Profile ID" value={p.id} />
              <ProfileField label="Experience" value={`${p.experienceYears} yrs`} />
              <ProfileField label="Consultation Fee" value={`₹${p.consultationFee}`} />
              <ProfileField label="Rating" value={p.rating > 0 ? p.rating : '—'} />
              <ProfileField label="Sessions" value={p.totalSessions} />
              <ProfileField label="Clients" value={p.totalClients} />
              <ProfileField label="Max / Day" value={p.maxSessionsPerDay} />
              <ProfileField label="Max / Week" value={p.maxSessionsPerWeek} />
              <ProfileField label="Booking Buffer" value={`${p.bookingBufferDays} day${p.bookingBufferDays !== 1 ? 's' : ''}`} />
              {p.verifiedAt && <ProfileField label="Verified At" value={formatDate(p.verifiedAt)} />}
              {p.videoIntroUrl && <ProfileField label="Video Intro" value={<span className="font-mono text-[11px] truncate block">{p.videoIntroUrl}</span>} />}
            </div>

            {p.qualifications.length > 0 && (
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-2">Qualifications</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.qualifications.map(q => (
                    <span key={q} className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-50 border border-brand-border text-slate">{q}</span>
                  ))}
                </div>
              </div>
            )}

            {p.specializations.length > 0 && (
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-2">Specializations</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.specializations.map(s => (
                    <span key={s} className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#f0f4ee] text-forest">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {p.languages.length > 0 && (
              <ProfileField label="Languages" value={<span className="uppercase">{p.languages.join(', ')}</span>} />
            )}

            {p.rejectionReason && (
              <div className="bg-[#fdf3ec] rounded-xl border border-terracotta/20 p-3 text-[12px]">
                <p className="font-bold text-terracotta flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Rejection Reason
                </p>
                <p className="text-gray-600 mt-1">{p.rejectionReason}</p>
              </div>
            )}

            {Object.keys(p.metadata).length > 0 && <MetadataBlock metadata={p.metadata} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetadataBlock({ metadata }: { metadata: Record<string, string | number | boolean> }) {
  return (
    <div>
      <p className="small-caps text-[8px] text-gray-400 mb-2">Metadata</p>
      <div className="bg-brand-50 rounded-xl border border-brand-border p-3 space-y-1.5">
        {Object.entries(metadata).map(([key, val]) => (
          <div key={key} className="flex justify-between gap-4 text-[12px]">
            <span className="text-gray-400 font-mono">{key}</span>
            <span className="text-slate font-medium text-right">{String(val)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
