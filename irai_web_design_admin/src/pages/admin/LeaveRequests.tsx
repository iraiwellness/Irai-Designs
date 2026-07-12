import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { CheckCircle2, XCircle, Clock, CalendarOff, Search, X } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { MOCK_PRACTITIONER_BREAKS } from '../../mockData';
import type { BreakRequestStatus, PractitionerBreak } from '../../types';
import { cn } from '../../lib/utils';

const FILTERS: { id: BreakRequestStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

const STATUS_STYLE: Record<BreakRequestStatus, string> = {
  pending:  'text-amber-600 border-amber-200 bg-amber-50',
  approved: 'text-forest border-forest/20 bg-[#f0f4ee]',
  rejected: 'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
};


export default function AdminLeaveRequests() {
  const [requests, setRequests] = useState<PractitionerBreak[]>(
    MOCK_PRACTITIONER_BREAKS.filter(b => b.kind === 'day_off'),
  );
  const [filter, setFilter] = useState<BreakRequestStatus | 'all'>('pending');
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState<PractitionerBreak | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = requests
    .filter(r => filter === 'all' || r.status === filter)
    .filter(r => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return r.practitionerName.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q);
    });

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const approve = (id: string) => {
    setRequests(prev => prev.map(r =>
      r.id === id
        ? { ...r, status: 'approved' as const, reviewedAt: new Date().toISOString(), rejectionReason: undefined }
        : r,
    ));
  };

  const submitReject = () => {
    if (!rejectModal || !rejectReason.trim()) return;
    setRequests(prev => prev.map(r =>
      r.id === rejectModal.id
        ? {
            ...r,
            status: 'rejected' as const,
            reviewedAt: new Date().toISOString(),
            rejectionReason: rejectReason.trim(),
          }
        : r,
    ));
    setRejectModal(null);
    setRejectReason('');
  };

  return (
    <div className="p-6 lg:p-8">
      {pendingCount > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <Clock size={18} className="text-amber-600 shrink-0" />
          <p className="text-[13px] text-amber-800 font-medium">
            {pendingCount} day-off request{pendingCount > 1 ? 's' : ''} awaiting approval
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search practitioner or reason..."
            className="w-full bg-white border border-brand-border rounded-xl py-3 pl-10 pr-9 text-[13px] outline-none focus:border-forest/30"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={13} className="text-gray-300" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                'px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all',
                filter === f.id ? 'bg-slate text-white border-slate' : 'bg-white text-gray-400 border-brand-border',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-border bg-brand-50/50">
              <th className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Practitioner</th>
              <th className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Date</th>
              <th className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Reason</th>
              <th className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Requested</th>
              <th className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Status</th>
              <th className="text-right px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(req => (
              <tr key={req.id} className="border-b border-brand-border last:border-0 hover:bg-brand-50/30">
                <td className="px-5 py-4">
                  <p className="text-[13px] font-semibold text-slate">{req.practitionerName}</p>
                  <p className="small-caps text-[7px] text-gray-400 mt-0.5">Day off</p>
                </td>
                <td className="px-5 py-4 text-[13px] text-slate">
                  {format(parseISO(req.date), 'EEE, MMM d, yyyy')}
                </td>
                <td className="px-5 py-4">
                  <p className="text-[12px] text-slate max-w-[200px] truncate">{req.reason}</p>
                  {req.rejectionReason && (
                    <p className="text-[11px] text-terracotta mt-0.5 max-w-[200px] truncate">
                      {req.rejectionReason}
                    </p>
                  )}
                </td>
                <td className="px-5 py-4 text-[12px] text-gray-400">
                  {format(parseISO(req.requestedAt), 'MMM d, h:mm a')}
                </td>
                <td className="px-5 py-4">
                  <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border capitalize', STATUS_STYLE[req.status])}>
                    {req.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {req.status === 'pending' ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => approve(req.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest text-white text-[11px] font-bold hover:bg-forest/90 transition-colors"
                      >
                        <CheckCircle2 size={13} /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRejectModal(req); setRejectReason(''); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-terracotta/30 text-terracotta text-[11px] font-bold hover:bg-[#fdf3ec] transition-colors"
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-300 text-right block">
                      {req.reviewedAt ? format(parseISO(req.reviewedAt), 'MMM d') : '—'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <CalendarOff size={28} className="mx-auto mb-3 text-gray-200" />
            <p className="small-caps text-[9px] text-gray-300">No leave requests found</p>
          </div>
        )}
      </div>

      <Modal
        open={!!rejectModal}
        onClose={() => setRejectModal(null)}
        title="Reject leave request"
      >
        {rejectModal && (
          <div className="space-y-4">
            <p className="text-[13px] text-gray-500">
              Rejecting <strong>{rejectModal.practitionerName}</strong>&apos;s day off on{' '}
              <strong>{format(parseISO(rejectModal.date), 'MMMM d, yyyy')}</strong>.
            </p>
            <div>
              <label className="small-caps text-[8px] text-gray-400 block mb-2">Rejection reason</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={3}
                placeholder="e.g. High booking volume that day — please choose another date"
                className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-3 text-[13px] outline-none focus:border-forest/30 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRejectModal(null)}
                className="flex-1 py-3 rounded-xl border border-brand-border text-slate text-[13px] font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReject}
                disabled={!rejectReason.trim()}
                className="flex-1 py-3 rounded-xl bg-terracotta text-white text-[13px] font-bold disabled:opacity-40"
              >
                Reject request
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
