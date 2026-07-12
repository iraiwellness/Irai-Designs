import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, AlertTriangle, CheckCircle2, CreditCard, UserX, ThumbsDown, X,
  Calendar, Clock, User, ArrowRight, ShieldAlert, FileText,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import {
  ADMIN_DISPUTES, type AdminDispute, type DisputeStatus,
  type DisputeType, type DisputeResolution, type Priority,
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

const RESOLUTION_OPTIONS: DisputeResolution[] = ['refund', 'partial_refund', 'credit', 'dismissed'];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

function formatDate(iso: string) {
  return new Date(iso + (iso.includes('T') ? '' : 'T12:00')).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-[13px]">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className="text-slate font-medium text-right">{value}</span>
    </div>
  );
}

export default function DisputeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dispute, setDispute] = useState<AdminDispute | undefined>(
    () => ADMIN_DISPUTES.find(d => d.id === id),
  );
  const [showResolve, setShowResolve] = useState(false);
  const [resolution, setResolution] = useState<DisputeResolution>('refund');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState('');

  if (!dispute) {
    return (
      <div className="min-h-full bg-brand-50 p-6 lg:p-8">
        <button type="button" onClick={() => navigate('/admin/disputes')}
          className="flex items-center gap-2 text-[13px] font-semibold text-forest hover:underline mb-6">
          <ArrowLeft size={16} /> Back to Disputes
        </button>
        <p className="text-[14px] text-gray-400">Dispute not found.</p>
      </div>
    );
  }

  const Icon = ISSUE_ICON[dispute.issueType] ?? AlertTriangle;
  const isResolved = dispute.status === 'resolved';

  const escalate = () => {
    setDispute(prev => prev ? {
      ...prev,
      status: 'escalated' as DisputeStatus,
      updatedAt: new Date().toISOString(),
    } : prev);
  };

  const submitResolution = () => {
    if (!resolutionNotes.trim()) return;
    const amount = refundAmount ? parseFloat(refundAmount) : undefined;
    const now = new Date().toISOString();
    setDispute(prev => prev ? {
      ...prev,
      status: 'resolved' as DisputeStatus,
      resolution,
      resolutionNotes: resolutionNotes.trim(),
      refundAmount: amount,
      resolvedAt: now,
      resolvedById: 'u12',
      resolvedByName: 'Platform Admin',
      updatedAt: now,
    } : prev);
    setShowResolve(false);
    setResolution('refund');
    setResolutionNotes('');
    setRefundAmount('');
  };

  return (
    <div className="min-h-full bg-brand-50 pb-8">
      {/* Dark hero header */}
      <div className="bg-gradient-to-br from-[#263d23] to-[#192b16] relative overflow-hidden" style={{ minHeight: 230 }}>
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/[0.03] rounded-full" />
        <div className="absolute bottom-0 -left-12 w-40 h-40 bg-white/[0.03] rounded-full blur-2xl" />

        <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-4">
          <button
            type="button"
            onClick={() => navigate('/admin/disputes')}
            className="w-9 h-9 bg-white/10 border border-white/15 rounded-full flex items-center justify-center active:scale-95 transition-all"
          >
            <ArrowLeft size={16} className="text-white" />
          </button>
          <button
            type="button"
            className="w-9 h-9 bg-white/10 border border-white/15 rounded-full flex items-center justify-center active:scale-95 transition-all"
          >
            <ShieldAlert size={16} className="text-white" />
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center pb-7 px-5">
          <div className="w-20 h-20 rounded-[24px] border-4 border-white/20 shadow-xl bg-[#fdf3ec] flex items-center justify-center mb-3">
            <Icon size={28} className="text-terracotta" />
          </div>
          <h1 className="serif text-[24px] text-white leading-none mb-1">{ISSUE_LABEL[dispute.issueType]}</h1>
          <p className="small-caps text-[8px] text-white/40">{dispute.userName} → {dispute.therapistName}</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
            <span className={cn('text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border', STATUS_STYLE[dispute.status])}>
              {dispute.status}
            </span>
            <span className={cn('text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border', PRIORITY_STYLE[dispute.priority])}>
              {dispute.priority}
            </span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-5 space-y-4 max-w-3xl mx-auto"
      >
        {/* Action buttons */}
        {!isResolved && (
          <div className="flex gap-3">
            {dispute.status !== 'escalated' && (
              <button type="button" onClick={escalate}
                className="flex-1 bg-amber-50 border border-amber-200 text-amber-600 py-3 rounded-2xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all">
                Escalate
              </button>
            )}
            <button type="button" onClick={() => setShowResolve(true)}
              className="flex-1 bg-forest text-white py-3 rounded-2xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all">
              <CheckCircle2 size={15} /> Resolve
            </button>
          </div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f0f4ee] flex items-center justify-center shrink-0">
              <Calendar size={16} className="text-forest" />
            </div>
            <div>
              <p className="small-caps text-[7px] text-gray-400">Session Date</p>
              <p className="text-[11px] font-bold text-slate">{formatDate(dispute.sessionDate)}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#eef3f9] flex items-center justify-center shrink-0">
              <Clock size={16} className="text-[#4B7399]" />
            </div>
            <div>
              <p className="small-caps text-[7px] text-gray-400">Session Time</p>
              <p className="text-[11px] font-bold text-slate">{dispute.sessionTime}</p>
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-3">
          <p className="small-caps text-gray-400">Parties</p>
          <div className="flex items-center gap-2 text-[13px]">
            <User size={14} className="text-[#4B7399] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate truncate">{dispute.userName}</p>
              <p className="text-[11px] text-gray-400 truncate">{dispute.raisedByEmail}</p>
            </div>
            <span className="text-[10px] font-bold uppercase text-gray-400">raised_by</span>
          </div>
          <div className="flex justify-center"><ArrowRight size={14} className="text-gray-300" /></div>
          <div className="flex items-center gap-2 text-[13px]">
            <User size={14} className="text-forest shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate truncate">{dispute.therapistName}</p>
              <p className="text-[11px] text-gray-400 truncate">{dispute.againstUserEmail}</p>
            </div>
            <span className="text-[10px] font-bold uppercase text-gray-400">against</span>
          </div>
        </div>

        {/* Session details */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-3">
          <p className="small-caps text-gray-400">Session</p>
          <DetailRow label="Dispute ID" value={<span className="font-mono text-[12px]">{dispute.id}</span>} />
          <DetailRow label="Session ID" value={<span className="font-mono text-[12px]">{dispute.sessionId}</span>} />
          {dispute.bookingId && (
            <DetailRow label="Booking ID" value={<span className="font-mono text-[12px]">{dispute.bookingId}</span>} />
          )}
          <DetailRow label="Issue type" value={ISSUE_LABEL[dispute.issueType]} />
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4">
          <p className="small-caps text-gray-400 mb-2">Description</p>
          <p className="text-[13px] text-gray-600 leading-relaxed italic">&ldquo;{dispute.description}&rdquo;</p>
        </div>

        {/* Timestamps */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-3">
          <p className="small-caps text-gray-400">Timestamps</p>
          <DetailRow label="Created" value={formatDateTime(dispute.createdAt)} />
          <DetailRow label="Updated" value={formatDateTime(dispute.updatedAt)} />
          {dispute.resolvedAt && <DetailRow label="Resolved" value={formatDateTime(dispute.resolvedAt)} />}
        </div>

        {/* Resolution */}
        {isResolved && dispute.resolution && (
          <div className="bg-[#f0f4ee] rounded-2xl border border-forest/20 p-4 space-y-3">
            <p className="small-caps text-forest">Resolution</p>
            <DetailRow label="Outcome" value={RESOLUTION_LABEL[dispute.resolution]} />
            {dispute.refundAmount != null && <DetailRow label="Refund" value={`₹${dispute.refundAmount}`} />}
            {dispute.resolutionNotes && (
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Notes</p>
                <p className="text-[13px] text-gray-600">{dispute.resolutionNotes}</p>
              </div>
            )}
            {dispute.resolvedByName && <DetailRow label="Resolved By" value={dispute.resolvedByName} />}
          </div>
        )}

        {/* View booking */}
        <button type="button" onClick={() => navigate('/admin/bookings')}
          className="w-full bg-white border border-brand-border text-slate py-3 rounded-2xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-sm hover:bg-brand-50 transition-all">
          <FileText size={15} /> View Bookings
        </button>
      </motion.div>

      <Modal
        open={showResolve}
        onClose={() => { setShowResolve(false); setResolutionNotes(''); setRefundAmount(''); }}
        title="Resolve Dispute"
        maxWidth="max-w-md"
      >
        <p className="text-[13px] text-gray-500 mb-4">
          Resolving dispute for session <code className="text-[12px] bg-brand-50 px-1.5 py-0.5 rounded">{dispute.sessionId}</code>.
          Update the dispute status and resolution notes below.
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
          <button type="button" onClick={() => { setShowResolve(false); setResolutionNotes(''); setRefundAmount(''); }}
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
