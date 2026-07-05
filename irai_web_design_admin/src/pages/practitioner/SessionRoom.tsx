import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Sparkles, CheckCircle2,
  ChevronDown, ChevronUp, Users, Clock, Save, ArrowLeft, AlertTriangle,
} from 'lucide-react';
import { MOCK_APPOINTMENTS, MOCK_GROUP_SESSIONS } from '../../mockData';
import { cn } from '../../lib/utils';

type Phase = 'joining' | 'live' | 'ending' | 'report';

const LIVE_CUES_1ON1 = [
  { delay: 5,  text: 'Patient voice tone: calm and cooperative' },
  { delay: 12, text: 'Mentioned sleep quality improved since last session' },
  { delay: 22, text: '⚠️ Patient reported mild dizziness this morning' },
  { delay: 35, text: 'Positive response to updated meal plan discussed' },
  { delay: 48, text: 'New symptom flagged: afternoon energy dip around 3 PM' },
];

const LIVE_CUES_GROUP = [
  { delay: 4,  text: '14 participants connected' },
  { delay: 10, text: 'Engagement level: High — minimal drop-offs' },
  { delay: 20, text: 'Participant R.K. joined 8 min late' },
  { delay: 45, text: '⚠️ Participant D.M. flagged knee discomfort in chat' },
];

function fmtTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export default function SessionRoom() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const isGroup = params.get('type') === 'group';

  const appt = MOCK_APPOINTMENTS.find(a => a.id === id);
  const groupSess = MOCK_GROUP_SESSIONS.find(g => g.id === id);
  const sessionTitle = isGroup ? (groupSess?.title ?? 'Group Session') : (appt?.patientName ?? 'Session');
  const sessionSub = isGroup
    ? `${groupSess?.enrolled ?? 0} participants · ${groupSess?.level}`
    : (appt?.type ?? 'follow-up');

  const [phase, setPhase] = useState<Phase>('joining');
  const [elapsed, setElapsed] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [liveNotes, setLiveNotes] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [painBefore, setPainBefore] = useState(5);
  const [painAfter, setPainAfter] = useState(3);
  const [openSoap, setOpenSoap] = useState<string | null>('subjective');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionDur = elapsed;

  useEffect(() => {
    if (phase !== 'joining') return;
    const t = setTimeout(() => setPhase('live'), 2500);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'live') return;
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    const cues = isGroup ? LIVE_CUES_GROUP : LIVE_CUES_1ON1;
    const timeouts = cues.map(c =>
      setTimeout(() => setLiveNotes(prev => [...prev, c.text]), c.delay * 1000),
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timeouts.forEach(clearTimeout);
    };
  }, [phase, isGroup]);

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

  return (
    <div className="min-h-screen bg-[#0d1a0c] flex flex-col">
      <AnimatePresence mode="wait">
        {phase === 'joining' && (
          <motion.div
            key="joining"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-8"
          >
            <div className="relative mb-10">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border border-white/10"
                  animate={{ scale: [1, 2.2 + i * 0.4], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  style={{ width: 80, height: 80, margin: 'auto' }}
                />
              ))}
              <div className="w-20 h-20 bg-white/[0.08] border border-white/15 rounded-full flex items-center justify-center relative z-10">
                <span className="font-serif text-3xl text-white/80">ir</span>
              </div>
            </div>
            <p className="small-caps text-[10px] text-white/30 mb-2">{isGroup ? 'Group Session' : '1-on-1 Session'}</p>
            <h2 className="serif text-4xl text-white text-center mb-2">{sessionTitle}</h2>
            <p className="text-[14px] text-white/40 mb-8 capitalize">{sessionSub}</p>
            <div className="flex items-center gap-2">
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-forest" />
              <p className="text-[13px] text-white/50">Connecting…</p>
            </div>
            <div className="mt-6 flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-4 py-2">
              <Sparkles size={12} className="text-amber-400" />
              <p className="text-[12px] text-white/50">AI Notetaker is ready</p>
            </div>
          </motion.div>
        )}

        {phase === 'live' && (
          <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/60 hover:text-white">
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[12px] font-bold text-white/80 uppercase tracking-widest">Live</span>
                    <span className="text-[12px] text-white/40 font-mono">{fmtTime(elapsed)}</span>
                  </div>
                  <p className="text-[15px] font-bold text-white mt-0.5">{sessionTitle}</p>
                  <p className="text-[11px] text-white/30 capitalize">{sessionSub}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-4 py-2">
                <Sparkles size={12} className="text-amber-400" />
                <p className="text-[11px] text-white/50">AI Notetaker active</p>
              </div>
            </div>

            {/* Main area */}
            <div className="flex-1 flex min-h-0">
              <div className="flex-1 p-4 flex flex-col gap-3">
                {isGroup ? (
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    {['R. Kumar', 'D. Martin', 'A. Singh', 'L. Park', 'M. Chen', 'S. Lee'].map((name, i) => (
                      <div key={name} className="rounded-2xl bg-[#1a2d18] border border-white/[0.06] flex flex-col items-center justify-center gap-2 min-h-[120px]">
                        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center font-bold', i === 3 ? 'bg-amber-900/40 text-amber-400 border border-amber-400/20' : 'bg-white/[0.08] text-white/60')}>
                          {initials(name)}
                        </div>
                        <p className="text-[11px] text-white/40">{name}</p>
                        {i === 3 && <p className="text-[9px] text-amber-400 uppercase">⚠️ flagged</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 relative rounded-2xl bg-[#1a2d18] border border-white/[0.06] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-2xl bg-white/[0.08] border border-white/10 flex items-center justify-center mx-auto mb-3">
                        <span className="font-bold text-3xl text-white/60">{initials(appt?.patientName ?? 'P')}</span>
                      </div>
                      <p className="text-[16px] font-bold text-white/70">{appt?.patientName}</p>
                      <p className="text-[11px] text-white/30 uppercase tracking-wider mt-1">Patient</p>
                    </div>
                    <div className="absolute top-4 right-4 w-36 h-24 rounded-xl bg-[#263d23] border border-white/10 flex flex-col items-center justify-center">
                      <span className="text-[11px] font-bold text-white/50">You</span>
                      {!camOn && <VideoOff size={14} className="text-white/30 mt-1" />}
                    </div>
                  </div>
                )}
              </div>

              {/* AI notes sidebar */}
              <div className="w-80 shrink-0 border-l border-white/[0.06] flex flex-col bg-black/20">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-400" />
                  <p className="text-[12px] font-bold text-amber-400 uppercase tracking-wider">Live AI Notes</p>
                  {liveNotes.length > 0 && (
                    <span className="ml-auto w-5 h-5 bg-amber-400 rounded-full text-[10px] font-bold text-black flex items-center justify-center">
                      {liveNotes.length}
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {liveNotes.length === 0 ? (
                    <p className="text-[12px] text-white/25 italic">Listening…</p>
                  ) : (
                    [...liveNotes].reverse().map((note, i) => (
                      <motion.p key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-[12px] text-white/60 leading-relaxed bg-white/[0.04] rounded-lg px-3 py-2">
                        {note}
                      </motion.p>
                    ))
                  )}
                </div>
                {isGroup && (
                  <div className="p-4 border-t border-white/[0.06]">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Participants</p>
                    <div className="flex items-center gap-2 text-white/50">
                      <Users size={14} />
                      <span className="text-[12px]">{groupSess?.enrolled ?? 14} connected</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="shrink-0 px-6 py-5 border-t border-white/[0.06] flex items-center justify-center gap-4">
              <button onClick={() => setMicOn(v => !v)} className={cn('w-12 h-12 rounded-2xl flex items-center justify-center transition-all', micOn ? 'bg-white/[0.08] border border-white/10' : 'bg-red-500/20 border border-red-500/30')}>
                {micOn ? <Mic size={20} className="text-white/70" /> : <MicOff size={20} className="text-red-400" />}
              </button>
              <button onClick={() => setCamOn(v => !v)} className={cn('w-12 h-12 rounded-2xl flex items-center justify-center transition-all', camOn ? 'bg-white/[0.08] border border-white/10' : 'bg-red-500/20 border border-red-500/30')}>
                {camOn ? <Video size={20} className="text-white/70" /> : <VideoOff size={20} className="text-red-400" />}
              </button>
              <button onClick={handleEnd} className="w-16 h-12 bg-red-500 rounded-2xl flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
                <PhoneOff size={22} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}

        {phase === 'ending' && (
          <motion.div key="ending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center">
            <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center mb-6">
              <Sparkles size={40} className="text-amber-400" />
            </motion.div>
            <h2 className="serif text-3xl text-white mb-2">Generating Notes</h2>
            <p className="text-[14px] text-white/35">AI is processing your session…</p>
          </motion.div>
        )}

        {phase === 'report' && (
          <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 bg-brand-50 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#f0f4ee] rounded-xl flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-forest" />
                </div>
                <div>
                  <p className="small-caps text-gray-400">Session Complete</p>
                  <h2 className="serif text-3xl text-slate">{sessionTitle}</h2>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <span className="text-[11px] px-3 py-1 rounded-full bg-[#f0f4ee] text-forest border border-forest/20 font-semibold uppercase">{isGroup ? 'Group' : '1-on-1'}</span>
                <span className="text-[11px] px-3 py-1 rounded-full bg-white border border-brand-border text-gray-400 flex items-center gap-1"><Clock size={11} /> {fmtTime(sessionDur)}</span>
                <span className="text-[11px] px-3 py-1 rounded-full bg-[#fdf3ec] text-terracotta border border-terracotta/20 flex items-center gap-1"><Sparkles size={11} /> AI Notes Ready</span>
              </div>

              {!isGroup && (
                <div className="bg-white rounded-2xl border border-brand-border p-5 mb-5 space-y-4">
                  <p className="small-caps text-gray-400">Pain Scale</p>
                  {[
                    { label: 'Before', value: painBefore, set: setPainBefore, color: 'bg-terracotta' },
                    { label: 'After', value: painAfter, set: setPainAfter, color: 'bg-forest' },
                  ].map(row => (
                    <div key={row.label}>
                      <div className="flex justify-between mb-2">
                        <span className="text-[13px] font-semibold">{row.label}</span>
                        <span className="text-[13px] font-bold">{row.value}/10</span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                          <button key={n} onClick={() => row.set(n)} className={cn('flex-1 h-2.5 rounded-full', n <= row.value ? row.color : 'bg-brand-50 border border-brand-border')} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-white rounded-2xl border border-brand-border overflow-hidden mb-5">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-brand-border">
                  <Sparkles size={16} className="text-amber-500" />
                  <p className="text-[14px] font-bold text-slate">AI-Generated SOAP Notes</p>
                  <span className="text-[11px] text-gray-400 ml-auto">97% confidence</span>
                </div>
                {[
                  { key: 'subjective', label: 'Subjective', text: 'Patient reports improvement in energy. Sleep quality 7/10. Mild afternoon fatigue around 3 PM.' },
                  { key: 'objective', label: 'Objective', text: `Session duration ${fmtTime(sessionDur)}. Patient calm and cooperative throughout.` },
                  { key: 'assessment', label: 'Assessment', text: 'Steady progress consistent with treatment goals. Supplement compliance high.' },
                  { key: 'plan', label: 'Plan', text: 'Review afternoon dietary habits. Book follow-up in 2 weeks.' },
                ].map(section => (
                  <div key={section.key} className="border-b border-brand-border last:border-0">
                    <button onClick={() => setOpenSoap(openSoap === section.key ? null : section.key)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-brand-50/50">
                      <span className="text-[13px] font-bold text-slate">{section.label}</span>
                      {openSoap === section.key ? <ChevronUp size={16} className="text-gray-300" /> : <ChevronDown size={16} className="text-gray-300" />}
                    </button>
                    {openSoap === section.key && <p className="px-5 pb-4 text-[13px] text-gray-500 leading-relaxed">{section.text}</p>}
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                {(isGroup
                  ? [{ text: 'D.M. reported knee discomfort — follow up required', severity: 'alert' as const }]
                  : [{ text: 'Afternoon fatigue — consider blood glucose check', severity: 'caution' as const }]
                ).map((flag, i) => (
                  <div key={i} className={cn('flex items-start gap-2 p-3 rounded-xl border text-[12px]',
                    flag.severity === 'alert' ? 'bg-[#fdf3ec] border-terracotta/20 text-terracotta' : 'bg-amber-50 border-amber-200 text-amber-700')}>
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    {flag.text}
                  </div>
                ))}
              </div>

              {saved ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={48} className="text-forest mx-auto mb-3" />
                  <p className="serif text-2xl text-slate">Notes Saved</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => navigate('/practitioner')} className="flex-1 py-3.5 rounded-xl border border-brand-border bg-white text-[14px] font-bold flex items-center justify-center gap-2">
                    <ArrowLeft size={16} /> Skip
                  </button>
                  <button onClick={handleSave} className="flex-1 py-3.5 rounded-xl bg-forest text-white text-[14px] font-bold flex items-center justify-center gap-2">
                    <Save size={16} /> Save to Record
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
