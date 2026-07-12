import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, MessageSquare, Phone, Calendar, Activity,
  FileText, Plus, Sparkles, ChevronDown, ChevronUp,
  AlertTriangle, Info, CheckCircle2,
} from 'lucide-react';
import { MOCK_PATIENTS, MOCK_AI_NOTES } from '../../mockData';
import { cn } from '../../lib/utils';

const SEVERITY_STYLE = {
  alert:   'bg-[#fdf3ec] border-terracotta/20 text-terracotta',
  caution: 'bg-amber-50 border-amber-200 text-amber-700',
  info:    'bg-[#f0f4ee] border-forest/20 text-forest',
} as const;

export default function PatientDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const patient  = MOCK_PATIENTS.find(p => p.id === id) ?? MOCK_PATIENTS[0];
  const aiNotes  = MOCK_AI_NOTES.filter(n => n.patientId === patient.id);

  const [activeTab,  setActiveTab]  = useState<'overview' | 'ai-notes'>('overview');
  const [openNote,   setOpenNote]   = useState<string | null>(aiNotes[0]?.id ?? null);
  const [openSoap,   setOpenSoap]   = useState<Record<string, string | null>>({});

  const toggleSoap = (noteId: string, section: string) => {
    setOpenSoap(prev => ({
      ...prev,
      [noteId]: prev[noteId] === section ? null : section,
    }));
  };

  const manualNotes = [
    { session: 10, date: 'Oct 12, 2024', text: 'Patient showing positive response to the new diet plan. Reduced sugar intake significantly. Vitals look stable.' },
    { session:  9, date: 'Sep 28, 2024', text: 'Discussed new meal prep strategy. Patient is more motivated this week. Blood pressure reading normal.' },
  ];

  return (
    <div className="min-h-full bg-brand-50 pb-8">

      {/* ── Dark hero header ── */}
      <div className="bg-gradient-to-br from-[#263d23] to-[#192b16] relative overflow-hidden" style={{ minHeight: 230 }}>
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/[0.03] rounded-full" />
        <div className="absolute bottom-0 -left-12 w-40 h-40 bg-white/[0.03] rounded-full blur-2xl" />

        <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-white/10 border border-white/15 rounded-full flex items-center justify-center active:scale-95 transition-all"
          >
            <ArrowLeft size={16} className="text-white" />
          </button>
          <button className="w-9 h-9 bg-white/10 border border-white/15 rounded-full flex items-center justify-center active:scale-95 transition-all">
            <Phone size={16} className="text-white" />
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center pb-7 px-5">
          <img
            src={patient.avatar}
            alt={patient.name}
            className="w-20 h-20 rounded-[24px] border-4 border-white/20 shadow-xl object-cover mb-3"
          />
          <h1 className="serif text-[24px] text-white leading-none mb-1">{patient.name}</h1>
          <p className="small-caps text-[8px] text-white/40">{patient.condition}</p>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="bg-white border-b border-brand-border px-5 flex gap-1">
        {(['overview', 'ai-notes'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all',
              activeTab === tab
                ? 'border-forest text-forest'
                : 'border-transparent text-gray-400',
            )}
          >
            {tab === 'ai-notes' && <Sparkles size={11} />}
            {tab === 'overview' ? 'Overview' : 'AI Notes'}
            {tab === 'ai-notes' && aiNotes.length > 0 && (
              <span className="ml-0.5 w-4 h-4 bg-amber-100 text-amber-600 rounded-full text-[8px] font-bold flex items-center justify-center">
                {aiNotes.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── Overview tab ── */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5 space-y-4"
          >
            {/* Action buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-forest text-white py-3 rounded-2xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all">
                <MessageSquare size={15} /> Message
              </button>
              <button className="flex-1 bg-white border border-brand-border text-slate py-3 rounded-2xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all">
                <FileText size={15} /> View Plans
              </button>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: Calendar, label: 'Next Appt.',
                  value: new Date(patient.nextAppointment + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  bg: 'bg-[#f0f4ee]', iconColor: 'text-forest',
                },
                {
                  icon: Activity, label: 'Status',
                  value: 'Active',
                  bg: 'bg-[#f0f4ee]', iconColor: 'text-forest',
                },
              ].map(({ icon: Icon, label, value, bg, iconColor }) => (
                <div key={label} className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 flex items-center gap-3">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', bg)}>
                    <Icon size={16} className={iconColor} />
                  </div>
                  <div>
                    <p className="small-caps text-[7px] text-gray-400">{label}</p>
                    <p className="text-[11px] font-bold text-slate">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-3">
              <p className="small-caps text-gray-400">Contact Info</p>
              {[
                { label: 'Email', value: patient.email },
                { label: 'Phone', value: patient.phone },
              ].map(({ label, value }, i) => (
                <div key={label}>
                  {i > 0 && <div className="h-px bg-brand-border opacity-50" />}
                  <div className={cn('flex justify-between', i > 0 && 'pt-3')}>
                    <span className="small-caps text-[7px] text-gray-400">{label}</span>
                    <span className="text-[11px] font-medium text-slate">{value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Manual notes */}
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="small-caps text-gray-400">Consultation Notes</p>
                <button className="flex items-center gap-1 small-caps text-[8px] text-forest">
                  <Plus size={11} /> Add Note
                </button>
              </div>
              {manualNotes.map((note, i) => (
                <div key={i} className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="small-caps text-[7px] text-forest bg-[#f0f4ee] px-2 py-0.5 rounded-full border border-forest/20">
                      Session #{note.session}
                    </span>
                    <span className="small-caps text-[7px] text-gray-400">{note.date}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{note.text}</p>
                </div>
              ))}
            </section>
          </motion.div>
        )}

        {/* ── AI Notes tab ── */}
        {activeTab === 'ai-notes' && (
          <motion.div
            key="ai-notes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5 space-y-4"
          >
            {/* AI badge */}
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl p-3">
              <Sparkles size={14} className="text-amber-500 shrink-0" />
              <p className="text-[10px] text-amber-700 font-medium">
                AI-generated SOAP notes from {aiNotes.length} recorded sessions. Review and edit before finalising.
              </p>
            </div>

            {aiNotes.length === 0 ? (
              <div className="text-center py-16">
                <Sparkles size={28} className="mx-auto mb-3 text-gray-200" />
                <p className="small-caps text-[9px] text-gray-300">No AI notes yet</p>
                <p className="text-[10px] text-gray-300 mt-1">Complete a session to generate AI notes</p>
              </div>
            ) : (
              aiNotes.map((note, noteIdx) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: noteIdx * 0.06 }}
                  className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden"
                >
                  {/* Note header — tap to expand/collapse */}
                  <button
                    onClick={() => setOpenNote(openNote === note.id ? null : note.id)}
                    className="w-full flex items-center justify-between p-4 text-left active:bg-brand-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                        <Sparkles size={15} className="text-amber-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[12px] font-bold text-slate">Session #{note.sessionNumber}</p>
                          <span className="small-caps text-[6px] px-1.5 py-0.5 rounded-full bg-[#f0f4ee] text-forest border border-forest/20 capitalize">
                            {note.sessionType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="small-caps text-[7px] text-gray-400">
                            {new Date(note.date + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <span className="text-gray-200">·</span>
                          <p className="small-caps text-[7px] text-gray-400">{note.duration} min</p>
                          <span className="text-gray-200">·</span>
                          <p className="small-caps text-[7px] text-amber-500">{note.aiConfidence}% confidence</p>
                        </div>
                      </div>
                    </div>
                    {openNote === note.id
                      ? <ChevronUp size={15} className="text-gray-300 shrink-0" />
                      : <ChevronDown size={15} className="text-gray-300 shrink-0" />
                    }
                  </button>

                  <AnimatePresence>
                    {openNote === note.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden border-t border-brand-border"
                      >
                        <div className="p-4 space-y-3">

                          {/* Pain delta */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 text-center bg-brand-50 rounded-xl p-2.5 border border-brand-border">
                              <p className="small-caps text-[7px] text-gray-400">Pain Before</p>
                              <p className="text-[18px] font-bold text-terracotta leading-none mt-0.5">{note.painBefore}</p>
                              <p className="small-caps text-[6px] text-gray-400">/ 10</p>
                            </div>
                            <div className="text-gray-300 text-lg">→</div>
                            <div className="flex-1 text-center bg-brand-50 rounded-xl p-2.5 border border-brand-border">
                              <p className="small-caps text-[7px] text-gray-400">Pain After</p>
                              <p className="text-[18px] font-bold text-forest leading-none mt-0.5">{note.painAfter}</p>
                              <p className="small-caps text-[6px] text-gray-400">/ 10</p>
                            </div>
                            <div className="flex-1 text-center bg-[#f0f4ee] rounded-xl p-2.5 border border-forest/20">
                              <p className="small-caps text-[7px] text-forest">Reduction</p>
                              <p className="text-[18px] font-bold text-forest leading-none mt-0.5">
                                -{note.painBefore - note.painAfter}
                              </p>
                              <p className="small-caps text-[6px] text-gray-400">pts</p>
                            </div>
                          </div>

                          {/* SOAP accordion */}
                          <div className="rounded-xl border border-brand-border overflow-hidden">
                            {([
                              { key: 'subjective', label: 'S · Subjective',  sub: 'Patient-reported' },
                              { key: 'objective',  label: 'O · Objective',   sub: 'Observed'         },
                              { key: 'assessment', label: 'A · Assessment',  sub: 'Clinical impression' },
                              { key: 'plan',       label: 'P · Plan',        sub: 'Next steps'       },
                            ] as const).map((section, si) => {
                              const isOpen = openSoap[note.id] === section.key;
                              return (
                                <div key={section.key} className={cn(si > 0 && 'border-t border-brand-border')}>
                                  <button
                                    onClick={() => toggleSoap(note.id, section.key)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 text-left active:bg-brand-50 transition-colors"
                                  >
                                    <div>
                                      <p className="text-[10px] font-bold text-slate">{section.label}</p>
                                      <p className="small-caps text-[7px] text-gray-400">{section.sub}</p>
                                    </div>
                                    {isOpen
                                      ? <ChevronUp size={12} className="text-gray-300 shrink-0" />
                                      : <ChevronDown size={12} className="text-gray-300 shrink-0" />
                                    }
                                  </button>
                                  <AnimatePresence>
                                    {isOpen && (
                                      <motion.p
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.18 }}
                                        className="overflow-hidden px-3 pb-3 text-[10px] text-gray-500 leading-relaxed"
                                      >
                                        {note.soap[section.key]}
                                      </motion.p>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>

                          {/* Flags */}
                          {note.flags.length > 0 && (
                            <div className="space-y-1.5">
                              {note.flags.map((flag, fi) => (
                                <div
                                  key={fi}
                                  className={cn(
                                    'flex items-start gap-2 p-2.5 rounded-xl border text-[9px] font-medium',
                                    SEVERITY_STYLE[flag.severity],
                                  )}
                                >
                                  {flag.severity === 'alert'   && <AlertTriangle size={11} className="shrink-0 mt-0.5" />}
                                  {flag.severity === 'caution' && <AlertTriangle size={11} className="shrink-0 mt-0.5" />}
                                  {flag.severity === 'info'    && <Info size={11} className="shrink-0 mt-0.5" />}
                                  {flag.text}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Edit / approve row */}
                          <div className="flex gap-2 pt-1">
                            <button className="flex-1 py-2 rounded-xl border border-brand-border bg-brand-50 text-slate text-[10px] font-bold active:scale-[0.98] transition-all">
                              Edit Notes
                            </button>
                            <button className="flex-1 py-2 rounded-xl bg-forest text-white text-[10px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all">
                              <CheckCircle2 size={11} /> Approve
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
