import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronDown, Check } from 'lucide-react';
import {
  ADMIN_USERS, userFullName,
  type AdminUser, type UserRole,
} from '../../adminData';
import { cn } from '../../lib/utils';

const ROLE_STYLE: Record<UserRole, string> = {
  patient: 'text-[#4B7399] border-[#4B7399]/20 bg-[#eef3f9]',
  practitioner: 'text-forest border-forest/20 bg-[#f0f4ee]',
  admin: 'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
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
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [accountFilter, setAccountFilter] = useState<'all' | 'active' | 'inactive' | 'deleted'>('all');

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

  return (
    <div className="p-6 lg:p-8">
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

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
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
                  onClick={() => navigate(`/admin/users/${u.id}`)}
                  className={cn(
                    'border-b border-brand-border last:border-0 hover:bg-brand-50/30 cursor-pointer',
                    u.isDeleted && 'opacity-50',
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
    </div>
  );
}
