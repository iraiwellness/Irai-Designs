import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Mail, Calendar, Star, ChevronDown, Check } from 'lucide-react';
import {
  ADMIN_USERS, userFullName,
  type AdminUser, type UserRole, type PatientProfile, type PractitionerProfile, type TherapistStatus,
} from '../../adminData';
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

const ROLE_FILTERS: { id: UserRole | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'patient', label: 'Patients' },
  { id: 'practitioner', label: 'Practitioners' },
  { id: 'admin', label: 'Admins' },
];

const ACCOUNT_FILTERS: { id: 'all' | 'active' | 'inactive' | 'deleted'; label: string }[] = [
  { id: 'all', label: 'All Accounts' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
  { id: 'deleted', label: 'Deleted' },
];

function accountState(u: AdminUser): 'active' | 'inactive' | 'deleted' {
  if (u.isDeleted) return 'deleted';
  if (!u.isActive) return 'inactive';
  return 'active';
}

function formatDate(iso: string) {
  return new Date(iso + (iso.includes('T') ? '' : 'T12:00')).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ProfileField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-gray-400 text-[11px]">{label}</p>
      <p className="font-medium text-slate text-[13px]">{value ?? '—'}</p>
    </div>
  );
}

function FilterDropdown<T extends string>({
  label, value, options, onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.id === value);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-2 h-[42px] px-4 rounded-xl border text-left transition-all',
          open
            ? 'bg-brand-50 border-forest/30 shadow-sm'
            : 'bg-white border-brand-border hover:border-forest/20',
        )}
      >
        <span className="small-caps text-[8px] text-gray-400 leading-none">{label}</span>
        <span className="w-px h-4 bg-brand-border shrink-0" />
        <span className="text-[13px] font-semibold text-slate whitespace-nowrap">{selected?.label}</span>
        <ChevronDown size={14} className={cn('text-gray-400 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-full w-max bg-white rounded-2xl border border-brand-border shadow-lg py-1.5 overflow-hidden">
          {options.map(o => {
            const active = o.id === value;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => { onChange(o.id); setOpen(false); }}
                className={cn(
                  'w-full flex items-center justify-between gap-6 px-4 py-2.5 text-[13px] transition-colors text-left',
                  active ? 'bg-brand-50 text-slate font-semibold' : 'text-gray-500 hover:bg-brand-50/60 hover:text-slate',
                )}
              >
                {o.label}
                {active && <Check size={14} className="text-forest shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminUsers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('selected');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [accountFilter, setAccountFilter] = useState<'all' | 'active' | 'inactive' | 'deleted'>('all');

  const selected = ADMIN_USERS.find(u => u.id === selectedId) ?? null;

  const filtered = useMemo(() =>
    ADMIN_USERS
      .filter(u => roleFilter === 'all' || u.role === roleFilter)
      .filter(u => accountFilter === 'all' || accountState(u) === accountFilter)
      .filter(u => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        const name = userFullName(u).toLowerCase();
        return name.includes(q) || u.email.toLowerCase().includes(q);
      }),
    [search, roleFilter, accountFilter],
  );

  const counts = {
    patient: ADMIN_USERS.filter(u => u.role === 'patient').length,
    practitioner: ADMIN_USERS.filter(u => u.role === 'practitioner').length,
    admin: ADMIN_USERS.filter(u => u.role === 'admin').length,
    deleted: ADMIN_USERS.filter(u => u.isDeleted).length,
    inactive: ADMIN_USERS.filter(u => !u.isActive && !u.isDeleted).length,
  };

  const selectUser = (id: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (id) params.set('selected', id);
    else params.delete('selected');
    setSearchParams(params);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <p className="small-caps text-gray-400 mb-1">Admin · GET /admin/users/</p>
        <h1 className="serif text-4xl text-slate">Users</h1>
        <p className="text-[13px] text-gray-400 mt-1">{ADMIN_USERS.length} total · includes inactive and deleted</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        {([
          ['Patients', counts.patient, 'text-[#4B7399]'],
          ['Practitioners', counts.practitioner, 'text-forest'],
          ['Admins', counts.admin, 'text-terracotta'],
          ['Inactive', counts.inactive, 'text-amber-600'],
          ['Deleted', counts.deleted, 'text-gray-400'],
        ] as const).map(([label, count, color]) => (
          <div key={label} className="bg-white rounded-2xl border border-brand-border p-4 text-center">
            <p className={cn('text-2xl font-bold', color)}>{count}</p>
            <p className="small-caps text-[8px] text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-white rounded-2xl border border-brand-border shadow-sm p-2 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="w-full h-[42px] bg-brand-50/50 border border-transparent rounded-xl py-2.5 pl-10 pr-9 text-[13px] outline-none focus:bg-white focus:border-forest/20 transition-colors"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-gray-300 hover:text-gray-500" />
            </button>
          )}
        </div>
        <div className="hidden sm:block w-px h-6 bg-brand-border shrink-0" />
        <FilterDropdown label="Role" value={roleFilter} options={ROLE_FILTERS} onChange={setRoleFilter} />
        <FilterDropdown label="Account" value={accountFilter} options={ACCOUNT_FILTERS} onChange={setAccountFilter} />
      </div>

      <div className="flex gap-6">
        <div className={cn('bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden transition-all', selected ? 'flex-1 min-w-0' : 'w-full')}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border bg-brand-50/50">
                {['Name', 'Email', 'Role', 'Profiles', 'Joined', 'Staff', 'Account'].map(h => (
                  <th key={h} className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const state = accountState(u);
                return (
                  <tr
                    key={u.id}
                    onClick={() => selectUser(u.id)}
                    className={cn(
                      'border-b border-brand-border last:border-0 hover:bg-brand-50/30 cursor-pointer',
                      u.isDeleted && 'opacity-50',
                      selectedId === u.id && 'bg-brand-50/50',
                    )}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f5f7f2] border border-brand-border flex items-center justify-center text-forest font-bold text-[10px]">
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                        <span className="text-[13px] font-semibold text-slate">{userFullName(u)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-500">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', ROLE_STYLE[u.role])}>{u.role}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        {u.hasPatientProfile && <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#eef3f9] text-[#4B7399]">Patient</span>}
                        {u.hasPractitionerProfile && <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#f0f4ee] text-forest">Practitioner</span>}
                        {!u.hasPatientProfile && !u.hasPractitionerProfile && <span className="text-[12px] text-gray-300">—</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-500">{formatDate(u.dateJoined)}</td>
                    <td className="px-5 py-4">
                      {u.isStaff
                        ? <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border text-terracotta border-terracotta/20 bg-[#fdf3ec]">Staff</span>
                        : <span className="text-[12px] text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border',
                        state === 'active' ? 'text-forest border-forest/20 bg-[#f0f4ee]' :
                        state === 'inactive' ? 'text-amber-600 border-amber-200 bg-amber-50' :
                        'text-gray-400 border-gray-200 bg-gray-50')}>
                        {state}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="w-[28rem] shrink-0 bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-12rem)]">
            <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
              <p className="small-caps text-gray-400">GET /admin/users/ · profiles</p>
              <button onClick={() => selectUser(null)} className="text-gray-400 hover:text-slate"><X size={16} /></button>
            </div>
            <UserDetail user={selected} />
          </div>
        )}
      </div>
    </div>
  );
}

function UserDetail({ user: u }: { user: AdminUser }) {
  const state = accountState(u);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      <div>
        <h2 className="serif text-2xl text-slate">{userFullName(u)}</h2>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', ROLE_STYLE[u.role])}>{u.role}</span>
          <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border',
            state === 'active' ? 'text-forest border-forest/20 bg-[#f0f4ee]' :
            state === 'inactive' ? 'text-amber-600 border-amber-200 bg-amber-50' :
            'text-gray-400 border-gray-200 bg-gray-50')}>{state}</span>
          {u.isStaff && <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border text-terracotta border-terracotta/20 bg-[#fdf3ec]">Staff</span>}
        </div>
      </div>

      <div className="space-y-2 text-[13px]">
        <div className="flex items-center gap-2 text-gray-500"><Mail size={14} /> {u.email}</div>
        <div className="flex items-center gap-2 text-gray-500"><Calendar size={14} /> Joined {formatDate(u.dateJoined)}</div>
      </div>

      {u.patientProfile && (
        <section className="border-t border-brand-border pt-4">
          <p className="small-caps text-[8px] text-[#4B7399] mb-3">patient_profile</p>
          <PatientProfileDetail profile={u.patientProfile} />
        </section>
      )}

      {u.practitionerProfile && (
        <section className="border-t border-brand-border pt-4">
          <p className="small-caps text-[8px] text-forest mb-3">practitioner_profile</p>
          <PractitionerProfileDetail profile={u.practitionerProfile} />
        </section>
      )}

      {!u.patientProfile && !u.practitionerProfile && (
        <div className="border-t border-brand-border pt-4 text-center py-6">
          <p className="text-[13px] text-gray-400">No nested profiles on this account</p>
        </div>
      )}
    </div>
  );
}

function PatientProfileDetail({ profile: p }: { profile: PatientProfile }) {
  return (
    <div className="space-y-4">
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
      {Object.keys(p.metadata).length > 0 && (
        <MetadataBlock metadata={p.metadata} />
      )}
    </div>
  );
}

function PractitionerProfileDetail({ profile: p }: { profile: PractitionerProfile }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[14px] font-semibold text-slate">{p.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', PRACTITIONER_STATUS_STYLE[p.status])}>{p.status}</span>
          {p.isOnline && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-forest/10 text-forest">Online</span>}
          {p.rating > 0 && (
            <span className="flex items-center gap-1 text-[12px] font-semibold text-slate">
              <Star size={12} className="text-amber-500 fill-amber-500" /> {p.rating}
            </span>
          )}
        </div>
      </div>

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
        <ProfileField label="Sessions" value={p.totalSessions} />
        <ProfileField label="Clients" value={p.totalClients} />
        <ProfileField label="Max / Day" value={p.maxSessionsPerDay} />
        <ProfileField label="Max / Week" value={p.maxSessionsPerWeek} />
        <ProfileField label="Booking Buffer" value={`${p.bookingBufferDays} day${p.bookingBufferDays !== 1 ? 's' : ''}`} />
        {p.verifiedAt && <ProfileField label="Verified At" value={formatDate(p.verifiedAt)} />}
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
          <p className="font-bold text-terracotta">Rejection Reason</p>
          <p className="text-gray-600 mt-1">{p.rejectionReason}</p>
        </div>
      )}

      {Object.keys(p.metadata).length > 0 && (
        <MetadataBlock metadata={p.metadata} />
      )}
    </div>
  );
}

function MetadataBlock({ metadata }: { metadata: Record<string, string | number | boolean> }) {
  return (
    <div>
      <p className="small-caps text-[8px] text-gray-400 mb-2">metadata</p>
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
