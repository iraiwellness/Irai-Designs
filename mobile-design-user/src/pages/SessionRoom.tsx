/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Users,
  Sparkles,
  Brain,
  CheckCircle2,
  ShieldAlert,
  Leaf,
  FileText,
  MessageSquare,
  ChevronRight,
  Clock,
  Stethoscope,
} from "lucide-react";
import { GROUP_SESSIONS, MOCK_SESSIONS } from "../constants";
import { cn } from "../lib/utils";

type Phase = "joining" | "live" | "ending" | "report";

const POSE_SEQUENCE = [
  { name: "Child's Pose", cue: "Settle into your base. Soften the hips." },
  { name: "Cat-Cow", cue: "Inhale arch, exhale round. Follow the breath." },
  { name: "Supported Bridge", cue: "Press into your feet. Lift gently from the pelvis." },
  { name: "Legs-Up-The-Wall", cue: "Let the legs be heavy. Drain the tension out." },
  { name: "Shavasana", cue: "Nothing to do. Just arrive." },
];

const AI_NOTES = [
  { flag: false, text: "Breath pattern was steady throughout. No distress markers detected." },
  { flag: false, text: "Cat-Cow completed smoothly. Spinal range within safe parameters." },
  { flag: true, text: "Slight pause noted during Bridge transition. Flagged for therapist review." },
  { flag: false, text: "Parasympathetic activation likely achieved via Shavasana close." },
];

const NEXT_SESSION_RECS = [
  "Extend Cat-Cow to 5 min - mobility appears to be improving.",
  "Add a bolster under the sacrum for Supported Bridge to reduce lumbar load.",
  "Open with Legs-Up-The-Wall for faster pain relief before active poses.",
];

const GROUP_PARTICIPANTS = [
  { initials: "AK", bg: "#6b5b95" },
  { initials: "BS", bg: "#4a7b9d" },
  { initials: "MT", bg: "#5e8b5a" },
  { initials: "LR", bg: "#c07a4a" },
];

