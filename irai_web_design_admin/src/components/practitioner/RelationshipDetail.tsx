import type { Patient } from '../../types';
import { cn } from '../../lib/utils';

function formatTs(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export default function RelationshipDetail({ patient, compact = false }: { patient: Patient; compact?: boolean }) {
  return (
    <div className={cn('bg-brand-50 rounded-xl border border-brand-border', compact ? 'p-3' : 'p-4')}>
      <div className="flex items-center justify-between mb-3">
        <p className="small-caps text-[8px] text-gray-400">patient-relationships / {patient.relationshipId}</p>
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white border border-brand-border text-slate capitalize">
          {patient.relationshipStatus}
        </span>
      </div>
      <div className="space-y-2 text-[12px]">
        <Row label="Relationship ID" value={patient.relationshipId} mono />
        <Row label="Patient ID" value={patient.patientUserId} mono />
        <Row label="Practitioner ID" value={patient.practitionerId} mono />
        <Row label="Service type ID" value={patient.serviceTypeId} mono />
        <Row label="Service" value={patient.serviceType} />
        {!compact && (
          <>
            <Row label="Requested at" value={formatTs(patient.requestedAt)} />
            <Row label="Accepted at" value={formatTs(patient.acceptedAt)} />
            <Row label="Rejected at" value={formatTs(patient.rejectedAt)} />
            <Row label="Ended at" value={formatTs(patient.endedAt)} />
          </>
        )}
        {compact && patient.requestedAt && (
          <Row label="Requested" value={formatTs(patient.requestedAt)} />
        )}
        {patient.rejectionReason && (
          <div className="pt-2 border-t border-brand-border">
            <p className="text-gray-400 text-[11px]">Rejection reason</p>
            <p className="text-slate font-medium mt-0.5">{patient.rejectionReason}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className={cn('text-slate font-medium text-right', mono && 'font-mono text-[11px]')}>{value}</span>
    </div>
  );
}
