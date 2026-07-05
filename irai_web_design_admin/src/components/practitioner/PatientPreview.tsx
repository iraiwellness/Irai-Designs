import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Phone, Calendar, Activity, Plus,
  Sparkles, ChevronDown, ChevronUp, AlertTriangle, Info, CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Patient } from '../../types';
import { MOCK_AI_NOTES } from '../../mockData';
import { cn } from '../../lib/utils';

const SEVERITY_STYLE = {
  alert:   'bg-[#fdf3ec] border-terracotta/20 text-terracotta',
  caution: 'bg-amber-50 border-amber-200 text-amber-700',
  info:    'bg-[#f0f4ee] border-forest/20 text-forest',
} as const;

const MANUAL_NOTES = [
  { session: 10, date: 'Oct 12, 2024', text: 'Patient showing positive response to the new diet plan. Reduced sugar intake significantly. Vitals look stable.' },
  { session:  9, date: 'Sep 28, 2024', text: 'Discussed new meal prep strategy. Patient is more motivated this week. Blood pressure reading normal.' },
];

interface PatientPreviewProps {
  patient: Patient;
  compact?: boolean;
}

export default function PatientPreview({ patient, compact = false }: PatientPreviewProps) {
  const navigate = useNavigate();
  const aiNotes = MOCK_AI_NOTES.filter(n => n.patientId === patient.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'ai-notes'>('overview');
  const [openNote, setOpenNote] = useState<string | null>(aiNotes[0]?.id ?? null);
  const [openSoap, setOpenSoap] = useState<Record<string, string | null>>({});

  const toggleSoap = (noteId: string, section: string) => {
    setOpenSoap(prev => ({ ...prev, [noteId]: prev[noteId] === section ? null : section }));
  };

  return (
    <div className={cn('p-5', compact && 'p-5')}>
      {/* Patient header */}
      <div className="flex items-start gap-4 mb-6">
        <img src={patient.avatar} alt={patient.name} className="w-16 h-16 rounded-2xl object-cover border border-brand-border" />
        <div className="flex-1 min-w-0">
          <h2 className="serif text-2xl text-slate leading-tight">{patient.name}</h2>
          <p className="text-[13px] text-forest mt-0.5">{patient.condition}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#f0f4ee] text-forest font-semibold">Active</span>
            <span className="text-[11px] text-gray-400">
              Last visit {new Date(patient.lastConsultation + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
        {!compact && (
          <div className="flex gap-2 shrink-0">
            <button className="w-9 h-9 rounded-xl border border-brand-border flex items-center justify-center text-gray-400 hover:bg-brand-50">
              <Phone size={16} />
            </button>
            <button
              onClick={() => navigate('/practitioner/chats')}
              className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center text-white hover:bg-[#3d5636]"
            >
              <MessageSquare size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-brand-border mb-5">
        {(['overview', 'ai-notes'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider border-b-2 -mb-px transition-all',
              activeTab === tab ? 'border-forest text-forest' : 'border-transparent text-gray-400 hover:text-slate',
            )}
          >
            {tab === 'ai-notes' && <Sparkles size={12} />}
            {tab === 'overview' ? 'Overview' : 'AI Notes'}
            {tab === 'ai-notes' && aiNotes.length > 0 && (
              <span className="w-5 h-5 bg-amber-100 text-amber-600 rounded-full text-[10px] font-bold flex items-center justify-center">
                {aiNotes.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-brand-50 rounded-xl border border-brand-border p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-[#f0f4ee] rounded-xl flex items-center justify-center">
                  <Calendar size={16} className="text-forest" />
                </div>
                <div>
                  <p className="small-caps text-[8px] text-gray-400">Next Appt.</p>
                  <p className="text-[13px] font-bold text-slate">
                    {new Date(patient.nextAppointment + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="bg-brand-50 rounded-xl border border-brand-border p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-[#f0f4ee] rounded-xl flex items-center justify-center">
                  <Activity size={16} className="text-forest" />
                </div>
                <div>
                  <p className="small-caps text-[8px] text-gray-400">AI Notes</p>
                  <p className="text-[13px] font-bold text-slate">{aiNotes.length} sessions</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-50 rounded-xl border border-brand-border p-4 space-y-2">
              <p className="small-caps text-[8px] text-gray-400">Contact</p>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-400">Email</span>
                <span className="font-medium text-slate">{patient.email}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-400">Phone</span>
                <span className="font-medium text-slate">{patient.phone}</span>
              </div>
            </div>

            {!compact && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="small-caps text-gray-400">Consultation Notes</p>
                  <button className="flex items-center gap-1 text-[12px] font-semibold text-forest">
                    <Plus size={13} /> Add Note
                  </button>
                </div>
                {MANUAL_NOTES.map((note, i) => (
                  <div key={i} className="bg-brand-50 rounded-xl border border-brand-border p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold text-forest bg-[#f0f4ee] px-2 py-0.5 rounded-full">Session #{note.session}</span>
                      <span className="text-[11px] text-gray-400">{note.date}</span>
                    </div>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </section>
            )}
          </motion.div>
        )}

        {activeTab === 'ai-notes' && (
          <motion.div key="ai-notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <Sparkles size={14} className="text-amber-500 shrink-0" />
              <p className="text-[12px] text-amber-700 font-medium">
                AI-generated SOAP notes from {aiNotes.length} sessions.
              </p>
            </div>

            {aiNotes.length === 0 ? (
              <p className="text-center text-[13px] text-gray-400 py-8">No AI notes yet</p>
            ) : (
              aiNotes.slice(0, compact ? 2 : undefined).map(note => (
                <div key={note.id} className="border border-brand-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenNote(openNote === note.id ? null : note.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-brand-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                        <Sparkles size={14} className="text-amber-500" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate">Session #{note.sessionNumber}</p>
                        <p className="text-[11px] text-gray-400">
                          {new Date(note.date + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          · {note.aiConfidence}% confidence
                        </p>
                      </div>
                    </div>
                    {openNote === note.id ? <ChevronUp size={16} className="text-gray-300" /> : <ChevronDown size={16} className="text-gray-300" />}
                  </button>

                  <AnimatePresence>
                    {openNote === note.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-brand-border"
                      >
                        <div className="p-4 space-y-3">
                          <div className="flex gap-3">
                            <div className="flex-1 text-center bg-brand-50 rounded-xl p-2 border border-brand-border">
                              <p className="text-[10px] text-gray-400">Pain Before</p>
                              <p className="text-lg font-bold text-terracotta">{note.painBefore}</p>
                            </div>
                            <div className="flex-1 text-center bg-brand-50 rounded-xl p-2 border border-brand-border">
                              <p className="text-[10px] text-gray-400">Pain After</p>
                              <p className="text-lg font-bold text-forest">{note.painAfter}</p>
                            </div>
                          </div>

                          {(['subjective', 'objective', 'assessment', 'plan'] as const).map(section => {
                            const labels = { subjective: 'S · Subjective', objective: 'O · Objective', assessment: 'A · Assessment', plan: 'P · Plan' };
                            const isOpen = openSoap[note.id] === section;
                            return (
                              <div key={section} className="border border-brand-border rounded-lg overflow-hidden">
                                <button
                                  onClick={() => toggleSoap(note.id, section)}
                                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-brand-50/50"
                                >
                                  <span className="text-[12px] font-bold text-slate">{labels[section]}</span>
                                  {isOpen ? <ChevronUp size={12} className="text-gray-300" /> : <ChevronDown size={12} className="text-gray-300" />}
                                </button>
                                {isOpen && (
                                  <p className="px-3 pb-3 text-[12px] text-gray-500 leading-relaxed">{note.soap[section]}</p>
                                )}
                              </div>
                            );
                          })}

                          {note.flags.map((flag, fi) => (
                            <div key={fi} className={cn('flex items-start gap-2 p-2.5 rounded-xl border text-[11px]', SEVERITY_STYLE[flag.severity])}>
                              {flag.severity !== 'info' ? <AlertTriangle size={12} className="shrink-0 mt-0.5" /> : <Info size={12} className="shrink-0 mt-0.5" />}
                              {flag.text}
                            </div>
                          ))}

                          {!compact && (
                            <div className="flex gap-2">
                              <button className="flex-1 py-2 rounded-xl border border-brand-border text-[12px] font-bold text-slate hover:bg-brand-50">
                                Edit Notes
                              </button>
                              <button className="flex-1 py-2 rounded-xl bg-forest text-white text-[12px] font-bold flex items-center justify-center gap-1.5">
                                <CheckCircle2 size={13} /> Approve
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}

            {compact && aiNotes.length > 2 && (
              <p className="text-center text-[12px] text-forest font-semibold">
                +{aiNotes.length - 2} more notes in full profile
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
