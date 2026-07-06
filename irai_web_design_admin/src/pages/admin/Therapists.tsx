import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Star, CheckCircle2, XCircle, Clock, Ban, Mail, Phone } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { ADMIN_THERAPISTS, therapistFullName, type AdminTherapist, type TherapistStatus } from '../../adminData';
import { cn } from '../../lib/utils';

const STATUS_STYLE: Record<TherapistStatus, string> = {
  verified:  'text-forest border-forest/20 bg-[#f0f4ee]',
  pending:   'text-amber-600 border-amber-200 bg-amber-50',
  rejected:  'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
  suspended: 'text-gray-400 border-gray-200 bg-gray-50',
};

const FILTERS: { id: TherapistStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'verified', label: 'Verified' },
  { id: 'pending', label: 'Pending' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'suspended', label: 'Suspended' },
];

type ActionType = 'reject' | 'suspend';

export default function AdminTherapists() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as TherapistStatus | 'all') || 'all';
  const selectedId = searchParams.get('selected');

  const [filter, setFilter] = useState<TherapistStatus | 'all'>(initialTab);
  const [search, setSearch] = useState('');
  const [therapists, setTherapists] = useState(ADMIN_THERAPISTS);
  const [actionModal, setActionModal] = useState<{ id: string; action: ActionType } | null>(null);
  const [actionReason, setActionReason] = useState('');

  const selected = therapists.find(t => t.id === selectedId) ?? null;

  useEffect(() => {
    const tab = searchParams.get('tab') as TherapistStatus | 'all' | null;
    if (tab) setFilter(tab);
  }, [searchParams]);

  const filtered = therapists
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return therapistFullName(t).toLowerCase().includes(q)
        || t.email.toLowerCase().includes(q)
        || t.specialty.toLowerCase().includes(q);
    });

  const pendingCount = therapists.filter(t => t.status === 'pending').length;
  const verifiedCount = therapists.filter(t => t.status === 'verified').length;

  const selectTherapist = (id: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (id) params.set('selected', id);
    else params.delete('selected');
    setSearchParams(params);
  };

  const verify = (id: string) =>
    setTherapists(prev => prev.map(t => t.id === id ? { ...t, status: 'verified' as TherapistStatus, rejectionReason: undefined } : t));

  const submitAction = () => {
    if (!actionModal || !actionReason.trim()) return;
    const newStatus: TherapistStatus = actionModal.action === 'reject' ? 'rejected' : 'suspended';
    setTherapists(prev => prev.map(t =>
      t.id === actionModal.id ? {
        ...t,
        status: newStatus,
        rejectionReason: actionReason.trim(),
        isSuspended: actionModal.action === 'suspend',
        isActive: actionModal.action !== 'suspend',
      } : t,
    ));
    setActionModal(null);
    setActionReason('');
  };

  const actionTherapist = therapists.find(t => t.id === actionModal?.id);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <p className="small-caps text-gray-400 mb-1">Admin · GET /admin/therapists/ · PATCH /verify/</p>
        <h1 className="serif text-4xl text-slate">Practitioner Team</h1>
        <p className="text-[13px] text-gray-400 mt-1">{verifiedCount} verified · {pendingCount} pending verification</p>
      </div>

      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 mb-5">
          <Clock size={16} className="text-amber-600 shrink-0" />
          <p className="text-[13px] font-medium text-amber-700">{pendingCount} practitioner{pendingCount > 1 ? 's' : ''} awaiting verification</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, specialty..."
            className="w-full bg-white border border-brand-border rounded-xl py-2.5 pl-10 pr-9 text-[13px] outline-none focus:border-forest/30" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} className="text-gray-300" /></button>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={cn('px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all',
                filter === f.id ? 'bg-slate text-white border-slate' : 'bg-white text-gray-400 border-brand-border')}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <div className={cn('bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden transition-all', selected ? 'flex-1 min-w-0' : 'w-full')}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border bg-brand-50/50">
                {['Practitioner', 'Email', 'Specialty', 'Rating', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr
                  key={t.id}
                  onClick={() => selectTherapist(t.id)}
                  className={cn(
                    'border-b border-brand-border last:border-0 hover:bg-brand-50/30 cursor-pointer',
                    selectedId === t.id && 'bg-brand-50/50',
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#f5f7f2] border border-brand-border flex items-center justify-center text-forest font-bold text-[11px]">
                        {t.firstName[0]}{t.lastName[0]}
                      </div>
                      <div>
                        <span className="text-[13px] font-semibold text-slate">{therapistFullName(t)}</span>
                        <p className="text-[11px] text-gray-400">{t.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-gray-500">{t.email}</td>
                  <td className="px-5 py-4 text-[13px] text-gray-500">{t.specialty}</td>
                  <td className="px-5 py-4">
                    {t.rating > 0 ? (
                      <div className="flex items-center gap-1 text-[13px] font-semibold">
                        <Star size={12} className="text-amber-500 fill-amber-500" /> {t.rating}
                      </div>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', STATUS_STYLE[t.status])}>{t.status}</span>
                  </td>
                  <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                    {t.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button onClick={() => verify(t.id)} className="flex items-center gap-1 text-[12px] font-bold text-forest hover:underline">
                          <CheckCircle2 size={14} /> Verify
                        </button>
                        <button onClick={() => setActionModal({ id: t.id, action: 'reject' })} className="flex items-center gap-1 text-[12px] font-bold text-gray-400 hover:underline">
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    ) : t.status === 'verified' ? (
                      <button onClick={() => setActionModal({ id: t.id, action: 'suspend' })} className="flex items-center gap-1 text-[12px] font-bold text-gray-400 hover:underline">
                        <Ban size={14} /> Suspend
                      </button>
                    ) : (
                      <span className="text-[12px] text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="w-96 shrink-0 bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-12rem)]">
            <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
              <p className="small-caps text-gray-400">GET /admin/therapists/:id/</p>
              <button onClick={() => selectTherapist(null)} className="text-gray-400 hover:text-slate"><X size={16} /></button>
            </div>
            <TherapistDetail
              therapist={selected}
              onVerify={() => verify(selected.id)}
              onReject={() => setActionModal({ id: selected.id, action: 'reject' })}
              onSuspend={() => setActionModal({ id: selected.id, action: 'suspend' })}
            />
          </div>
        )}
      </div>

      <Modal
        open={!!actionModal}
        onClose={() => { setActionModal(null); setActionReason(''); }}
        title={actionModal?.action === 'suspend' ? 'Suspend Practitioner' : 'Reject Practitioner'}
      >
        <p className="text-[13px] text-gray-500 mb-4">
          {actionModal?.action === 'suspend' ? 'Suspending' : 'Rejecting'} {actionTherapist ? therapistFullName(actionTherapist) : ''}.
          Reason is required per API.
        </p>
        <textarea
          value={actionReason}
          onChange={e => setActionReason(e.target.value)}
          placeholder="Reason (required)..."
          className="w-full bg-brand-50 border border-brand-border rounded-xl py-3 px-4 text-[13px] outline-none focus:border-forest/30 min-h-[100px] resize-none mb-4"
        />
        <div className="flex gap-3">
          <button type="button" onClick={() => { setActionModal(null); setActionReason(''); }}
            className="flex-1 py-2.5 rounded-xl border border-brand-border text-[13px] font-bold hover:bg-brand-50">
            Cancel
          </button>
          <button type="button" onClick={submitAction} disabled={!actionReason.trim()}
            className="flex-1 py-2.5 rounded-xl bg-terracotta text-white text-[13px] font-bold hover:bg-terracotta/90 disabled:opacity-50">
            Confirm {actionModal?.action === 'suspend' ? 'Suspend' : 'Reject'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function TherapistDetail({ therapist: t, onVerify, onReject, onSuspend }: {
  therapist: AdminTherapist;
  onVerify: () => void;
  onReject: () => void;
  onSuspend: () => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      <div>
        <h2 className="serif text-2xl text-slate">{therapistFullName(t)}</h2>
        <p className="text-[13px] text-gray-400 mt-1">{t.title}</p>
        <span className={cn('inline-block mt-2 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', STATUS_STYLE[t.status])}>{t.status}</span>
      </div>

      <div className="space-y-2 text-[13px]">
        <div className="flex items-center gap-2 text-gray-500"><Mail size={14} /> {t.email}</div>
        <div className="flex items-center gap-2 text-gray-500"><Phone size={14} /> {t.phone}</div>
      </div>

      <div>
        <p className="small-caps text-[8px] text-gray-400 mb-1">Bio</p>
        <p className="text-[13px] text-gray-600 leading-relaxed">{t.bio}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[13px]">
        <div><p className="text-gray-400 text-[11px]">Experience</p><p className="font-semibold">{t.experienceYears} yrs</p></div>
        <div><p className="text-gray-400 text-[11px]">Fee</p><p className="font-semibold">₹{t.consultationFee}</p></div>
        <div><p className="text-gray-400 text-[11px]">Sessions</p><p className="font-semibold">{t.totalSessions}</p></div>
        <div><p className="text-gray-400 text-[11px]">Clients</p><p className="font-semibold">{t.activeClients}</p></div>
      </div>

      <div>
        <p className="small-caps text-[8px] text-gray-400 mb-2">Qualifications</p>
        <div className="flex flex-wrap gap-1.5">
          {t.qualifications.map(q => (
            <span key={q} className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-50 border border-brand-border text-slate">{q}</span>
          ))}
        </div>
      </div>

      <div>
        <p className="small-caps text-[8px] text-gray-400 mb-2">Specializations</p>
        <div className="flex flex-wrap gap-1.5">
          {t.specializations.map(s => (
            <span key={s} className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#f0f4ee] text-forest">{s}</span>
          ))}
        </div>
      </div>

      <div>
        <p className="small-caps text-[8px] text-gray-400 mb-2">Languages</p>
        <p className="text-[13px] text-slate uppercase">{t.languages.join(', ')}</p>
      </div>

      {t.rejectionReason && (
        <div className="bg-[#fdf3ec] rounded-xl border border-terracotta/20 p-3 text-[12px]">
          <p className="font-bold text-terracotta">Reason</p>
          <p className="text-gray-600 mt-1">{t.rejectionReason}</p>
        </div>
      )}

      {t.status === 'pending' && (
        <div className="flex gap-2 pt-2">
          <button onClick={onVerify} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-forest text-white rounded-xl text-[12px] font-bold">
            <CheckCircle2 size={14} /> Verify
          </button>
          <button onClick={onReject} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-brand-border rounded-xl text-[12px] font-bold">
            <XCircle size={14} /> Reject
          </button>
        </div>
      )}
      {t.status === 'verified' && (
        <button onClick={onSuspend} className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-terracotta/30 text-terracotta rounded-xl text-[12px] font-bold">
          <Ban size={14} /> Suspend
        </button>
      )}
    </div>
  );
}
