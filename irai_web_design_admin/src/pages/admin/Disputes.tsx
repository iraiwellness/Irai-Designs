import { useState } from 'react';
import {
  AlertTriangle, CheckCircle2, CreditCard, UserX, ThumbsDown, X, ShieldAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ADMIN_DISPUTES, type AdminDispute, type DisputeStatus, type DisputeType, type Priority } from '../../adminData';
import { cn } from '../../lib/utils';

const ISSUE_ICON: Record<DisputeType, LucideIcon> = {
  cancellation: X, 'no-show': UserX, quality: ThumbsDown, billing: CreditCard,
};

const ISSUE_LABEL: Record<DisputeType, string> = {
  cancellation: 'Late Cancellation', 'no-show': 'Therapist No-Show',
  quality: 'Session Quality', billing: 'Billing Issue',
};

const PRIORITY_STYLE: Record<Priority, string> = {
  high: 'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
  medium: 'text-amber-600 border-amber-200 bg-amber-50',
  low: 'text-gray-400 border-gray-200 bg-gray-50',
};

const STATUS_STYLE: Record<DisputeStatus, string> = {
  open: 'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
  escalated: 'text-amber-600 border-amber-200 bg-amber-50',
  resolved: 'text-forest border-forest/20 bg-[#f0f4ee]',
};

const FILTERS: { id: DisputeStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'open', label: 'Open' },
  { id: 'escalated', label: 'Escalated' }, { id: 'resolved', label: 'Resolved' },
];

export default function AdminDisputes() {
  const [filter, setFilter] = useState<DisputeStatus | 'all'>('all');
  const [disputes, setDisputes] = useState(ADMIN_DISPUTES);

  const filtered = filter === 'all' ? disputes : disputes.filter(d => d.status === filter);
  const openCount = disputes.filter(d => d.status === 'open').length;

  const resolve = (id: string) => setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'resolved' as DisputeStatus } : d));
  const escalate = (id: string) => setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'escalated' as DisputeStatus } : d));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <p className="small-caps text-gray-400 mb-1">Admin</p>
        <h1 className="serif text-4xl text-slate">Disputes</h1>
        <p className="text-[13px] text-gray-400 mt-1">{openCount} open · {disputes.filter(d => d.status === 'resolved').length} resolved</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Open', value: disputes.filter(d => d.status === 'open').length, color: 'text-terracotta' },
          { label: 'Escalated', value: disputes.filter(d => d.status === 'escalated').length, color: 'text-amber-600' },
          { label: 'Resolved', value: disputes.filter(d => d.status === 'resolved').length, color: 'text-forest' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-brand-border p-4 text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="small-caps text-[8px] text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5">
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={cn('px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all',
              filter === f.id ? 'bg-slate text-white border-slate' : 'bg-white text-gray-400 border-brand-border')}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border text-center py-16">
            <ShieldAlert size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-400">No disputes here</p>
          </div>
        ) : (
          filtered.map(d => (
            <DisputeCard key={d.id} dispute={d} onResolve={resolve} onEscalate={escalate} />
          ))
        )}
      </div>
    </div>
  );
}

function DisputeCard({ dispute, onResolve, onEscalate }: {
  dispute: AdminDispute;
  onResolve: (id: string) => void;
  onEscalate: (id: string) => void;
}) {
  const Icon = ISSUE_ICON[dispute.issueType] ?? AlertTriangle;
  const isResolved = dispute.status === 'resolved';

  return (
    <div className={cn('bg-white rounded-2xl border border-brand-border shadow-sm p-5', isResolved && 'opacity-60')}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fdf3ec] flex items-center justify-center shrink-0">
            <Icon size={18} className="text-terracotta" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-slate">{ISSUE_LABEL[dispute.issueType]}</p>
            <p className="text-[12px] text-gray-400">{dispute.userName} → {dispute.therapistName}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', STATUS_STYLE[dispute.status])}>{dispute.status}</span>
          <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', PRIORITY_STYLE[dispute.priority])}>{dispute.priority}</span>
        </div>
      </div>
      <p className="text-[13px] text-gray-500 leading-relaxed border-t border-brand-border pt-3 italic mb-4">"{dispute.description}"</p>
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-gray-400">
          {new Date(dispute.date + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        {isResolved ? (
          <div className="flex items-center gap-1.5 text-forest"><CheckCircle2 size={14} /><span className="text-[12px] font-bold">Resolved</span></div>
        ) : (
          <div className="flex gap-2">
            {dispute.status !== 'escalated' && (
              <button onClick={() => onEscalate(dispute.id)} className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[12px] font-bold text-amber-600 hover:bg-amber-100 transition-colors">
                Escalate
              </button>
            )}
            <button onClick={() => onResolve(dispute.id)} className="px-4 py-2 rounded-xl bg-[#f0f4ee] border border-forest/20 text-[12px] font-bold text-forest flex items-center gap-1.5 hover:bg-[#e4ebe0] transition-colors">
              <CheckCircle2 size={14} /> Resolve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
