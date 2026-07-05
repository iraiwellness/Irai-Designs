import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle, CheckCircle2, CreditCard, UserX, ThumbsDown, X, ShieldAlert,
} from 'lucide-react';
import { ADMIN_DISPUTES, AdminDispute, DisputeStatus, DisputeType, Priority } from '../../adminData';
import { cn } from '../../lib/utils';

// ── Lookup tables ──────────────────────────────────────────────────────────────

const ISSUE_ICON: Record<DisputeType, React.FC<{ size?: number; className?: string }>> = {
  cancellation: X,
  'no-show':    UserX,
  quality:      ThumbsDown,
  billing:      CreditCard,
};

const ISSUE_LABEL: Record<DisputeType, string> = {
  cancellation: 'Late Cancellation',
  'no-show':    'Therapist No-Show',
  quality:      'Session Quality',
  billing:      'Billing Issue',
};

const PRIORITY_STYLE: Record<Priority, string> = {
  high:   'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
  medium: 'text-amber-600 border-amber-200 bg-amber-50',
  low:    'text-gray-400 border-gray-200 bg-gray-50',
};

const STATUS_STYLE: Record<DisputeStatus, string> = {
  open:      'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
  escalated: 'text-amber-600 border-amber-200 bg-amber-50',
  resolved:  'text-forest border-forest/20 bg-[#f0f4ee]',
};

const FILTERS: { id: DisputeStatus | 'all'; label: string }[] = [
  { id: 'all',       label: 'All' },
  { id: 'open',      label: 'Open' },
  { id: 'escalated', label: 'Escalated' },
  { id: 'resolved',  label: 'Resolved' },
];

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminDisputes() {
  const [filter, setFilter]     = useState<DisputeStatus | 'all'>('all');
  const [disputes, setDisputes] = useState<AdminDispute[]>(ADMIN_DISPUTES);

  const filtered   = filter === 'all' ? disputes : disputes.filter(d => d.status === filter);
  const openCount  = disputes.filter(d => d.status === 'open').length;
  const escalated  = disputes.filter(d => d.status === 'escalated').length;
  const resolved   = disputes.filter(d => d.status === 'resolved').length;

  const resolve  = (id: string) =>
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'resolved' as DisputeStatus } : d));
  const escalate = (id: string) =>
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'escalated' as DisputeStatus } : d));

  return (
    <div className="min-h-full bg-brand-50 pb-24">

      {/* ── Header ── */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-brand-border">
        <p className="small-caps text-gray-400 mb-1">Admin</p>
        <h2 className="serif text-3xl leading-none">Disputes</h2>
        <p className="small-caps text-[7px] text-gray-400 mt-2">
          {openCount} open · {escalated} escalated · {resolved} resolved
        </p>
      </div>

      <div className="p-6 space-y-5">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Open',      value: openCount, color: 'text-terracotta' },
            { label: 'Escalated', value: escalated, color: 'text-amber-600'  },
            { label: 'Resolved',  value: resolved,  color: 'text-forest'     },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-brand-border shadow-sm p-3 text-center">
              <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
              <p className="small-caps text-[7px] text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-1">
          {FILTERS.map(f => (
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
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <ShieldAlert size={28} className="mx-auto mb-3 text-gray-200" />
                <p className="small-caps text-[9px] text-gray-300">No disputes here</p>
              </div>
            ) : (
              filtered.map((dispute, i) => (
                <DisputeCard
                  key={dispute.id}
                  dispute={dispute}
                  index={i}
                  onResolve={resolve}
                  onEscalate={escalate}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Dispute Card ──────────────────────────────────────────────────────────────

function DisputeCard({
  dispute, index, onResolve, onEscalate,
}: {
  dispute: AdminDispute;
  index: number;
  onResolve: (id: string) => void;
  onEscalate: (id: string) => void;
}) {
  const Icon       = ISSUE_ICON[dispute.issueType] ?? AlertTriangle;
  const isResolved = dispute.status === 'resolved';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.06 }}
      className={cn(
        'bg-white rounded-2xl border shadow-sm p-4 space-y-3',
        isResolved ? 'opacity-60 border-brand-border' : 'border-brand-border',
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#fdf3ec] flex items-center justify-center shrink-0">
            <Icon size={15} className="text-terracotta" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate">{ISSUE_LABEL[dispute.issueType]}</p>
            <p className="small-caps text-[7px] text-gray-400 truncate">
              {dispute.userName} → {dispute.therapistName}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={cn('small-caps text-[7px] px-2 py-0.5 rounded-full border', STATUS_STYLE[dispute.status])}>
            {dispute.status}
          </span>
          <span className={cn('small-caps text-[7px] px-2 py-0.5 rounded-full border', PRIORITY_STYLE[dispute.priority])}>
            {dispute.priority}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-[11px] text-gray-500 leading-relaxed border-t border-brand-border pt-2.5 italic">
        "{dispute.description}"
      </p>

      {/* Date + actions */}
      <div className="flex items-center justify-between">
        <p className="small-caps text-[7px] text-gray-400">
          {new Date(dispute.date + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>

        {isResolved ? (
          <div className="flex items-center gap-1 text-forest">
            <CheckCircle2 size={12} />
            <span className="text-[9px] font-bold">Resolved</span>
          </div>
        ) : (
          <div className="flex gap-2">
            {dispute.status !== 'escalated' && (
              <button
                onClick={() => onEscalate(dispute.id)}
                className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-[9px] font-bold text-amber-600 uppercase tracking-widest active:scale-95 transition-all"
              >
                Escalate
              </button>
            )}
            <button
              onClick={() => onResolve(dispute.id)}
              className="px-3 py-1.5 rounded-xl bg-[#f0f4ee] border border-forest/20 text-[9px] font-bold text-forest uppercase tracking-widest flex items-center gap-1 active:scale-95 transition-all"
            >
              <CheckCircle2 size={11} /> Resolve
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
