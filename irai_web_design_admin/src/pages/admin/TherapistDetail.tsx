import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle2, XCircle, Ban, Mail, Phone } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { ADMIN_THERAPISTS, therapistFullName, type AdminTherapist, type TherapistStatus } from '../../adminData';
import { cn } from '../../lib/utils';

const STATUS_STYLE: Record<TherapistStatus, string> = {
  verified:  'text-forest border-forest/20 bg-[#f0f4ee]',
  pending:   'text-amber-600 border-amber-200 bg-amber-50',
  rejected:  'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
  suspended: 'text-gray-400 border-gray-200 bg-gray-50',
};

type ActionType = 'reject' | 'suspend';

export default function TherapistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState<AdminTherapist | undefined>(
    () => ADMIN_THERAPISTS.find(t => t.id === id),
  );
  const [actionModal, setActionModal] = useState<ActionType | null>(null);
  const [actionReason, setActionReason] = useState('');

  if (!therapist) {
    return (
      <div className="p-6 lg:p-8">
        <button type="button" onClick={() => navigate('/admin/therapists')} className="flex items-center gap-2 text-[13px] font-semibold text-forest hover:underline mb-6">
          <ArrowLeft size={16} /> Back to Therapists
        </button>
        <p className="text-[14px] text-gray-400">Practitioner not found.</p>
      </div>
    );
  }

  const verify = () =>
    setTherapist(prev => prev ? { ...prev, status: 'verified', rejectionReason: undefined } : prev);

  const submitAction = () => {
    if (!actionModal || !actionReason.trim()) return;
    const newStatus: TherapistStatus = actionModal === 'reject' ? 'rejected' : 'suspended';
    setTherapist(prev => prev ? {
      ...prev,
      status: newStatus,
      rejectionReason: actionReason.trim(),
      isSuspended: actionModal === 'suspend',
      isActive: actionModal !== 'suspend',
    } : prev);
    setActionModal(null);
    setActionReason('');
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <button
        type="button"
        onClick={() => navigate('/admin/therapists')}
        className="flex items-center gap-2 text-[13px] font-semibold text-forest hover:underline mb-6"
      >
        <ArrowLeft size={16} /> Back to Therapists
      </button>

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-brand-border">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#f5f7f2] border border-brand-border flex items-center justify-center text-forest font-bold text-lg shrink-0">
              {therapist.firstName[0]}{therapist.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="serif text-3xl text-slate">{therapistFullName(therapist)}</h1>
              <p className="text-[14px] text-gray-400 mt-1">{therapist.title}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', STATUS_STYLE[therapist.status])}>{therapist.status}</span>
                {therapist.rating > 0 && (
                  <span className="flex items-center gap-1 text-[13px] font-semibold text-slate">
                    <Star size={14} className="text-amber-500 fill-amber-500" /> {therapist.rating}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2 text-[13px]">
            <div className="flex items-center gap-2 text-gray-500"><Mail size={14} /> {therapist.email}</div>
            <div className="flex items-center gap-2 text-gray-500"><Phone size={14} /> {therapist.phone}</div>
          </div>

          <div>
            <p className="small-caps text-[8px] text-gray-400 mb-1">Specialty</p>
            <p className="text-[14px] font-semibold text-slate">{therapist.specialty}</p>
          </div>

          <div>
            <p className="small-caps text-[8px] text-gray-400 mb-1">Bio</p>
            <p className="text-[13px] text-gray-600 leading-relaxed">{therapist.bio}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
            <div><p className="text-gray-400 text-[11px]">Experience</p><p className="font-semibold">{therapist.experienceYears} yrs</p></div>
            <div><p className="text-gray-400 text-[11px]">Fee</p><p className="font-semibold">₹{therapist.consultationFee}</p></div>
            <div><p className="text-gray-400 text-[11px]">Sessions</p><p className="font-semibold">{therapist.totalSessions}</p></div>
            <div><p className="text-gray-400 text-[11px]">Clients</p><p className="font-semibold">{therapist.activeClients}</p></div>
          </div>

          <div>
            <p className="small-caps text-[8px] text-gray-400 mb-2">Qualifications</p>
            <div className="flex flex-wrap gap-1.5">
              {therapist.qualifications.map(q => (
                <span key={q} className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-50 border border-brand-border text-slate">{q}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="small-caps text-[8px] text-gray-400 mb-2">Specializations</p>
            <div className="flex flex-wrap gap-1.5">
              {therapist.specializations.map(s => (
                <span key={s} className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#f0f4ee] text-forest">{s}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="small-caps text-[8px] text-gray-400 mb-2">Languages</p>
            <p className="text-[13px] text-slate uppercase">{therapist.languages.join(', ')}</p>
          </div>

          {therapist.rejectionReason && (
            <div className="bg-[#fdf3ec] rounded-xl border border-terracotta/20 p-3 text-[12px]">
              <p className="font-bold text-terracotta">Reason</p>
              <p className="text-gray-600 mt-1">{therapist.rejectionReason}</p>
            </div>
          )}

          {therapist.status === 'pending' && (
            <div className="flex gap-2 pt-2 border-t border-brand-border">
              <button type="button" onClick={verify} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-forest text-white rounded-xl text-[12px] font-bold">
                <CheckCircle2 size={14} /> Verify
              </button>
              <button type="button" onClick={() => setActionModal('reject')} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-brand-border rounded-xl text-[12px] font-bold">
                <XCircle size={14} /> Reject
              </button>
            </div>
          )}
          {therapist.status === 'verified' && (
            <div className="pt-2 border-t border-brand-border">
              <button type="button" onClick={() => setActionModal('suspend')} className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-terracotta/30 text-terracotta rounded-xl text-[12px] font-bold">
                <Ban size={14} /> Suspend
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={!!actionModal}
        onClose={() => { setActionModal(null); setActionReason(''); }}
        title={actionModal === 'suspend' ? 'Suspend Practitioner' : 'Reject Practitioner'}
      >
        <p className="text-[13px] text-gray-500 mb-4">
          {actionModal === 'suspend' ? 'Suspending' : 'Rejecting'} {therapistFullName(therapist)}. Please provide a reason.
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
            Confirm {actionModal === 'suspend' ? 'Suspend' : 'Reject'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
