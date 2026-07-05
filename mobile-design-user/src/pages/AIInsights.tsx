/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
} from "recharts";
import {
  TrendingUp,
  Brain,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "../lib/utils";

// ── Data ──────────────────────────────────────────────────────────────────────

// Score = (Pain*0.30) + (Consistency*0.20) + (Flexibility*0.125) + (Mobility*0.125) + (Focus*0.125) + (Sleep*0.125)
const DIMENSIONS = [
  { label: "Pain Relief", value: 72, weight: 0.3 },
  { label: "Consistency", value: 80, weight: 0.2 },
  { label: "Flexibility", value: 68, weight: 0.125 },
  { label: "Mobility", value: 75, weight: 0.125 },
  { label: "Focus", value: 82, weight: 0.125 },
  { label: "Sleep Quality", value: 70, weight: 0.125 },
];

const WELLNESS_SCORE = Math.round(
  DIMENSIONS.reduce((sum, d) => sum + d.value * d.weight, 0),
);

const MONTHLY_DATA = [
  { month: "Dec", score: 52 },
  { month: "Jan", score: 58 },
  { month: "Feb", score: 61 },
  { month: "Mar", score: 66 },
  { month: "Apr", score: 70 },
  { month: "May", score: 74 },
];

const HIGHLIGHTS = [
  { label: "Pain Relief", change: "-3.2 pts", note: "Since March" },
  { label: "Consistency", change: "+15%", note: "12-day streak" },
  { label: "Flexibility", change: "+8 pts", note: "Personal best" },
];

const COACHING_NOTES = [
  "Your breathing consistency during Bridge poses suggests strong parasympathetic adaptation. Try extending hold time by 5 seconds next session.",
  "Pain scores post-session have dropped 3.2 points over 6 weeks. Your Supported Bridge progression is directly correlated with this improvement.",
  "Focus scores peak on morning sessions (7-9 AM). Scheduling intensive practices in that window could amplify your overall gains significantly.",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function ringColor(score: number) {
  if (score < 40) return "#ef4444";
  if (score < 70) return "#f59e0b";
  return "#4a6741";
}

function rankInfo(score: number): {
  label: string;
  color: string;
  textCls: string;
} {
  if (score < 40)
    return { label: "Bronze", color: "#cd7f32", textCls: "text-[#cd7f32]" };
  if (score < 60)
    return { label: "Silver", color: "#9ca3af", textCls: "text-gray-400" };
  if (score < 80)
    return { label: "Gold", color: "#f59e0b", textCls: "text-yellow-500" };
  return { label: "Platinum", color: "#a78bfa", textCls: "text-purple-400" };
}

function zoneStyle(val: number): { bar: string; text: string } {
  if (val < 50) return { bar: "bg-red-400", text: "text-red-400" };
  if (val < 70) return { bar: "bg-amber-400", text: "text-amber-500" };
  return { bar: "bg-forest", text: "text-forest" };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AIInsights() {
  const [noteIdx, setNoteIdx] = useState(0);

  const score = WELLNESS_SCORE;
  const color = ringColor(score);
  const rank = rankInfo(score);
  const circumference = 502.4;
  const dashOffset = circumference * (1 - score / 100);

  return (
    <div className="p-5 pb-24 bg-brand-50 min-h-full">
      {/* Header */}
      <div className="mt-8 mb-6 px-1">
        <div className="flex items-center justify-between mb-1">
          <p className="small-caps text-forest">Dynamic Biometrics</p>
          <span className="small-caps text-[7px] bg-white border border-brand-border px-3 py-1 rounded-full text-gray-400">
            Spring 2026
          </span>
        </div>
        <h2 className="serif text-3xl leading-none">Your Progression</h2>
      </div>

      <div className="space-y-4">
        {/* ── Wellness Ring ── */}
        <section className="bg-white p-7 rounded-[2rem] border border-brand-border shadow-sm flex flex-col items-center">
          <div className="relative w-44 h-44 flex items-center justify-center mb-5">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="74"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="10"
              />
              <motion.circle
                cx="88"
                cy="88"
                r="74"
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-5xl font-bold tracking-tighter leading-none"
                style={{ color }}
              >
                {score}
              </span>
              <span className="small-caps text-[7px] mt-1 text-gray-400">
                Health Index
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 w-full gap-0 pt-4 border-t border-brand-border text-center divide-x divide-brand-border">
            <div className="px-2">
              <p className="small-caps text-[6px] text-gray-400 mb-1.5">Rank</p>
              <div className="flex items-center justify-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: rank.color }}
                />
                <span
                  className={cn(
                    "font-bold text-[9px] uppercase tracking-tight",
                    rank.textCls,
                  )}
                >
                  {rank.label}
                </span>
              </div>
            </div>
            <div className="px-2">
              <p className="small-caps text-[6px] text-gray-400 mb-1.5">
                Season
              </p>
              <span className="font-bold text-slate text-[9px] uppercase tracking-tight">
                Steady Flame
              </span>
            </div>
            <div className="px-2">
              <p className="small-caps text-[6px] text-gray-400 mb-1.5">
                Streak
              </p>
              <span className="font-bold text-forest text-[9px] uppercase tracking-tight">
                12 Days
              </span>
            </div>
          </div>
        </section>

        {/* ── Season Highlights ── */}
        <section>
          <h3 className="small-caps px-1 mb-3 text-[9px]">Season Highlights</h3>
          <div className="grid grid-cols-3 gap-2">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.label}
                className="bg-white border border-brand-border rounded-2xl p-3 flex flex-col items-center text-center gap-1.5"
              >
                <div className="w-7 h-7 bg-[#f0f4ee] rounded-lg flex items-center justify-center text-forest">
                  <TrendingUp size={12} />
                </div>
                <p className="text-[13px] font-bold text-forest leading-none">
                  {h.change}
                </p>
                <p className="small-caps text-[7px] text-slate leading-none">
                  {h.label}
                </p>
                <p className="small-caps text-[6px] text-gray-300 leading-none">
                  {h.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Dimension Zones ── */}
        <section className="bg-white rounded-[2rem] border border-brand-border shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-border">
            <Zap size={13} className="text-forest" />
            <h3 className="small-caps text-[9px]">Improvement Zones</h3>
            <div className="ml-auto flex items-center gap-3">
              {[
                { color: "bg-red-400", label: "Low" },
                { color: "bg-amber-400", label: "Mid" },
                { color: "bg-forest", label: "Good" },
              ].map(({ color: c, label }) => (
                <div key={label} className="flex items-center gap-1">
                  <div className={cn("w-1.5 h-1.5 rounded-full", c)} />
                  <span className="small-caps text-[6px] text-gray-400">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="divide-y divide-brand-border">
            {DIMENSIONS.map((d, i) => {
              const zone = zoneStyle(d.value);
              return (
                <div
                  key={d.label}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <div className="w-[88px] shrink-0">
                    <p className="text-[10px] font-bold text-slate uppercase tracking-tight leading-none">
                      {d.label}
                    </p>
                    <p className="small-caps text-[6px] text-gray-300 mt-0.5">
                      {Math.round(d.weight * 100)}% weight
                    </p>
                  </div>
                  <div className="flex-1 h-1.5 bg-[#f5f7f2] rounded-full overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full", zone.bar)}
                      initial={{ width: 0 }}
                      animate={{ width: d.value + "%" }}
                      transition={{
                        duration: 0.9,
                        ease: "easeOut",
                        delay: i * 0.06,
                      }}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold w-7 text-right tabular-nums",
                      zone.text,
                    )}
                  >
                    {d.value}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Radar Chart ── */}
        <section className="bg-white p-5 rounded-[2rem] border border-brand-border shadow-sm">
          <p className="small-caps text-center mb-3 text-[9px]">
            Equilibrium Radar
          </p>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="70%"
                data={DIMENSIONS.map((d) => ({
                  subject: d.label.split(" ")[0],
                  A: d.value,
                }))}
              >
                <PolarGrid stroke="#eef2eb" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#aaa", fontSize: 8, fontWeight: 700 }}
                />
                <Radar
                  name="Wellness"
                  dataKey="A"
                  stroke={color}
                  strokeWidth={2}
                  fill={color}
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ── 6-Month Progress ── */}
        <section className="bg-white p-5 rounded-[2rem] border border-brand-border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="small-caps text-[9px]">6-Month Progress</p>
            <span
              className="small-caps text-[8px] font-bold px-2.5 py-1 rounded-full border"
              style={{
                color,
                borderColor: color + "30",
                backgroundColor: color + "10",
              }}
            >
              +
              {MONTHLY_DATA[MONTHLY_DATA.length - 1].score -
                MONTHLY_DATA[0].score}{" "}
              pts
            </span>
          </div>
          <div className="h-[90px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={MONTHLY_DATA}
                margin={{ top: 4, right: 4, left: -32, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#bbb", fontSize: 8, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke={color}
                  strokeWidth={2}
                  fill="url(#scoreGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ── AI Coaching Note ── */}
        <section className="bg-slate rounded-[2rem] p-7 text-white relative overflow-hidden shadow-xl shadow-slate/20">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain size={14} className="text-white/50" />
                <span className="small-caps text-[8px] text-white/50">
                  AI Coaching Insight
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setNoteIdx((i) => Math.max(0, i - 1))}
                  disabled={noteIdx === 0}
                  className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center disabled:opacity-25 transition-all"
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  onClick={() =>
                    setNoteIdx((i) =>
                      Math.min(COACHING_NOTES.length - 1, i + 1),
                    )
                  }
                  disabled={noteIdx === COACHING_NOTES.length - 1}
                  className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center disabled:opacity-25 transition-all"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>

            <p className="serif text-[17px] italic leading-relaxed text-white/85 mb-5">
              "{COACHING_NOTES[noteIdx]}"
            </p>

            <div className="flex items-center gap-1.5">
              {COACHING_NOTES.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === noteIdx ? 12 : 6,
                    opacity: i === noteIdx ? 1 : 0.25,
                  }}
                  className="h-1.5 bg-[#4a6741] rounded-full"
                />
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-forest/10 rounded-full blur-[30px]" />
        </section>
      </div>
    </div>
  );
}
