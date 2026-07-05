import { useState } from 'react';
import { Search, X, Star, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { ADMIN_THERAPISTS, type AdminTherapist, type TherapistStatus } from '../../adminData';
import { cn } from '../../lib/utils';

const STATUS_STYLE: Record<TherapistStatus, string> = {
  active: 'text-forest border-forest/20 bg-[#f0f4ee]',
  pending: 'text-amber-600 border-amber-200 bg-amber-50',
  inactive: 'text-gray-400 border-gray-200 bg-gray-50',
};

const FILTERS: { id: TherapistStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' }, { id: 'inactive', label: 'Inactive' },
];

export default function AdminTherapists() {
  const [filter, setFilter] = useState<TherapistStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [therapists, setTherapists] = useState(ADMIN_THERAPISTS);

  const filtered = therapists
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.specialty.toLowerCase().includes(search.toLowerCase()));

  const pendingCount = therapists.filter(t => t.status === 'pending').length;

  const approve = (id: string) => setTherapists(prev => prev.map(t => t.id === id ? { ...t, status: 'active' as TherapistStatus } : t));
  const decline = (id: string) => setTherapists(prev => prev.map(t => t.id === id ? { ...t, status: 'inactive' as TherapistStatus } : t));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <p className="small-caps text-gray-400 mb-1">Admin</p>
        <h1 className="serif text-4xl text-slate">Therapist Team</h1>
        <p className="text-[13px] text-gray-400 mt-1">{therapists.filter(t => t.status === 'active').length} active · {pendingCount} pending</p>
      </div>

      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 mb-5">
          <Clock size={16} className="text-amber-600 shrink-0" />
          <p className="text-[13px] font-medium text-amber-700">{pendingCount} therapist{pendingCount > 1 ? 's' : ''} awaiting approval</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search therapists..."
            className="w-full bg-white border border-brand-border rounded-xl py-2.5 pl-10 pr-9 text-[13px] outline-none focus:border-forest/30" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} className="text-gray-300" /></button>}
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={cn('px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all',
                filter === f.id ? 'bg-slate text-white border-slate' : 'bg-white text-gray-400 border-brand-border')}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-border bg-brand-50/50">
              {['Therapist', 'Specialty', 'Rating', 'Sessions', 'Clients', 'Load', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-b border-brand-border last:border-0 hover:bg-brand-50/30">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#f5f7f2] border border-brand-border flex items-center justify-center text-forest font-bold text-[11px]">
                      {t.name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('')}
                    </div>
                    <span className="text-[13px] font-semibold text-slate">{t.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-[13px] text-gray-500">{t.specialty}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 text-[13px] font-semibold">
                    {t.rating > 0 ? <><Star size={12} className="text-amber-500 fill-amber-500" /> {t.rating}</> : '—'}
                  </div>
                </td>
                <td className="px-5 py-4 text-[13px] text-gray-500">{t.totalSessions}</td>
                <td className="px-5 py-4 text-[13px] text-gray-500">{t.activeClients}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-[12px] font-bold', t.loadPercent >= 85 ? 'text-terracotta' : t.loadPercent >= 60 ? 'text-amber-500' : 'text-forest')}>{t.loadPercent}%</span>
                    <div className="w-16 h-1.5 bg-brand-50 rounded-full border border-brand-border overflow-hidden">
                      <div className={cn('h-full rounded-full', t.loadPercent >= 85 ? 'bg-terracotta' : t.loadPercent >= 60 ? 'bg-amber-400' : 'bg-forest')} style={{ width: `${t.loadPercent}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', STATUS_STYLE[t.status])}>{t.status}</span>
                </td>
                <td className="px-5 py-4">
                  {t.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button onClick={() => approve(t.id)} className="flex items-center gap-1 text-[12px] font-bold text-forest hover:underline"><CheckCircle2 size={14} /> Approve</button>
                      <button onClick={() => decline(t.id)} className="flex items-center gap-1 text-[12px] font-bold text-gray-400 hover:underline"><XCircle size={14} /> Decline</button>
                    </div>
                  ) : <span className="text-[12px] text-gray-300">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
