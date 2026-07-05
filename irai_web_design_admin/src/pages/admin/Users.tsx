import { useState, useMemo } from 'react';
import { Search, X, CheckCircle2, Clock } from 'lucide-react';
import { ADMIN_USERS, type AdminUser, type PlanId } from '../../adminData';
import { cn } from '../../lib/utils';

const PLAN_STYLE: Record<PlanId, { color: string; label: string }> = {
  foundation: { color: '#4a6741', label: 'Foundation' },
  balanced:   { color: '#4B7399', label: 'Balanced' },
  transform:  { color: '#2d3436', label: 'Transform' },
};

const PLAN_TABS: { id: PlanId | 'all'; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'foundation', label: 'Foundation' },
  { id: 'balanced', label: 'Balanced' }, { id: 'transform', label: 'Transform' },
];

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<PlanId | 'all'>('all');

  const filtered = useMemo(() =>
    ADMIN_USERS
      .filter(u => planFilter === 'all' || u.planId === planFilter)
      .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())),
    [search, planFilter],
  );

  const byPlan = {
    foundation: ADMIN_USERS.filter(u => u.planId === 'foundation').length,
    balanced: ADMIN_USERS.filter(u => u.planId === 'balanced').length,
    transform: ADMIN_USERS.filter(u => u.planId === 'transform').length,
  };
  const notOnboarded = ADMIN_USERS.filter(u => !u.onboarded).length;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <p className="small-caps text-gray-400 mb-1">Admin</p>
        <h1 className="serif text-4xl text-slate">Users</h1>
        <p className="text-[13px] text-gray-400 mt-1">{ADMIN_USERS.length} registered members</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {(Object.entries(byPlan) as [PlanId, number][]).map(([plan, count]) => (
          <button key={plan} onClick={() => setPlanFilter(planFilter === plan ? 'all' : plan)}
            className={cn('rounded-2xl border p-4 text-left transition-all',
              planFilter === plan ? 'bg-slate text-white border-slate' : 'bg-white border-brand-border hover:border-forest/20')}>
            <p className="text-2xl font-bold" style={planFilter !== plan ? { color: PLAN_STYLE[plan].color } : {}}>{count}</p>
            <p className={cn('text-[11px] uppercase tracking-wider mt-1', planFilter === plan ? 'text-white/60' : 'text-gray-400')}>{PLAN_STYLE[plan].label}</p>
          </button>
        ))}
      </div>

      {notOnboarded > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 mb-5">
          <Clock size={16} className="text-amber-600" />
          <p className="text-[13px] font-medium text-amber-700">{notOnboarded} user{notOnboarded > 1 ? 's' : ''} yet to complete onboarding</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full bg-white border border-brand-border rounded-xl py-2.5 pl-10 pr-9 text-[13px] outline-none focus:border-forest/30" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} className="text-gray-300" /></button>}
        </div>
        <div className="flex gap-2">
          {PLAN_TABS.map(f => (
            <button key={f.id} onClick={() => setPlanFilter(f.id)}
              className={cn('px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all',
                planFilter === f.id ? 'bg-slate text-white border-slate' : 'bg-white text-gray-400 border-brand-border')}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-border bg-brand-50/50">
              {['Name', 'Email', 'Plan', 'Sessions', 'Joined', 'Onboarded', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-brand-border last:border-0 hover:bg-brand-50/30">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f5f7f2] border border-brand-border flex items-center justify-center text-forest font-bold text-[10px]">
                      {u.name.charAt(0)}
                    </div>
                    <span className="text-[13px] font-semibold text-slate">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-[13px] text-gray-500">{u.email}</td>
                <td className="px-5 py-4">
                  <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full border border-brand-border" style={{ color: PLAN_STYLE[u.planId].color }}>
                    {PLAN_STYLE[u.planId].label}
                  </span>
                </td>
                <td className="px-5 py-4 text-[13px] text-gray-500">{u.totalSessions}</td>
                <td className="px-5 py-4 text-[13px] text-gray-500">
                  {new Date(u.joinedDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-5 py-4">
                  {u.onboarded
                    ? <CheckCircle2 size={16} className="text-forest" />
                    : <Clock size={16} className="text-amber-500" />}
                </td>
                <td className="px-5 py-4">
                  <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border',
                    u.status === 'active' ? 'text-forest border-forest/20 bg-[#f0f4ee]' : 'text-gray-400 border-gray-200 bg-gray-50')}>
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
