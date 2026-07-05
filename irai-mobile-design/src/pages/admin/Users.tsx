import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, X, CheckCircle2, Clock, Users } from 'lucide-react';
import { ADMIN_USERS, AdminUser, PlanId } from '../../adminData';
import { cn } from '../../lib/utils';

// ── Lookup tables ──────────────────────────────────────────────────────────────

const PLAN_STYLE: Record<PlanId, { badge: string; label: string; color: string }> = {
  foundation: { badge: 'text-forest border-forest/20 bg-[#f0f4ee]',          label: 'Foundation', color: '#4a6741' },
  balanced:   { badge: 'text-[#4B7399] border-[#4B7399]/20 bg-[#eef3f9]',    label: 'Balanced',   color: '#4B7399' },
  transform:  { badge: 'text-slate border-brand-border bg-[#f5f7f2]',         label: 'Transform',  color: '#2d3436' },
};

const PLAN_TABS: { id: PlanId | 'all'; label: string }[] = [
  { id: 'all',        label: 'All' },
  { id: 'foundation', label: 'Foundation' },
  { id: 'balanced',   label: 'Balanced' },
  { id: 'transform',  label: 'Transform' },
];

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminUsers() {
  const [search, setSearch]         = useState('');
  const [planFilter, setPlanFilter] = useState<PlanId | 'all'>('all');

  const filtered = useMemo(() =>
    ADMIN_USERS
      .filter(u => planFilter === 'all' || u.planId === planFilter)
      .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())),
    [search, planFilter]
  );

  const byPlan: Record<PlanId, number> = {
    foundation: ADMIN_USERS.filter(u => u.planId === 'foundation').length,
    balanced:   ADMIN_USERS.filter(u => u.planId === 'balanced').length,
    transform:  ADMIN_USERS.filter(u => u.planId === 'transform').length,
  };

  const onboarded    = ADMIN_USERS.filter(u => u.onboarded).length;
  const notOnboarded = ADMIN_USERS.length - onboarded;

  return (
    <div className="min-h-full bg-brand-50 pb-24">

      {/* ── Header ── */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-brand-border">
        <p className="small-caps text-gray-400 mb-1">Admin</p>
        <h2 className="serif text-3xl leading-none">Users</h2>
        <p className="small-caps text-[7px] text-gray-400 mt-2">
          {ADMIN_USERS.length} registered · {onboarded} onboarded
        </p>
      </div>

      <div className="p-6 space-y-5">

        {/* ── Plan breakdown ── */}
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(byPlan) as [PlanId, number][]).map(([plan, count]) => (
            <button
              key={plan}
              onClick={() => setPlanFilter(planFilter === plan ? 'all' : plan)}
              className={cn(
                'rounded-2xl border p-3 text-center shadow-sm transition-all active:scale-[0.97]',
                planFilter === plan
                  ? 'bg-slate text-white border-slate'
                  : 'bg-white border-brand-border',
              )}
            >
              <p
                className={cn('text-xl font-bold', planFilter === plan ? 'text-white' : '')}
                style={planFilter !== plan ? { color: PLAN_STYLE[plan].color } : {}}
              >
                {count}
              </p>
              <p className={cn('small-caps text-[7px] mt-0.5', planFilter === plan ? 'text-white/60' : 'text-gray-400')}>
                {PLAN_STYLE[plan].label}
              </p>
            </button>
          ))}
        </div>

        {/* ── Onboarding banner ── */}
        {notOnboarded > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <Clock size={15} className="text-amber-600 shrink-0" />
            <p className="text-[11px] font-medium text-amber-700">
              {notOnboarded} user{notOnboarded > 1 ? 's' : ''} yet to complete onboarding
            </p>
          </div>
        )}

        {/* ── Search ── */}
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-white border border-brand-border rounded-xl py-3 pl-10 pr-9 text-[12px] text-slate placeholder:text-gray-300 outline-none focus:border-forest/30 transition-colors shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <X size={13} className="text-gray-300" />
            </button>
          )}
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-1">
          {PLAN_TABS.map(f => (
            <button
              key={f.id}
              onClick={() => setPlanFilter(f.id)}
              className={cn(
                'px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 border transition-all',
                planFilter === f.id
                  ? 'bg-slate text-white border-slate'
                  : 'bg-white text-gray-400 border-brand-border',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="small-caps text-gray-400 text-[8px] px-1">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* ── List ── */}
        <div className="space-y-2.5">
          {filtered.map((user, i) => (
            <UserRow key={user.id} user={user} index={i} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Users size={28} className="mx-auto mb-3 text-gray-200" />
              <p className="small-caps text-[9px] text-gray-300">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── User Row ──────────────────────────────────────────────────────────────────

function UserRow({ user, index }: { user: AdminUser; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white rounded-2xl border border-brand-border shadow-sm p-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#f5f7f2] border border-brand-border flex items-center justify-center font-bold text-sm text-forest shrink-0">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[12px] font-bold text-slate truncate">{user.name}</p>
            {user.onboarded
              ? <CheckCircle2 size={11} className="text-forest shrink-0" />
              : <Clock size={11}        className="text-amber-500 shrink-0" />
            }
          </div>
          <p className="small-caps text-[7px] text-gray-400 truncate">{user.email}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={cn('small-caps text-[7px] px-2 py-0.5 rounded-full border', PLAN_STYLE[user.planId].badge)}>
            {PLAN_STYLE[user.planId].label}
          </span>
          <p className="text-[9px] text-gray-400">{user.totalSessions} sessions</p>
        </div>
      </div>
    </motion.div>
  );
}
