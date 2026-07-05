/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import {
  Flame,
  Trophy,
  ChevronRight,
  Users,
  Stethoscope,
  Apple,
  Brain,
  Clock,
  Wind,
  Leaf,
  Activity,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User, MOCK_SESSIONS, MOCK_AI_DATA, PLANS, GROUP_SESSIONS } from '../constants';
import { cn } from '../lib/utils';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

function getToday() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

function formatSessionDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SESSION_TYPE_COLOR: Record<string, string> = {
  'yoga-1on1':  '#4a6741',
  'yoga-group': '#4a6741',
  doctor:       '#4B7399',
  nutrition:    '#e8a87c',
  psych:        '#7B5EA7',
  physio:       '#E07B5A',
};

const ACTION_ITEMS = [
  { icon: Users,       label: 'Yoga',      sub: 'Therapeutic practice', path: '/booking?type=yoga',      bg: 'bg-[#f0f4ee]', text: 'text-forest'     },
  { icon: Stethoscope, label: 'Doctor',    sub: 'Health consultation',   path: '/booking?type=doctor',    bg: 'bg-[#eef3f9]', text: 'text-[#4B7399]' },
  { icon: Apple,       label: 'Nutrition', sub: 'Diet & wellness',       path: '/booking?type=nutrition', bg: 'bg-[#fdf3ec]', text: 'text-terracotta' },
  { icon: Brain,       label: 'Psych',     sub: 'Mind & focus',          path: '/booking?type=psych',     bg: 'bg-[#f3f0f9]', text: 'text-[#7B5EA7]' },
];

// Mini ring params (64 × 64 SVG)
const RING_R = 26;
const RING_C = parseFloat((2 * Math.PI * RING_R).toFixed(2));

// ── Component ─────────────────────────────────────────────────────────────────

