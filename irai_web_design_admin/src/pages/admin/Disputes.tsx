import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle2, CreditCard, UserX, ThumbsDown, X, ShieldAlert,
  Calendar, Clock, User, ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import {
  ADMIN_DISPUTES, type AdminDispute, type DisputeStatus, type DisputeType,
  type DisputeResolution, type Priority,
} from '../../adminData';
import { cn } from '../../lib/utils';

const ISSUE_ICON: Record<DisputeType, LucideIcon> = {
  cancellation: X, 'no-show': UserX, quality: ThumbsDown, billing: CreditCard,
};

const ISSUE_LABEL: Record<DisputeType, string> = {
  cancellation: 'Late Cancellation', 'no-show': 'Therapist No-Show',
  quality: 'Session Quality', billing: 'Billing Issue',
};

const RESOLUTION_LABEL: Record<DisputeResolution, string> = {
  refund: 'Full Refund', partial_refund: 'Partial Refund',
  credit: 'Session Credit', dismissed: 'Dismissed',
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

const RESOLUTION_OPTIONS: DisputeResolution[] = ['refund', 'partial_refund', 'credit', 'dismissed'];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

function formatDate(iso: string) {
  return new Date(iso + (iso.includes('T') ? '' : 'T12:00')).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminDisputes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('selected');
  const [filter, setFilter] = useState<DisputeStatus | 'all'>('all');
  const [disputes, setDisputes] = useState(ADMIN_DISPUTES);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolution, setResolution] = useState<DisputeResolution>('refund');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState('');

  const filtered = filter === 'all' ? disputes : disputes.filter(d => d.status === filter);
  const openCount = disputes.filter(d => d.status === 'open').length;
  const resolvingDispute = disputes.find(d => d.id === resolvingId);
  const selected = disputes.find(d => d.id === selectedId) ?? null;

  const selectDispute = (id: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (id) params.set('selected', id);
    else params.delete('selected');
    setSearchParams(params);
  };

  const escalate = (id: string) =>
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'escalated' as DisputeStatus, updatedAt: new Date().toISOString() } : d));

  const submitResolution = () => {
    if (!resolvingId || !resolutionNotes.trim()) return;
    const amount = refundAmount ? parseFloat(refundAmount) : undefined;
    const now = new Date().toISOString();
    setDisputes(prev => prev.map(d =>
      d.id === resolvingId ? {
        ...d,
        status: 'resolved' as DisputeStatus,
        resolution,
        resolutionNotes: resolutionNotes.trim(),
        refundAmount: amount,
        resolvedAt: now,
        resolvedById: 'u12',
        resolvedByName: 'Platform Admin',
        updatedAt: now,
      } : d,
    ));
    setResolvingId(null);
    setResolution('refund');
    setResolutionNotes('');
    setRefundAmount('');
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <p className="small-caps text-gray-400 mb-1">Admin · GET/PATCH /admin/disputes/</p>
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

      <div className="flex gap-6">
        <div className={cn('space-y-4 transition-all', selected ? 'flex-1 min-w-0' : 'w-full')}>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-brand-border text-center py-16">
              <ShieldAlert size={32} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400">No disputes here</p>
            </div>
          ) : (
            filtered.map(d => (
              <DisputeCard
                key={d.id}
                dispute={d}
                isSelected={selectedId === d.id}
                onSelect={() => selectDispute(d.id)}
                onResolve={() => setResolvingId(d.id)}
                onEscalate={escalate}
              />
            ))
          )}
        </div>

        {selected && (
          <div className="w-[28rem] shrink-0 bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-12rem)] sticky top-8">
            <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
              <p className="small-caps text-gray-400">GET /admin/disputes/{selected.id}/</p>
              <button onClick={() => selectDispute(null)} className="text-gray-400 hover:text-slate"><X size={16} /></button>
            </div>
            <DisputeDetail
              dispute={selected}
              onResolve={() => setResolvingId(selected.id)}
              onEscalate={() => escalate(selected.id)}
            />
          </div>
        )}
      </div>

      <Modal
        open={!!resolvingId}
        onClose={() => { setResolvingId(null); setResolutionNotes(''); setRefundAmount(''); }}
        title="Resolve Dispute"
        maxWidth="max-w-md"
      >
        <p className="text-[13px] text-gray-500 mb-4">
          Resolving dispute for session <code className="text-[12px] bg-brand-50 px-1.5 py-0.5 rounded">{resolvingDispute?.sessionId}</code>
          {' '}— maps to <code className="text-[12px] bg-brand-50 px-1.5 py-0.5 rounded">PATCH /admin/disputes/&lt;id&gt;/</code>
        </p>
        <div className="space-y-4">
          <div>
            <p className="small-caps text-[8px] text-gray-400 mb-2">Resolution</p>
            <div className="grid grid-cols-2 gap-2">
              {RESOLUTION_OPTIONS.map(opt => (
                <button key={opt} type="button" onClick={() => setResolution(opt)}
                  className={cn('px-3 py-2 rounded-xl text-[12px] font-bold border transition-all',
                    resolution === opt ? 'bg-forest text-white border-forest' : 'bg-white text-gray-500 border-brand-border')}>
                  {RESOLUTION_LABEL[opt]}
                </button>
              ))}
            </div>
          </div>
          {(resolution === 'refund' || resolution === 'partial_refund') && (
            <div>
              <p className="small-caps text-[8px] text-gray-400 mb-1">Refund Amount (₹)</p>
              <input type="number" value={refundAmount} onChange={e => setRefundAmount(e.target.value)}
                placeholder="500.00"
                className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-4 text-[13px] outline-none focus:border-forest/30" />
            </div>
          )}
          <div>
            <p className="small-caps text-[8px] text-gray-400 mb-1">Resolution Notes (required)</p>
            <textarea value={resolutionNotes} onChange={e => setResolutionNotes(e.target.value)}
              placeholder="Describe the resolution..."
              className="w-full bg-brand-50 border border-brand-border rounded-xl py-3 px-4 text-[13px] outline-none focus:border-forest/30 min-h-[80px] resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button type="button" onClick={() => { setResolvingId(null); setResolutionNotes(''); setRefundAmount(''); }}
            className="flex-1 py-2.5 rounded-xl border border-brand-border text-[13px] font-bold hover:bg-brand-50">
            Cancel
          </button>
          <button type="button" onClick={submitResolution} disabled={!resolutionNotes.trim()}
            className="flex-1 py-2.5 rounded-xl bg-forest text-white text-[13px] font-bold hover:bg-[#3d5636] disabled:opacity-50">
            Confirm Resolve
          </button>
        </div>
      </Modal>
    </div>
  );
}

