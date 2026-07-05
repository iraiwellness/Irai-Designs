import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, X, Star, Users, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { ADMIN_THERAPISTS, AdminTherapist, TherapistStatus } from '../../adminData';
import { cn } from '../../lib/utils';

// ── Lookup tables ──────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<TherapistStatus, string> = {
  active:   'text-forest border-forest/20 bg-[#f0f4ee]',
  pending:  'text-amber-600 border-amber-200 bg-amber-50',
  inactive: 'text-gray-400 border-gray-200 bg-gray-50',
};

const FILTER_TABS: { id: TherapistStatus | 'all'; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'active',   label: 'Active' },
  { id: 'pending',  label: 'Pending' },
  { id: 'inactive', label: 'Inactive' },
];

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminTherapists() {
  const [filter, setFilter]       = useState<TherapistStatus | 'all'>('all');
  const [search, setSearch]       = useState('');
  const [therapists, setTherapists] = useState(ADMIN_THERAPISTS);

  const filtered = therapists
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t =>
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.specialty.toLowerCase().includes(search.toLowerCase())
    );

  const pendingCount  = therapists.filter(t => t.status === 'pending').length;
  const activeCount   = therapists.filter(t => t.status === 'active').length;
  const inactiveCount = therapists.filter(t => t.status === 'inactive').length;

  const approve = (id: string) =>
    setTherapists(prev => prev.map(t => t.id === id ? { ...t, status: 'active' as TherapistStatus } : t));
  const decline = (id: string) =>
    setTherapists(prev => prev.map(t => t.id === id ? { ...t, status: 'inactive' as TherapistStatus } : t));

  return (
    <div className="min-h-full bg-brand-50 pb-24">

      {/* ── Header ── */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-brand-border">
        <p className="small-caps text-gray-400 mb-1">Admin</p>
        <h2 className="serif text-3xl leading-none">Therapist Team</h2>
        <p className="small-caps text-[7px] text-gray-400 mt-2">
          {activeCount} active · {pendingCount} pending approval
        </p>
      </div>

      <div className="p-6 space-y-5">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Active',   value: activeCount,   color: 'text-forest'    },
            { label: 'Pending',  value: pendingCount,  color: 'text-amber-600' },
            { label: 'Inactive', value: inactiveCount, color: 'text-gray-400'  },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-brand-border shadow-sm p-3 text-center">
              <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
              <p className="small-caps text-[7px] text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Pending alert ── */}
        {pendingCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <Clock size={15} className="text-amber-600 shrink-0" />
            <p className="text-[11px] font-medium text-amber-700">
              {pendingCount} therapist{pendingCount > 1 ? 's' : ''} awaiting your approval
            </p>
          </div>
        )}

        {/* ── Search ── */}
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or specialty..."
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
          {FILTER_TABS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 border transition-all',
                filter === f.id
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

        {/* ── Cards ── */}
        <div className="space-y-3">
          {filtered.map((therapist, i) => (
            <TherapistCard
              key={therapist.id}
              therapist={therapist}
              index={i}
              onApprove={approve}
              onDecline={decline}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Users size={28} className="mx-auto mb-3 text-gray-200" />
              <p className="small-caps text-[9px] text-gray-300">No therapists found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Therapist Card ────────────────────────────────────────────────────────────

function TherapistCard({
  therapist, index, onApprove, onDecline,
}: {
  therapist: AdminTherapist;
  index: number;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const isPending = therapist.status === 'pending';
  const initials  = therapist.name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-3"
    >
      {/* Name row */}
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0',
          isPending ? 'bg-amber-50 text-amber-600' : 'bg-[#f5f7f2] text-forest',
        )}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-slate truncate">{therapist.name}</p>
          <p className="small-caps text-[7px] text-gray-400 truncate">{therapist.specialty}</p>
        </div>
        <span className={cn('small-caps text-[7px] px-2.5 py-1 rounded-full border shrink-0', STATUS_STYLE[therapist.status])}>
          {therapist.status}
        </span>
      </div>

      {/* Stats (active/inactive only) */}
      {!isPending && (
        <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-brand-border">
          {[
            { icon: Star,         value: therapist.rating.toFixed(1),      label: 'Rating',   color: 'text-amber-500' },
            { icon: Users,        value: String(therapist.activeClients),   label: 'Clients',  color: 'text-forest'    },
            { icon: CheckCircle2, value: String(therapist.totalSessions),   label: 'Sessions', color: 'text-[#4B7399]' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <p className={cn('text-sm font-bold', s.color)}>{s.value}</p>
              <p className="small-caps text-[7px] text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Workload bar */}
      {!isPending && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="small-caps text-[7px] text-gray-400">Workload</span>
            <span className={cn(
              'text-[9px] font-bold',
              therapist.loadPercent >= 85 ? 'text-terracotta' :
              therapist.loadPercent >= 60 ? 'text-amber-500' :
              'text-forest',
            )}>
              {therapist.loadPercent}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-brand-50 rounded-full overflow-hidden border border-brand-border">
            <div
              className={cn(
                'h-full rounded-full',
                therapist.loadPercent >= 85 ? 'bg-terracotta' :
                therapist.loadPercent >= 60 ? 'bg-amber-400' :
                'bg-forest',
              )}
              style={{ width: `${therapist.loadPercent}%` }}
            />
          </div>
          <p className="small-caps text-[7px] text-gray-300 mt-1.5">
            Joined {new Date(therapist.joinedDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      )}

      {/* Approval actions */}
      {isPending && (
        <div className="flex gap-2 pt-1 border-t border-brand-border">
          <button
            onClick={() => onApprove(therapist.id)}
            className="flex-1 py-2.5 rounded-xl bg-forest text-white text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all"
          >
            <CheckCircle2 size={13} /> Approve
          </button>
          <button
            onClick={() => onDecline(therapist.id)}
            className="flex-1 py-2.5 rounded-xl bg-brand-50 text-gray-500 text-[11px] font-bold border border-brand-border flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all"
          >
            <XCircle size={13} /> Decline
          </button>
        </div>
      )}
    </motion.div>
  );
}