export default function SessionRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("id") || "";
  const sessionType = searchParams.get("type") || "personal";
  const isGroup = sessionType === "group";

  const [phase, setPhase] = useState<Phase>("joining");
  const [elapsed, setElapsed] = useState(0);
  const [poseIdx, setPoseIdx] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const poseRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const groupSession = GROUP_SESSIONS.find((s) => s.id === sessionId);
  const personalSession = MOCK_SESSIONS.find((s) => s.id === sessionId);

  const sessionTitle = isGroup
    ? (groupSession?.title ?? "Group Session")
    : "Yoga Therapy - 1:1";
  const instructorName = isGroup
    ? (groupSession?.instructor ?? "Instructor")
    : (personalSession?.provider ?? "Dr. Priya Nair");
  const instructorInitials = instructorName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  // Auto-transition joining -> live
  useEffect(() => {
    if (phase !== "joining") return;
    const t = setTimeout(() => setPhase("live"), 2800);
    return () => clearTimeout(t);
  }, [phase]);

  // Start timer + pose ticker when live
  useEffect(() => {
    if (phase !== "live") return;
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    poseRef.current = setInterval(
      () => setPoseIdx((i) => Math.min(i + 1, POSE_SEQUENCE.length - 1)),
      8000,
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (poseRef.current) clearInterval(poseRef.current);
    };
  }, [phase]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sc = (s % 60).toString().padStart(2, "0");
    return m + ":" + sc;
  };

  const handleEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (poseRef.current) clearInterval(poseRef.current);
    setPhase("ending");
    setTimeout(() => setPhase("report"), 2400);
  };

  return (
    <div className="min-h-full flex flex-col">
      <AnimatePresence mode="wait">
        {phase === "joining" && (
          <JoiningPhase
            key="joining"
            title={sessionTitle}
            instructor={instructorName}
            isGroup={isGroup}
            count={isGroup ? (groupSession?.enrolled ?? 8) : 2}
          />
        )}
        {phase === "live" && (
          <LivePhase
            key="live"
            title={sessionTitle}
            instructorInitials={instructorInitials}
            instructorName={instructorName}
            isGroup={isGroup}
            elapsed={elapsed}
            poseIdx={poseIdx}
            micOn={micOn}
            camOn={camOn}
            onToggleMic={() => setMicOn((v) => !v)}
            onToggleCam={() => setCamOn((v) => !v)}
            onEnd={handleEnd}
            formatTime={formatTime}
          />
        )}
        {phase === "ending" && <EndingPhase key="ending" />}
        {phase === "report" && (
          <ReportPhase
            key="report"
            title={sessionTitle}
            instructor={instructorName}
            isGroup={isGroup}
            duration={elapsed}
            posesCompleted={poseIdx + 1}
            formatTime={formatTime}
            onDone={() => navigate("/sessions")}
            onBook={() => navigate("/booking")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Joining ─────────────────────────────────────────────────────────────────

function JoiningPhase({
  title,
  instructor,
  isGroup,
  count,
}: {
  key?: string;
  title: string;
  instructor: string;
  isGroup: boolean;
  count: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 min-h-full bg-[#0d1a0b] flex flex-col items-center justify-center text-white px-8 text-center"
    >
      <div className="relative w-28 h-28 flex items-center justify-center mb-10">
        {[0, 0.55, 1.1].map((delay) => (
          <motion.div
            key={delay}
            className="absolute inset-0 rounded-full border border-[#4a6741]/40"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.8, delay, ease: "easeOut" }}
          />
        ))}
        <div className="w-28 h-28 rounded-full bg-[#1a3016] border border-[#4a6741]/50 flex items-center justify-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
          >
            <Sparkles size={30} className="text-[#7aaa72]" />
          </motion.div>
        </div>
      </div>

      <p className="small-caps text-[8px] text-[#7aaa72] mb-3 tracking-widest">
        Connecting to session
      </p>
      <h2 className="serif text-2xl text-white mb-1 leading-tight">{title}</h2>
      <p className="small-caps text-[8px] text-white/30 mb-8">{instructor}</p>

      {isGroup && (
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <Users size={11} className="text-white/30" />
          <span className="small-caps text-[8px] text-white/40">
            {count} participants joining
          </span>
        </div>
      )}

      <div className="mt-10 flex gap-2">
        {[0, 0.2, 0.4].map((d) => (
          <motion.div
            key={d}
            className="w-1.5 h-1.5 rounded-full bg-[#4a6741]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: d }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Live ─────────────────────────────────────────────────────────────────────

function LivePhase({
  title,
  instructorInitials,
  instructorName,
  isGroup,
  elapsed,
  poseIdx,
  micOn,
  camOn,
  onToggleMic,
  onToggleCam,
  onEnd,
  formatTime,
}: {
  key?: string;
  title: string;
  instructorInitials: string;
  instructorName: string;
  isGroup: boolean;
  elapsed: number;
  poseIdx: number;
  micOn: boolean;
  camOn: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onEnd: () => void;
  formatTime: (s: number) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 min-h-full bg-[#0d1a0b] flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-10 pb-3">
        <p className="small-caps text-[8px] text-white/30 truncate flex-1 min-w-0">
          {title}
        </p>
        <div className="flex items-center gap-2 ml-3 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="small-caps text-[8px] text-red-400">Live</span>
          <div className="bg-white/10 rounded-full px-2.5 py-1 ml-1">
            <span className="small-caps text-[9px] text-white font-bold tabular-nums">
              {formatTime(elapsed)}
            </span>
          </div>
        </div>
      </div>

      {/* AI badge */}
      <div className="flex justify-center mb-3">
        <div className="flex items-center gap-1.5 bg-[#1a3016]/80 border border-[#4a6741]/40 rounded-full px-3 py-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#7aaa72]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />
          <span className="small-caps text-[7px] text-[#7aaa72]">
            AI Notetaker Active
          </span>
        </div>
      </div>

      {/* Instructor tile */}
      <div className="flex-1 mx-4 rounded-2xl overflow-hidden relative bg-gradient-to-br from-[#1a3016] to-[#0d1a0b] border border-white/5 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-[#243d20] border border-[#4a6741]/40 flex items-center justify-center">
            <span className="serif text-3xl text-white/70">{instructorInitials}</span>
          </div>
          <p className="small-caps text-[9px] text-white/40">{instructorName}</p>
        </div>

        {/* Pose cue */}
        <AnimatePresence mode="wait">
          <motion.div
            key={poseIdx}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
          >
            <p className="small-caps text-[8px] text-[#7aaa72] mb-1">
              {POSE_SEQUENCE[poseIdx].name}
            </p>
            <p className="text-[11px] text-white/75 font-medium leading-snug">
              {POSE_SEQUENCE[poseIdx].cue}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Participants row (group) or PiP (1:1) */}
      {isGroup ? (
        <div className="flex gap-2 px-4 py-3 justify-center">
          {GROUP_PARTICIPANTS.map((p) => (
            <div
              key={p.initials}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: p.bg }}
            >
              {p.initials}
            </div>
          ))}
          <div className="w-10 h-10 rounded-xl bg-[#243d20] border border-[#4a6741]/30 flex items-center justify-center">
            <span className="text-[9px] text-[#7aaa72] font-bold">You</span>
          </div>
        </div>
      ) : (
        <div className="flex justify-end px-4 py-3">
          <div className="w-16 h-20 rounded-xl bg-[#243d20] border border-[#4a6741]/30 flex items-center justify-center">
            <span className="small-caps text-[8px] text-[#7aaa72]">You</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between px-5 py-4 pb-8 border-t border-white/5 mt-1">
        <div className="flex gap-3">
          <button
            onClick={onToggleMic}
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center border transition-all",
              micOn
                ? "bg-white/10 border-white/10 text-white"
                : "bg-red-500/20 border-red-500/30 text-red-400",
            )}
          >
            {micOn ? <Mic size={16} /> : <MicOff size={16} />}
          </button>
          <button
            onClick={onToggleCam}
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center border transition-all",
              camOn
                ? "bg-white/10 border-white/10 text-white"
                : "bg-red-500/20 border-red-500/30 text-red-400",
            )}
          >
            {camOn ? <Video size={16} /> : <VideoOff size={16} />}
          </button>
          <button className="w-11 h-11 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center">
            <MessageSquare size={16} />
          </button>
        </div>
        <button
          onClick={onEnd}
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-3 rounded-xl font-bold text-[11px] uppercase tracking-wide shadow-lg shadow-red-900/30 active:scale-95 transition-all"
        >
          <PhoneOff size={15} />
          End Session
        </button>
      </div>
    </motion.div>
  );
}

// ─── Ending ───────────────────────────────────────────────────────────────────

function EndingPhase() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 min-h-full bg-[#0d1a0b] flex flex-col items-center justify-center text-white px-8 text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="mb-6"
      >
        <Brain size={34} className="text-[#7aaa72]" />
      </motion.div>
      <p className="small-caps text-[8px] text-[#7aaa72] mb-2 tracking-widest">
        AI is processing your session
      </p>
      <p className="serif text-2xl text-white">Generating Notes</p>
      <div className="mt-6 flex gap-2">
        {[0, 0.15, 0.3].map((d) => (
          <motion.div
            key={d}
            className="w-1.5 h-1.5 rounded-full bg-[#4a6741]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.0, delay: d }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Report ───────────────────────────────────────────────────────────────────

function ReportPhase({
  title,
  instructor,
  isGroup,
  duration,
  posesCompleted,
  formatTime,
  onDone,
  onBook,
}: {
  key?: string;
  title: string;
  instructor: string;
  isGroup: boolean;
  duration: number;
  posesCompleted: number;
  formatTime: (s: number) => string;
  onDone: () => void;
  onBook: () => void;
}) {
  const [painBefore, setPainBefore] = useState<number | null>(null);
  const [painAfter,  setPainAfter]  = useState<number | null>(null);
  const [presence,   setPresence]   = useState<number | null>(null);
  const [logSaved,   setLogSaved]   = useState(false);

  function saveLog() {
    if (painBefore === null || painAfter === null || presence === null) return;
    const existing = JSON.parse(localStorage.getItem("irai_session_logs") || "[]");
    existing.push({ date: new Date().toISOString(), painBefore, painAfter, presence });
    localStorage.setItem("irai_session_logs", JSON.stringify(existing));
    setLogSaved(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="min-h-full bg-brand-50"
    >
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-brand-border">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 bg-[#f0f4ee] rounded-lg flex items-center justify-center text-forest">
            <Sparkles size={13} />
          </div>
          <p className="small-caps text-[8px] text-forest">AI Session Report</p>
        </div>
        <h2 className="serif text-3xl leading-none">Session Complete</h2>
        <p className="small-caps text-[8px] text-gray-400 mt-1.5">
          {instructor} · {isGroup ? "Group" : "1:1 Therapy"}
        </p>
      </div>

      <div className="p-5 space-y-4 pb-32">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Clock, label: "Duration", value: formatTime(duration) },
            { icon: Leaf, label: "Poses", value: posesCompleted + "/" + POSE_SEQUENCE.length },
            { icon: Users, label: "Type", value: isGroup ? "Group" : "1:1" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-white border border-brand-border rounded-2xl p-3 flex flex-col items-center gap-1.5"
            >
              <div className="w-7 h-7 bg-[#f0f4ee] rounded-lg flex items-center justify-center text-forest">
                <Icon size={13} />
              </div>
              <p className="text-[11px] font-bold text-slate uppercase tracking-tight leading-none text-center">
                {value}
              </p>
              <p className="small-caps text-[7px] text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* AI Notes */}
        <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-border">
            <Brain size={14} className="text-forest" />
            <h3 className="small-caps text-[9px]">AI Notetaker Summary</h3>
          </div>
          <div className="divide-y divide-brand-border">
            {AI_NOTES.map((note, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    note.flag
                      ? "bg-[#fdf3ec] text-terracotta"
                      : "bg-[#f0f4ee] text-forest",
                  )}
                >
                  {note.flag ? (
                    <ShieldAlert size={10} />
                  ) : (
                    <CheckCircle2 size={10} />
                  )}
                </div>
                <p className="text-[11px] text-slate/80 leading-snug font-medium">
                  {note.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Poses */}
        <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-border">
            <Leaf size={14} className="text-forest" />
            <h3 className="small-caps text-[9px]">Poses Practised</h3>
          </div>
          <div className="divide-y divide-brand-border">
            {POSE_SEQUENCE.map((pose, i) => {
              const done = i < posesCompleted;
              return (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                      done
                        ? "bg-[#f0f4ee] text-forest"
                        : "bg-gray-50 text-gray-200",
                    )}
                  >
                    <CheckCircle2 size={10} />
                  </div>
                  <p
                    className={cn(
                      "flex-1 text-[11px] font-bold uppercase tracking-tight",
                      done ? "text-slate" : "text-gray-300",
                    )}
                  >
                    {pose.name}
                  </p>
                  {done && (
                    <span className="small-caps text-[7px] text-forest bg-[#f0f4ee] px-2 py-0.5 rounded-full border border-forest/15">
                      Safe
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-border">
            <Stethoscope size={14} className="text-forest" />
            <h3 className="small-caps text-[9px]">For Your Next Session</h3>
          </div>
          <div className="divide-y divide-brand-border">
            {NEXT_SESSION_RECS.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                <span className="text-[11px] text-terracotta font-bold shrink-0 mt-0.5">
                  {i + 1}.
                </span>
                <p className="text-[11px] text-slate/80 leading-snug font-medium">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Health alignment */}
        <div className="flex items-center gap-3 bg-[#f0f4ee] border border-forest/20 rounded-xl px-4 py-3">
          <CheckCircle2 size={14} className="text-forest shrink-0" />
          <p className="small-caps text-[8px] text-forest leading-relaxed">
            All poses aligned with your health profile. 0 contraindications triggered.
          </p>
        </div>

        {/* Saved badge */}
        <div className="flex items-center gap-2 justify-center py-1">
          <FileText size={12} className="text-gray-300" />
          <p className="small-caps text-[8px] text-gray-400">
            Report saved to Health Vault
          </p>
        </div>

        {/* ── Session Logger ── */}
        <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-border">
            <Sparkles size={13} className="text-forest" />
            <h3 className="small-caps text-[9px]">Log This Session</h3>
          </div>

          {logSaved ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 gap-2.5"
            >
              <div className="w-10 h-10 bg-[#f0f4ee] rounded-full flex items-center justify-center text-forest">
                <CheckCircle2 size={20} />
              </div>
              <p className="small-caps text-[9px] text-forest">Log Saved</p>
              <p className="small-caps text-[7px] text-gray-400">
                Pain and presence data recorded
              </p>
            </motion.div>
          ) : (
            <div className="p-5 space-y-5">
              {/* Pain Before */}
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-2.5">
                  Pain Score — Before
                </p>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPainBefore(n)}
                      className={cn(
                        "flex-1 h-7 rounded-lg text-[9px] font-bold border transition-all",
                        painBefore === n
                          ? "bg-slate text-white border-slate"
                          : "bg-[#f5f7f2] text-gray-300 border-brand-border",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pain After */}
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-2.5">
                  Pain Score — After
                </p>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPainAfter(n)}
                      className={cn(
                        "flex-1 h-7 rounded-lg text-[9px] font-bold border transition-all",
                        painAfter === n
                          ? n <= 3
                            ? "bg-forest text-white border-forest"
                            : n <= 6
                              ? "bg-amber-400 text-white border-amber-400"
                              : "bg-red-400 text-white border-red-400"
                          : "bg-[#f5f7f2] text-gray-300 border-brand-border",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="small-caps text-[6px] text-forest">No pain</span>
                  <span className="small-caps text-[6px] text-red-400">Severe</span>
                </div>
              </div>

              {/* Presence */}
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-2.5">
                  How present were you?
                </p>
                <div className="flex gap-1.5">
                  {[
                    { val: 1, label: "Distracted" },
                    { val: 2, label: "Scattered" },
                    { val: 3, label: "Present" },
                    { val: 4, label: "Focused" },
                    { val: 5, label: "Flow" },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      onClick={() => setPresence(val)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl border transition-all flex flex-col items-center gap-0.5",
                        presence === val
                          ? "bg-forest text-white border-forest shadow-md shadow-forest/20"
                          : "bg-[#f5f7f2] border-brand-border",
                      )}
                    >
                      <span className={cn("text-[12px] font-bold", presence === val ? "text-white" : "text-gray-400")}>
                        {val}
                      </span>
                      <span className={cn("text-[5.5px] font-bold uppercase tracking-wide leading-none", presence === val ? "text-white/70" : "text-gray-300")}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={saveLog}
                disabled={painBefore === null || painAfter === null || presence === null}
                className="w-full bg-forest text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-forest/20 disabled:opacity-35 disabled:shadow-none transition-all"
              >
                Save Log
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-brand-border px-5 py-4 pb-6 flex gap-3">
        <button
          onClick={onBook}
          className="flex-[2] bg-forest text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-forest/20"
        >
          Book Next <ChevronRight size={16} />
        </button>
        <button
          onClick={onDone}
          className="flex-1 bg-white border border-brand-border text-slate py-3.5 rounded-xl font-bold text-sm"
        >
          Done
        </button>
      </div>
    </motion.div>
  );
}