function DisputeCard({ dispute, isSelected, onSelect, onResolve, onEscalate }: {
  dispute: AdminDispute;
  isSelected: boolean;
  onSelect: () => void;
  onResolve: () => void;
  onEscalate: (id: string) => void;
}) {
  const Icon = ISSUE_ICON[dispute.issueType] ?? AlertTriangle;
  const isResolved = dispute.status === 'resolved';

  return (
    <div
      onClick={onSelect}
      className={cn(
        'bg-white rounded-2xl border shadow-sm p-5 cursor-pointer transition-all hover:shadow-md',
        isSelected ? 'border-forest/40 ring-1 ring-forest/10' : 'border-brand-border',
        isResolved && 'opacity-80',
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fdf3ec] flex items-center justify-center shrink-0">
            <Icon size={18} className="text-terracotta" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-slate">{ISSUE_LABEL[dispute.issueType]}</p>
            <p className="text-[12px] text-gray-400">{dispute.userName} → {dispute.therapistName}</p>
            <p className="text-[11px] font-mono text-gray-300 mt-0.5">Session {dispute.sessionId}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', STATUS_STYLE[dispute.status])}>{dispute.status}</span>
          <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', PRIORITY_STYLE[dispute.priority])}>{dispute.priority}</span>
        </div>
      </div>
      <p className="text-[13px] text-gray-500 leading-relaxed border-t border-brand-border pt-3 italic mb-4 line-clamp-2">&ldquo;{dispute.description}&rdquo;</p>
      {isResolved && dispute.resolution && (
        <div className="bg-[#f0f4ee] rounded-xl border border-forest/20 p-3 mb-4 text-[12px]">
          <p className="font-bold text-forest">{RESOLUTION_LABEL[dispute.resolution]}{dispute.refundAmount ? ` · ₹${dispute.refundAmount}` : ''}</p>
          {dispute.resolutionNotes && <p className="text-gray-500 mt-1">{dispute.resolutionNotes}</p>}
        </div>
      )}
      <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
        <p className="text-[12px] text-gray-400">{formatDate(dispute.date)}</p>
        {isResolved ? (
          <div className="flex items-center gap-1.5 text-forest"><CheckCircle2 size={14} /><span className="text-[12px] font-bold">Resolved</span></div>
        ) : (
          <div className="flex gap-2">
            {dispute.status !== 'escalated' && (
              <button onClick={() => onEscalate(dispute.id)} className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[12px] font-bold text-amber-600 hover:bg-amber-100 transition-colors">
                Escalate
              </button>
            )}
            <button onClick={onResolve} className="px-4 py-2 rounded-xl bg-[#f0f4ee] border border-forest/20 text-[12px] font-bold text-forest flex items-center gap-1.5 hover:bg-[#e4ebe0] transition-colors">
              <CheckCircle2 size={14} /> Resolve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-[13px]">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className="text-slate font-medium text-right">{value}</span>
    </div>
  );
}

function DisputeDetail({ dispute: d, onResolve, onEscalate }: {
  dispute: AdminDispute;
  onResolve: () => void;
  onEscalate: () => void;
}) {
  const Icon = ISSUE_ICON[d.issueType] ?? AlertTriangle;
  const isResolved = d.status === 'resolved';

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#fdf3ec] flex items-center justify-center shrink-0">
          <Icon size={18} className="text-terracotta" />
        </div>
        <div>
          <h2 className="serif text-xl text-slate">{ISSUE_LABEL[d.issueType]}</h2>
          <p className="text-[11px] font-mono text-gray-400 mt-0.5">Dispute {d.id}</p>
          <div className="flex gap-2 mt-2">
            <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', STATUS_STYLE[d.status])}>{d.status}</span>
            <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', PRIORITY_STYLE[d.priority])}>{d.priority}</span>
          </div>
        </div>
      </div>

      <div className="bg-brand-50 rounded-xl border border-brand-border p-4 space-y-3">
        <p className="small-caps text-[8px] text-gray-400">Parties</p>
        <div className="flex items-center gap-2 text-[13px]">
          <User size={14} className="text-[#4B7399] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate truncate">{d.userName}</p>
            <p className="text-[11px] text-gray-400 truncate">{d.raisedByEmail}</p>
          </div>
          <span className="text-[10px] font-bold uppercase text-gray-400">raised_by</span>
        </div>
        <div className="flex justify-center"><ArrowRight size={14} className="text-gray-300" /></div>
        <div className="flex items-center gap-2 text-[13px]">
          <User size={14} className="text-forest shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate truncate">{d.therapistName}</p>
            <p className="text-[11px] text-gray-400 truncate">{d.againstUserEmail}</p>
          </div>
          <span className="text-[10px] font-bold uppercase text-gray-400">against</span>
        </div>
      </div>

      <div>
        <p className="small-caps text-[8px] text-gray-400 mb-2">Session</p>
        <div className="space-y-2">
          <DetailRow label="Session ID" value={<span className="font-mono text-[12px]">{d.sessionId}</span>} />
          {d.bookingId && <DetailRow label="Booking ID" value={<span className="font-mono text-[12px]">{d.bookingId}</span>} />}
          <DetailRow label="Date" value={
            <span className="flex items-center gap-1 justify-end"><Calendar size={12} /> {formatDate(d.sessionDate)}</span>
          } />
          <DetailRow label="Time" value={
            <span className="flex items-center gap-1 justify-end"><Clock size={12} /> {d.sessionTime}</span>
          } />
        </div>
      </div>

      <div>
        <p className="small-caps text-[8px] text-gray-400 mb-2">Description</p>
        <p className="text-[13px] text-gray-600 leading-relaxed italic">&ldquo;{d.description}&rdquo;</p>
      </div>

      <div>
        <p className="small-caps text-[8px] text-gray-400 mb-2">Timestamps</p>
        <div className="space-y-2">
          <DetailRow label="Created" value={formatDateTime(d.createdAt)} />
          <DetailRow label="Updated" value={formatDateTime(d.updatedAt)} />
          {d.resolvedAt && <DetailRow label="Resolved" value={formatDateTime(d.resolvedAt)} />}
        </div>
      </div>

      {isResolved && d.resolution && (
        <div className="bg-[#f0f4ee] rounded-xl border border-forest/20 p-4 space-y-2">
          <p className="small-caps text-[8px] text-forest">Resolution</p>
          <DetailRow label="Outcome" value={RESOLUTION_LABEL[d.resolution]} />
          {d.refundAmount != null && <DetailRow label="Refund" value={`₹${d.refundAmount}`} />}
          {d.resolutionNotes && (
            <div>
              <p className="text-[11px] text-gray-400 mb-1">Notes</p>
              <p className="text-[13px] text-gray-600">{d.resolutionNotes}</p>
            </div>
          )}
          {d.resolvedByName && <DetailRow label="Resolved By" value={d.resolvedByName} />}
        </div>
      )}

      {!isResolved && (
        <div className="flex gap-2 pt-2 border-t border-brand-border">
          {d.status !== 'escalated' && (
            <button onClick={onEscalate} className="flex-1 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[12px] font-bold text-amber-600 hover:bg-amber-100">
              Escalate
            </button>
          )}
          <button onClick={onResolve} className="flex-1 py-2.5 rounded-xl bg-forest text-white text-[12px] font-bold hover:bg-[#3d5636] flex items-center justify-center gap-1.5">
            <CheckCircle2 size={14} /> Resolve
          </button>
        </div>
      )}
    </div>
  );
}
