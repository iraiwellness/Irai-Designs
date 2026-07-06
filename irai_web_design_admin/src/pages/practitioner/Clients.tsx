import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, Users, MessageSquare, Calendar, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { MOCK_PATIENTS } from '../../mockData';
import { cn } from '../../lib/utils';
import PatientPreview from '../../components/practitioner/PatientPreview';
import type { Patient, RelationshipStatus } from '../../types';

const STATUS_TABS: { id: 'all' | RelationshipStatus | 'ended'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'requested', label: 'Requested' },
  { id: 'ended', label: 'Ended' },
];

const RELATIONSHIP_STYLE: Record<RelationshipStatus, string> = {
  active: 'text-forest border-forest/20 bg-[#f0f4ee]',
  requested: 'text-amber-600 border-amber-200 bg-amber-50',
  rejected: 'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
  ended: 'text-gray-400 border-gray-200 bg-gray-50',
};

function matchesTab(patient: Patient, tab: string): boolean {
  if (tab === 'all') return patient.relationshipStatus !== 'rejected';
  if (tab === 'ended') return patient.relationshipStatus === 'ended' || patient.relationshipStatus === 'rejected';
  return patient.relationshipStatus === tab;
}

export default function Clients() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const tabParam = params.get('tab') ?? 'all';
  const activeTab = STATUS_TABS.some(t => t.id === tabParam) ? tabParam : 'all';

  const filtered = useMemo(() =>
    patients
      .filter(p => matchesTab(p, activeTab))
      .filter(p =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.condition.toLowerCase().includes(search.toLowerCase()) ||
        p.serviceType.toLowerCase().includes(search.toLowerCase()),
      ),
  [patients, activeTab, search]);

  const selectedId = params.get('selected') ?? filtered[0]?.id;
  const selectedPatient = patients.find(p => p.id === selectedId) ?? filtered[0];

  const pendingCount = patients.filter(p => p.relationshipStatus === 'requested').length;
  const activeCount = patients.filter(p => p.relationshipStatus === 'active').length;

  useEffect(() => {
    if (filtered.length > 0 && !filtered.some(p => p.id === selectedId)) {
      setParams(prev => {
        const next = new URLSearchParams(prev);
        next.set('selected', filtered[0].id);
        return next;
      }, { replace: true });
    }
  }, [filtered, selectedId, setParams]);

  const setTab = (tab: string) => {
    setParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      return next;
    }, { replace: true });
  };

  const selectPatient = (id: string) => {
    setParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('selected', id);
      return next;
    }, { replace: true });
  };

  const acceptRequest = (id: string) => {
    setPatients(prev => prev.map(p =>
      p.id === id ? { ...p, relationshipStatus: 'active' as const } : p,
    ));
    setRejectingId(null);
    setRejectReason('');
  };

  const rejectRequest = (id: string) => {
    if (!rejectReason.trim()) return;
    setPatients(prev => prev.map(p =>
      p.id === id ? { ...p, relationshipStatus: 'rejected' as const, rejectionReason: rejectReason.trim() } : p,
    ));
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="p-6 lg:p-8 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="small-caps text-gray-400 mb-1">Practitioner</p>
          <h1 className="serif text-4xl text-slate leading-tight">My Clients</h1>
          <p className="text-[13px] text-gray-400 mt-1">
            {activeCount} active · {pendingCount} pending request{pendingCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {pendingCount > 0 && activeTab !== 'requested' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 mb-5">
          <p className="text-[13px] font-medium text-amber-700">
            {pendingCount} patient{pendingCount > 1 ? 's' : ''} requested to connect with you
          </p>
          <button type="button" onClick={() => setTab('requested')} className="text-[12px] font-bold text-forest hover:underline shrink-0">
            Review requests →
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or service..."
            className="w-full bg-white border border-brand-border rounded-xl py-2.5 pl-10 pr-9 text-[13px] text-slate placeholder:text-gray-300 outline-none focus:border-forest/30 transition-colors"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-gray-300" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTab(tab.id)}
              className={cn(
                'px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all',
                activeTab === tab.id
                  ? 'bg-slate text-white border-slate'
                  : 'bg-white text-gray-400 border-brand-border hover:border-forest/20',
              )}
            >
              {tab.label}
              {tab.id === 'requested' && pendingCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-terracotta text-white text-[9px]">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-0">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-220px)]">
          <div className="px-4 py-3 border-b border-brand-border bg-brand-50/50">
            <p className="small-caps text-[8px] text-gray-400">
              {filtered.length} client{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-brand-border">
            {filtered.map(patient => {
              const isSelected = patient.id === selectedId;
              return (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => selectPatient(patient.id)}
                  className={cn(
                    'w-full text-left p-4 flex items-center gap-3 transition-colors',
                    isSelected ? 'bg-[#f0f4ee]' : 'hover:bg-brand-50/50',
                  )}
                >
                  <div className="relative shrink-0">
                    <img src={patient.avatar} alt={patient.name} className="w-11 h-11 rounded-xl object-cover" />
                    {isSelected && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-forest border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate truncate">{patient.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{patient.serviceType}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <span className={cn('text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border', RELATIONSHIP_STYLE[patient.relationshipStatus])}>
                      {patient.relationshipStatus}
                    </span>
                    {patient.relationshipStatus === 'active' && patient.nextAppointment && (
                      <p className="text-[10px] text-gray-400">
                        Next {new Date(patient.nextAppointment + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Users size={28} className="mx-auto mb-3 text-gray-200" />
                <p className="text-[13px] text-gray-400">No clients in this view</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-220px)]">
          {selectedPatient ? (
            <>
              <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
                <p className="small-caps text-[8px] text-gray-400">Client Preview</p>
                {selectedPatient.relationshipStatus === 'active' && (
                  <button
                    type="button"
                    onClick={() => navigate(`/practitioner/clients/${selectedPatient.id}`)}
                    className="flex items-center gap-1 text-[12px] font-semibold text-forest hover:underline"
                  >
                    Full profile <ChevronRight size={14} />
                  </button>
                )}
              </div>

              {selectedPatient.relationshipStatus === 'requested' ? (
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <img src={selectedPatient.avatar} alt={selectedPatient.name} className="w-16 h-16 rounded-2xl object-cover border border-brand-border" />
                    <div>
                      <h2 className="serif text-2xl text-slate">{selectedPatient.name}</h2>
                      <p className="text-[13px] text-gray-400 mt-1">{selectedPatient.serviceType}</p>
                      <p className="text-[12px] text-gray-400 mt-2">Requested {selectedPatient.requestedAt}</p>
                    </div>
                  </div>
                  <div className="bg-brand-50 rounded-xl border border-brand-border p-4 mb-5 space-y-2">
                    <p className="small-caps text-[8px] text-gray-400">Contact</p>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-gray-400">Email</span>
                      <span className="font-medium text-slate">{selectedPatient.email}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-gray-400">Concern</span>
                      <span className="font-medium text-slate">{selectedPatient.condition}</span>
                    </div>
                  </div>
                  {rejectingId === selectedPatient.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="Reason for declining (required)..."
                        className="w-full bg-brand-50 border border-brand-border rounded-xl py-3 px-4 text-[13px] outline-none focus:border-forest/30 min-h-[80px] resize-none"
                      />
                      <div className="flex gap-3">
                        <button type="button" onClick={() => { setRejectingId(null); setRejectReason(''); }}
                          className="flex-1 py-2.5 rounded-xl border border-brand-border text-[13px] font-bold hover:bg-brand-50">
                          Cancel
                        </button>
                        <button type="button" onClick={() => rejectRequest(selectedPatient.id)}
                          className="flex-1 py-2.5 rounded-xl bg-terracotta text-white text-[13px] font-bold hover:bg-terracotta/90">
                          Confirm Decline
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button type="button" onClick={() => acceptRequest(selectedPatient.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-forest text-white rounded-xl text-[13px] font-bold hover:bg-[#3d5636] transition-colors">
                        <CheckCircle2 size={16} /> Accept
                      </button>
                      <button type="button" onClick={() => setRejectingId(selectedPatient.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-brand-border text-slate rounded-xl text-[13px] font-bold hover:bg-brand-50 transition-colors">
                        <XCircle size={16} /> Decline
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto">
                    <PatientPreview patient={selectedPatient} compact />
                  </div>
                  {selectedPatient.relationshipStatus === 'active' && (
                    <div className="p-4 border-t border-brand-border flex gap-3">
                      <button type="button" onClick={() => navigate('/practitioner/chats')}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-forest text-white rounded-xl text-[13px] font-bold hover:bg-[#3d5636] transition-colors">
                        <MessageSquare size={15} /> Message
                      </button>
                      <button type="button" onClick={() => navigate('/practitioner/schedule')}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-brand-border text-slate rounded-xl text-[13px] font-bold hover:bg-brand-50 transition-colors">
                        <Calendar size={15} /> Schedule
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-[13px]">
              Select a client to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
