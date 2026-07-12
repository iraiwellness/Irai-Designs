import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff,
  Sparkles, CheckCircle2, ChevronDown, ChevronUp,
  Users, Clock, Save, ArrowLeft, AlertTriangle, Info,
} from 'lucide-react';
import { MOCK_APPOINTMENTS, MOCK_GROUP_SESSIONS } from '../../mockData';
import { cn } from '../../lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'joining' | 'live' | 'ending' | 'report';

// ── Live AI note cues ─────────────────────────────────────────────────────────

const LIVE_CUES_1ON1 = [
  { delay: 5,  text: 'Patient voice tone: calm and cooperative' },
  { delay: 12, text: 'Mentioned sleep quality improved since last session' },
  { delay: 22, text: '⚠️ Patient reported mild dizziness this morning' },
  { delay: 35, text: 'Positive response to updated meal plan discussed' },
  { delay: 48, text: 'New symptom flagged: afternoon energy dip around 3 PM' },
  { delay: 62, text: 'Patient confirmed supplement compliance — 6/7 days' },
];

const LIVE_CUES_GROUP = [
  { delay: 4,  text: '14 participants connected' },
  { delay: 10, text: 'Engagement level: High — minimal drop-offs' },
  { delay: 20, text: 'Participant R.K. joined 8 min late' },
  { delay: 32, text: 'Chat activity spike — possible question incoming' },
  { delay: 45, text: '⚠️ Participant D.M. flagged knee discomfort in chat' },
  { delay: 58, text: 'Overall group energy sustaining well' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PractitionerSessionRoom() {
  const { id }              = useParams<{ id: string }>();
  const [params]            = useSearchParams();
  const navigate            = useNavigate();
  const isGroup             = params.get('type') === 'group';

  // Resolve session info
  const appt      = MOCK_APPOINTMENTS.find(a => a.id === id);
  const groupSess = MOCK_GROUP_SESSIONS.find(g => g.id === id);
  const sessionTitle = isGroup
    ? (groupSess?.title ?? 'Group Session')
    : (appt?.patientName ?? 'Session');
  const sessionSub = isGroup
    ? `${groupSess?.enrolled ?? 0} participants · ${groupSess?.level}`
    : (appt?.type ?? 'follow-up');

  // Phase state
  const [phase,      setPhase]      = useState<Phase>('joining');
  const [elapsed,    setElapsed]    = useState(0);
  const [micOn,      setMicOn]      = useState(true);
  const [camOn,      setCamOn]      = useState(true);
  const [showNotes,  setShowNotes]  = useState(false);
  const [liveNotes,  setLiveNotes]  = useState<string[]>([]);
  const [saved,      setSaved]      = useState(false);

  // Report state
  const [painBefore, setPainBefore] = useState(5);
  const [painAfter,  setPainAfter]  = useState(3);
  const [openSoap,   setOpenSoap]   = useState<string | null>('subjective');

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionDur  = elapsed; // captured when ending

  // ── Phase transitions ──────────────────────────────────────────────────────

  // joining → live after 2.5s
  useEffect(() => {
    if (phase !== 'joining') return;
    const t = setTimeout(() => setPhase('live'), 2500);
    return () => clearTimeout(t);
  }, [phase]);

  // live: tick timer + reveal AI cues
  useEffect(() => {
    if (phase !== 'live') return;
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);

    const cues = isGroup ? LIVE_CUES_GROUP : LIVE_CUES_1ON1;
    const timeouts = cues.map(c =>
      setTimeout(() => setLiveNotes(prev => [...prev, c.text]), c.delay * 1000)
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timeouts.forEach(clearTimeout);
    };
  }, [phase, isGroup]);

  // ending → report after 2.5s
  useEffect(() => {
    if (phase !== 'ending') return;
    const t = setTimeout(() => setPhase('report'), 2500);
    return () => clearTimeout(t);
  }, [phase]);

  const handleEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('ending');
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => navigate('/practitioner', { replace: true }), 1800);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black md:flex md:items-center md:justify-center md:p-4">
      <div className="w-full min-h-screen md:min-h-0 md:max-w-xl md:min-h-[720px] md:rounded-3xl md:shadow-[0_0_100px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">

          {/* ── Joining ── */}
          {phase === 'joining' && (
            <motion.div
              key="joining"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#1b2e18] to-[#0e1b0c] px-8"
            >
              {/* Pulsing rings */}
              <div className="relative mb-10">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border border-white/10"
                    animate={{ scale: [1, 2.2 + i * 0.4], opacity: [0.4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
                    style={{ width: 72, height: 72, margin: 'auto' }}
                  />
                ))}
                <div className="w-18 h-18 w-[72px] h-[72px] bg-white/[0.08] border border-white/15 rounded-full flex items-center justify-center relative z-10">
                  <span className="font-serif text-2xl text-white/80">ir</span>
                </div>
              </div>

              <p className="small-caps text-[8px] text-white/30 mb-2 tracking-widest">
                {isGroup ? 'Group Session' : '1-on-1 Session'}
              </p>
              <h2 className="serif text-[26px] text-white text-center leading-tight mb-1">
                {sessionTitle}
              </h2>
              <p className="text-[10px] text-white/40 mb-8 capitalize">{sessionSub}</p>

              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-forest"
                />
                <p className="text-[11px] text-white/50">Connecting…</p>
              </div>

              <div className="mt-6 flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-4 py-2">
                <Sparkles size={11} className="text-amber-400" />
                <p className="text-[9px] text-white/50">AI Notetaker is ready</p>
              </div>
            </motion.div>
          )}

          {/* ── Live ── */}
          {phase === 'live' && (
            <motion.div
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col bg-[#0d1a0c]"
            >
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 pt-10 pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-red-500"
                  />
                  <p className="text-[11px] font-bold text-white/80 uppercase tracking-widest">Live</p>
                  <span className="text-[11px] text-white/40 font-mono">{fmtTime(elapsed)}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-3 py-1">
                  <Sparkles size={10} className="text-amber-400" />
                  <p className="text-[8px] text-white/50">AI Notetaker</p>
                </div>
              </div>

              {/* Session title strip */}
              <div className="px-5 pb-3 shrink-0">
                <p className="text-[13px] font-bold text-white truncate">{sessionTitle}</p>
                <p className="small-caps text-[7px] text-white/30 capitalize">{sessionSub}</p>
              </div>

              {/* Main video area */}
              <div className="flex-1 px-3 pb-3 flex flex-col gap-2 min-h-0">
                {isGroup ? (
                  // Group: 2×2 participant grid
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    {['R. Kumar', 'D. Martin', 'A. Singh', 'L. Park'].map((name, i) => (
                      <div key={name} className="rounded-2xl bg-[#1a2d18] border border-white/[0.06] flex flex-col items-center justify-center gap-2">
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm',
                          i === 2 ? 'bg-amber-900/40 text-amber-400 border border-amber-400/20' : 'bg-white/[0.08] text-white/60',
                        )}>
                          {initials(name)}
                        </div>
                        <p className="text-[9px] text-white/40 font-medium">{name}</p>
                        {i === 2 && <p className="text-[7px] text-amber-400 uppercase tracking-widest">⚠️ flagged</p>}
                      </div>
                    ))}
                    {/* Participants count overlay */}
                    <div className="rounded-2xl bg-white/[0.04] border border-dashed border-white/10 flex flex-col items-center justify-center gap-1">
                      <Users size={16} className="text-white/20" />
                      <p className="text-[9px] text-white/25">+{(groupSess?.enrolled ?? 14) - 4} more</p>
                    </div>
                  </div>
                ) : (
                  // 1-on-1: single large client tile + self-view
                  <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#1a2d18] border border-white/[0.06]">
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      {appt?.patientId && (
                        <div className="w-20 h-20 rounded-2xl bg-white/[0.08] border border-white/10 flex items-center justify-center">
                          <span className="font-bold text-2xl text-white/60">{initials(appt.patientName)}</span>
                        </div>
                      )}
                      <p className="text-[12px] font-bold text-white/70">{appt?.patientName}</p>
                      <p className="small-caps text-[7px] text-white/30">Patient</p>
                    </div>
                    {/* Self view */}
                    <div className="absolute top-3 right-3 w-16 h-20 rounded-xl bg-[#263d23] border border-white/10 flex flex-col items-center justify-center gap-1">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white/50">ME</span>
                      </div>
                      {!camOn && <VideoOff size={10} className="text-white/30" />}
                    </div>
                  </div>
                )}

                {/* Live AI notes strip */}
                <AnimatePresence>
                  {showNotes && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 120, opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="rounded-2xl bg-black/40 border border-white/[0.06] overflow-hidden shrink-0"
                    >
                      <div className="p-3 h-full overflow-y-auto space-y-1.5">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Sparkles size={10} className="text-amber-400" />
                          <p className="text-[8px] text-amber-400 uppercase tracking-widest font-bold">Live AI Notes</p>
                        </div>
                        {liveNotes.length === 0 ? (
                          <p className="text-[9px] text-white/25 italic">Listening…</p>
                        ) : (
                          [...liveNotes].reverse().map((note, i) => (
                            <motion.p
                              key={i}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-[9px] text-white/55 leading-relaxed"
                            >
                              · {note}
                            </motion.p>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="shrink-0 px-5 pb-10 pt-3">
                <div className="flex items-center justify-between">
                  {/* Mic */}
                  <button
                    onClick={() => setMicOn(v => !v)}
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95',
                      micOn ? 'bg-white/[0.08] border border-white/10' : 'bg-red-500/20 border border-red-500/30',
                    )}
                  >
                    {micOn ? <Mic size={18} className="text-white/70" /> : <MicOff size={18} className="text-red-400" />}
                  </button>

                  {/* Camera */}
                  <button
                    onClick={() => setCamOn(v => !v)}
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95',
                      camOn ? 'bg-white/[0.08] border border-white/10' : 'bg-red-500/20 border border-red-500/30',
                    )}
                  >
                    {camOn ? <Video size={18} className="text-white/70" /> : <VideoOff size={18} className="text-red-400" />}
                  </button>

                  {/* AI Notes toggle */}
                  <button
                    onClick={() => setShowNotes(v => !v)}
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 relative',
                      showNotes ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-white/[0.08] border border-white/10',
                    )}
                  >
                    <Sparkles size={18} className={showNotes ? 'text-amber-400' : 'text-white/70'} />
                    {liveNotes.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full text-[8px] font-bold text-black flex items-center justify-center">
                        {liveNotes.length}
                      </span>
                    )}
                  </button>

                  {/* End session */}
                  <button
                    onClick={handleEnd}
                    className="w-14 h-12 bg-red-500 rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-lg shadow-red-500/30"
                  >
                    <PhoneOff size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Ending ── */}
          {phase === 'ending' && (
            <motion.div
              key="ending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#1b2e18] to-[#0e1b0c] px-8"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center mb-6"
              >
                <Sparkles size={32} className="text-amber-400" />
              </motion.div>
              <h2 className="serif text-[24px] text-white text-center leading-tight mb-2">
                Generating Notes
              </h2>
              <p className="text-[10px] text-white/35 text-center">
                AI is processing your session…
              </p>
              <div className="flex gap-1.5 mt-6">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/30"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Report ── */}
          {phase === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 bg-brand-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-white border-b border-brand-border px-6 pt-10 pb-5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 bg-[#f0f4ee] rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-forest" />
                  </div>
                  <div>
                    <p className="small-caps text-gray-400 text-[7px]">Session Complete</p>
                    <h2 className="serif text-[22px] leading-none text-slate">{sessionTitle}</h2>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <span className="small-caps text-[7px] px-2.5 py-1 rounded-full bg-[#f0f4ee] text-forest border border-forest/20">
                    {isGroup ? 'Group' : '1-on-1'}
                  </span>
                  <span className="small-caps text-[7px] px-2.5 py-1 rounded-full bg-brand-50 border border-brand-border text-gray-400 flex items-center gap-1">
                    <Clock size={9} /> {fmtTime(sessionDur)}
                  </span>
                  <span className="small-caps text-[7px] px-2.5 py-1 rounded-full bg-[#fdf3ec] text-terracotta border border-terracotta/20 flex items-center gap-1">
                    <Sparkles size={9} /> AI Notes Ready
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4 pb-24">

                {/* Pain before / after */}
                {!isGroup && (
                  <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-3">
                    <p className="small-caps text-gray-400">Pain Scale (Patient-Reported)</p>
                    {[
                      { label: 'Before Session', value: painBefore, set: setPainBefore, color: 'bg-terracotta' },
                      { label: 'After Session',  value: painAfter,  set: setPainAfter,  color: 'bg-forest'    },
                    ].map(row => (
                      <div key={row.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[10px] font-semibold text-slate">{row.label}</p>
                          <span className="text-[11px] font-bold text-slate">{row.value}/10</span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                            <button
                              key={n}
                              onClick={() => row.set(n)}
                              className={cn(
                                'flex-1 h-2 rounded-full transition-all',
                                n <= row.value ? row.color : 'bg-brand-50 border border-brand-border',
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI SOAP Notes */}
                <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-2.5 px-4 py-3 border-b border-brand-border">
                    <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                      <Sparkles size={13} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate">AI-Generated SOAP Notes</p>
                      <p className="small-caps text-[7px] text-gray-400">97% confidence · tap to expand</p>
                    </div>
                  </div>

                  {/* SOAP sections */}
                  {[
                    {
                      key:   'subjective',
                      label: 'Subjective',
                      sub:   'Patient-reported',
                      text:  isGroup
                        ? `Group maintained high engagement throughout the session. One participant flagged knee discomfort during lateral sequences. Overall group energy sustained well with minimal drop-offs. Verbal feedback during cool-down was positive.`
                        : `Patient reports improvement in overall energy since the last session. Sleep quality has increased from 5/10 to 7/10. Still experiencing mild afternoon fatigue around 3 PM. Stress levels moderate due to upcoming work deadlines.`,
                    },
                    {
                      key:   'objective',
                      label: 'Objective',
                      sub:   'Observed in session',
                      text:  isGroup
                        ? `${groupSess?.enrolled ?? 14} participants attended. Session duration ${fmtTime(sessionDur)} of ${groupSess?.duration ?? 45} minutes planned. All sequences completed as per plan. One modification required for flagged participant.`
                        : `Session duration ${fmtTime(sessionDur)}. Patient appeared well-rested. Voice calm and cooperative throughout. Positive verbal and non-verbal engagement. No concerning physical indicators observed via video.`,
                    },
                    {
                      key:   'assessment',
                      label: 'Assessment',
                      sub:   'Clinical impression',
                      text:  isGroup
                        ? `Group progressing well overall. Flagged participant (D.M.) should be contacted individually to assess knee issue before next session. Group cohesion is strong — consistent attendance pattern.`
                        : `Patient demonstrating steady progress consistent with treatment goals. Supplement compliance high at 6/7 days. Afternoon fatigue pattern warrants further dietary investigation — possible blood sugar irregularity.`,
                    },
                    {
                      key:   'plan',
                      label: 'Plan',
                      sub:   'Next steps',
                      text:  isGroup
                        ? `Follow up with D.M. regarding knee discomfort. Prepare modified sequence for next session. Continue current program structure. Review group progress at 4-week milestone.`
                        : `Review afternoon dietary habits — trial a protein-rich snack at 2 PM. Continue current supplement protocol. Book follow-up in 2 weeks. Consider blood glucose monitoring if fatigue persists.`,
                    },
                  ].map(section => (
                    <div key={section.key} className="border-b border-brand-border last:border-0">
                      <button
                        onClick={() => setOpenSoap(openSoap === section.key ? null : section.key)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left active:bg-brand-50 transition-colors"
                      >
                        <div>
                          <p className="text-[11px] font-bold text-slate">{section.label}</p>
                          <p className="small-caps text-[7px] text-gray-400">{section.sub}</p>
                        </div>
                        {openSoap === section.key
                          ? <ChevronUp size={14} className="text-gray-300 shrink-0" />
                          : <ChevronDown size={14} className="text-gray-300 shrink-0" />
                        }
                      </button>
                      <AnimatePresence>
                        {openSoap === section.key && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="px-4 pb-4 text-[11px] text-gray-500 leading-relaxed">
                              {section.text}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Flags */}
                <div className="space-y-2">
                  <p className="small-caps text-gray-400 px-1">AI Flags</p>
                  {(isGroup
                    ? [
                        { text: 'D.M. reported knee discomfort — follow up required', severity: 'alert' as const },
                        { text: 'One late join (R.K.) — auto-noted in attendance', severity: 'info' as const },
                      ]
                    : [
                        { text: 'Afternoon fatigue pattern — consider blood glucose check', severity: 'caution' as const },
                        { text: 'Supplement compliance 6/7 — discuss adherence', severity: 'info' as const },
                      ]
                  ).map((flag, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-start gap-2.5 p-3 rounded-xl border text-[10px] font-medium',
                        flag.severity === 'alert'   && 'bg-[#fdf3ec] border-terracotta/20 text-terracotta',
                        flag.severity === 'caution' && 'bg-amber-50 border-amber-200 text-amber-700',
                        flag.severity === 'info'    && 'bg-[#f0f4ee] border-forest/20 text-forest',
                      )}
                    >
                      {flag.severity === 'alert'   && <AlertTriangle size={13} className="shrink-0 mt-0.5" />}
                      {flag.severity === 'caution' && <AlertTriangle size={13} className="shrink-0 mt-0.5" />}
                      {flag.severity === 'info'    && <Info size={13} className="shrink-0 mt-0.5" />}
                      {flag.text}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <AnimatePresence mode="wait">
                  {saved ? (
                    <motion.div
                      key="saved"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center py-6 gap-3"
                    >
                      <div className="w-14 h-14 bg-[#f0f4ee] rounded-full flex items-center justify-center">
                        <CheckCircle2 size={28} className="text-forest" />
                      </div>
                      <p className="serif text-[20px] text-slate">Notes Saved</p>
                      <p className="small-caps text-[8px] text-gray-400">Returning to dashboard…</p>
                    </motion.div>
                  ) : (
                    <motion.div key="actions" className="flex gap-3">
                      <button
                        onClick={() => navigate('/practitioner', { replace: true })}
                        className="flex-1 py-3.5 rounded-xl border border-brand-border bg-white text-slate text-[12px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                      >
                        <ArrowLeft size={14} /> Skip
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex-1 py-3.5 rounded-xl bg-forest text-white text-[12px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
                      >
                        <Save size={14} /> Save to Record
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