export default function Dashboard({ user }: { user: User }) {
  const navigate = useNavigate();
  const plan = PLANS.find(p => p.id === user.planId);
  const score = MOCK_AI_DATA.wellnessScore;
  const ringStroke = score >= 70 ? '#7aaa72' : score >= 40 ? '#f59e0b' : '#ef4444';
  const ringOffset = RING_C * (1 - score / 100);
  const upcomingSessions = MOCK_SESSIONS.filter(s => s.status === 'upcoming').slice(0, 3);

  return (
    <div className="min-h-full bg-brand-50">

      {/* ── Hero Header ── */}
      <div className="bg-gradient-to-br from-[#263d23] to-[#192b16] px-6 pt-12 pb-7 relative overflow-hidden">
        {/* Subtle organic shape */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/[0.03] rounded-full" />
        <div className="absolute bottom-0 left-8 w-24 h-24 bg-white/[0.03] rounded-full blur-2xl" />

        <div className="relative z-10">
          {/* Greeting row */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0 pr-4">
              <p className="small-caps text-[8px] text-white/40 mb-1.5 tracking-widest">
                {getGreeting()} · {getToday()}
              </p>
              <h1 className="serif text-[30px] text-white leading-none">
                {user.name.split(' ')[0]}
              </h1>
              {plan && (
                <div className="flex items-center gap-1.5 mt-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7aaa72]" />
                  <span className="small-caps text-[7px] text-white/40">{plan.name} Plan</span>
                </div>
              )}
            </div>

            {/* Mini wellness ring */}
            <button
              onClick={() => navigate('/insights')}
              className="relative w-16 h-16 shrink-0"
            >
              <svg className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                <motion.circle
                  cx="32" cy="32" r={RING_R}
                  fill="none"
                  stroke={ringStroke}
                  strokeWidth="5"
                  strokeDasharray={RING_C}
                  initial={{ strokeDashoffset: RING_C }}
                  animate={{ strokeDashoffset: ringOffset }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[15px] font-bold text-white leading-none">{score}</span>
                <span className="small-caps text-[5px] text-white/40 mt-0.5">score</span>
              </div>
            </button>
          </div>

          {/* Stat chips */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center text-terracotta">
                <Flame size={13} />
              </div>
              <div>
                <p className="small-caps text-[6px] text-white/35">Streak</p>
                <p className="text-[17px] font-bold text-white leading-none mt-0.5">
                  {MOCK_AI_DATA.streak}
                  <span className="text-[10px] text-white/50 font-medium ml-1">days</span>
                </p>
              </div>
            </div>
            <div className="bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center text-yellow-400">
                <Trophy size={13} />
              </div>
              <div>
                <p className="small-caps text-[6px] text-white/35">Rank</p>
                <p className="text-[17px] font-bold text-white leading-none mt-0.5">
                  Gold
                  <span className="text-[10px] text-white/50 font-medium ml-1">tier</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5 space-y-6 pb-24">

        {/* ── AI Insight ── */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onClick={() => navigate('/insights')}
          className="w-full text-left bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-all group"
        >
          <div className="flex items-start gap-3 p-4">
            <div className="w-8 h-8 bg-[#fdf3ec] rounded-xl flex items-center justify-center text-terracotta shrink-0 mt-0.5">
              <Sparkles size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="small-caps text-[7px] text-terracotta mb-1 tracking-widest">AI Insight</p>
              <p className="text-[12px] text-slate/80 leading-snug font-medium">
                Your consistency is improving. A 20-min session today helps maintain your streak.
              </p>
            </div>
            <ChevronRight size={14} className="shrink-0 mt-1 text-gray-200 group-hover:text-terracotta transition-colors" />
          </div>
          {/* Progress bar accent */}
          <div className="h-[2px] bg-brand-50">
            <motion.div
              className="h-full bg-terracotta"
              initial={{ width: '0%' }}
              animate={{ width: '72%' }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
        </motion.button>

        {/* ── Book a Session ── */}
        <section>
          <div className="flex items-center justify-between mb-3 px-0.5">
            <h2 className="serif text-xl text-slate">Book a Session</h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {ACTION_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="bg-white border border-brand-border rounded-2xl p-4 flex items-center gap-3 group active:scale-[0.97] transition-all hover:border-forest/20 shadow-sm text-left"
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', item.bg, item.text)}>
                  <item.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate text-[11px] uppercase tracking-tight leading-none">{item.label}</p>
                  <p className="small-caps text-[7px] text-gray-400 mt-1 truncate">{item.sub}</p>
                </div>
                <ChevronRight size={12} className="text-gray-200 group-hover:text-forest transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </section>

        {/* ── Group Sessions ── */}
        <section>
          <div className="flex items-center justify-between mb-3 px-0.5">
            <h2 className="serif text-xl text-slate">Group Sessions</h2>
            <button
              onClick={() => navigate('/group-sessions')}
              className="flex items-center gap-0.5 small-caps text-[7.5px] text-forest"
            >
              See All <ChevronRight size={11} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {GROUP_SESSIONS.slice(0, 4).map((gs) => {
              const Icon = gs.category === 'breathwork' ? Wind
                : gs.category === 'meditation' ? Leaf
                : gs.category === 'mobility' ? Activity
                : Users;
              return (
                <button
                  key={gs.id}
                  onClick={() => navigate('/group-sessions')}
                  className="bg-white rounded-2xl border border-brand-border shadow-sm flex flex-col gap-2.5 active:scale-[0.97] transition-all text-left overflow-hidden"
                >
                  <div className="h-[3px] bg-gradient-to-r from-forest/50 to-forest/10" />
                  <div className="px-3.5 pb-3.5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 bg-[#f0f4ee] rounded-lg flex items-center justify-center text-forest">
                        <Icon size={13} />
                      </div>
                      <span className="text-[6px] font-bold uppercase tracking-widest text-gray-400 bg-brand-50 px-1.5 py-0.5 rounded-full border border-brand-border">
                        {gs.level}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate text-[10px] uppercase tracking-tight leading-tight mb-0.5">{gs.title}</h4>
                      <p className="small-caps text-[6px] text-gray-400">{gs.days.slice(0, 3).join(' · ')}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={8} className="text-gray-300" />
                      <span className="small-caps text-[6px] text-forest">{gs.time}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Upcoming Sessions ── */}
        <section>
          <div className="flex items-center justify-between mb-3 px-0.5">
            <h2 className="serif text-xl text-slate">Upcoming</h2>
            <button
              onClick={() => navigate('/sessions')}
              className="flex items-center gap-0.5 small-caps text-[7.5px] text-forest"
            >
              View All <ChevronRight size={11} />
            </button>
          </div>
          <div className="space-y-2">
            {upcomingSessions.length === 0 ? (
              <div className="bg-white border border-brand-border rounded-2xl p-8 flex flex-col items-center gap-2 text-center">
                <CalendarDays size={22} className="text-gray-200" />
                <p className="small-caps text-[8px] text-gray-300">No upcoming sessions</p>
              </div>
            ) : (
              upcomingSessions.map((session) => {
                const accent = SESSION_TYPE_COLOR[session.type] ?? '#4a6741';
                return (
                  <div
                    key={session.id}
                    className="bg-white rounded-2xl border border-brand-border flex overflow-hidden shadow-sm"
                  >
                    {/* Colored left accent */}
                    <div className="w-[3px] shrink-0 self-stretch" style={{ backgroundColor: accent }} />
                    <div className="flex items-center gap-3 px-4 py-3.5 flex-1 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white"
                        style={{ backgroundColor: accent + '22', color: accent }}
                      >
                        {session.type.includes('yoga') ? <Users size={15} />
                          : session.type === 'doctor' ? <Stethoscope size={15} />
                          : session.type === 'nutrition' ? <Apple size={15} />
                          : <Brain size={15} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate text-[11px] uppercase tracking-tight truncate leading-none mb-0.5">
                          {session.title}
                        </h4>
                        <p className="small-caps text-[7px] text-gray-400 truncate">
                          {session.provider || 'Group Session'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[12px] font-bold leading-none" style={{ color: accent }}>{session.time}</p>
                        <p className="small-caps text-[7px] text-gray-400 mt-1">{formatSessionDate(session.date)}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ── Daily Observances ── */}
        <section>
          <div className="flex items-center justify-between mb-3 px-0.5">
            <h2 className="serif text-xl text-slate">Daily Observances</h2>
            <div className="flex items-center gap-1.5">
              <Sparkles size={11} className="text-forest" />
              <span className="small-caps text-[7px] text-forest">AI Generated</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
            {MOCK_AI_DATA.insights.map((insight, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-start gap-3 px-4 py-3.5',
                  idx < MOCK_AI_DATA.insights.length - 1 && 'border-b border-brand-border',
                )}
              >
                <div className="w-5 h-5 rounded-full bg-[#f0f4ee] border border-forest/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[8px] font-bold text-forest">{idx + 1}</span>
                </div>
                <p className="text-[11px] text-slate/75 leading-relaxed font-medium flex-1">{insight}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
