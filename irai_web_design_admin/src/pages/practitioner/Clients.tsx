import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, Users, MessageSquare, Calendar, ChevronRight, Plus } from 'lucide-react';
import { MOCK_PATIENTS } from '../../mockData';
import { cn } from '../../lib/utils';
import PatientPreview from '../../components/practitioner/PatientPreview';

const STATUS_TABS = ['All', 'Active', 'New', 'Completed'] as const;

export default function Clients() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<(typeof STATUS_TABS)[number]>('All');

  const selectedId = params.get('selected') ?? MOCK_PATIENTS[0]?.id;
  const selectedPatient = MOCK_PATIENTS.find(p => p.id === selectedId) ?? MOCK_PATIENTS[0];

  const filtered = MOCK_PATIENTS.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (filtered.length > 0 && !filtered.some(p => p.id === selectedId)) {
      setParams({ selected: filtered[0].id }, { replace: true });
    }
  }, [filtered, selectedId, setParams]);

  const selectPatient = (id: string) => setParams({ selected: id }, { replace: true });

  return (
    <div className="p-6 lg:p-8 h-full flex flex-col">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="small-caps text-gray-400 mb-1">Practitioner</p>
          <h1 className="serif text-4xl text-slate leading-tight">My Clients</h1>
          <p className="text-[13px] text-gray-400 mt-1">{MOCK_PATIENTS.length} total clients</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-forest text-white rounded-xl text-[13px] font-bold hover:bg-[#3d5636] transition-colors">
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or condition..."
            className="w-full bg-white border border-brand-border rounded-xl py-2.5 pl-10 pr-9 text-[13px] text-slate placeholder:text-gray-300 outline-none focus:border-forest/30 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-gray-300" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all',
                activeTab === tab
                  ? 'bg-slate text-white border-slate'
                  : 'bg-white text-gray-400 border-brand-border hover:border-forest/20',
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Split panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-0">
        {/* Client list */}
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
                    <p className="text-[11px] text-forest truncate">{patient.condition}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-gray-400">Next</p>
                    <p className="text-[11px] font-semibold text-slate">
                      {new Date(patient.nextAppointment + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Users size={28} className="mx-auto mb-3 text-gray-200" />
                <p className="text-[13px] text-gray-400">No clients found</p>
              </div>
            )}
          </div>
        </div>

        {/* Preview panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-220px)]">
          {selectedPatient ? (
            <>
              <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
                <p className="small-caps text-[8px] text-gray-400">Client Preview</p>
                <button
                  onClick={() => navigate(`/practitioner/clients/${selectedPatient.id}`)}
                  className="flex items-center gap-1 text-[12px] font-semibold text-forest hover:underline"
                >
                  Full profile <ChevronRight size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <PatientPreview patient={selectedPatient} compact />
              </div>
              <div className="p-4 border-t border-brand-border flex gap-3">
                <button
                  onClick={() => navigate('/practitioner/chats')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-forest text-white rounded-xl text-[13px] font-bold hover:bg-[#3d5636] transition-colors"
                >
                  <MessageSquare size={15} /> Message
                </button>
                <button
                  onClick={() => navigate('/practitioner/schedule')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-brand-border text-slate rounded-xl text-[13px] font-bold hover:bg-brand-50 transition-colors"
                >
                  <Calendar size={15} /> Schedule
                </button>
              </div>
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
