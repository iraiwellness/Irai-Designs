import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Flame, Trophy, ChevronRight, Users, Stethoscope, Apple, Brain,
  CalendarDays, Sparkles, Wind, Leaf, Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_SESSIONS, MOCK_AI_DATA, PLANS, GROUP_SESSIONS } from '../../userData';
import type { GroupSession } from '../../userData';
import { cn } from '../../lib/utils';

const ACTION_ITEMS = [
  { icon: Users, label: 'Yoga', sub: 'Therapeutic practice', path: '/user/booking?category=yoga', bg: 'bg-[#f0f4ee]', text: 'text-forest' },
  { icon: Stethoscope, label: 'Doctor', sub: 'Health consultation', path: '/user/booking?category=doctor', bg: 'bg-[#eef3f9]', text: 'text-[#4B7399]' },
  { icon: Apple, label: 'Nutrition', sub: 'Diet & wellness', path: '/user/booking?category=nutrition', bg: 'bg-[#fdf3ec]', text: 'text-terracotta' },
  { icon: Brain, label: 'Psych', sub: 'Mind & focus', path: '/user/booking?category=psych', bg: 'bg-[#f3f0f9]', text: 'text-[#7B5EA7]' },
];

const CAT_ICON: Record<GroupSession['category'], typeof Users> = { yoga: Users, breathwork: Wind, meditation: Leaf, mobility: Activity };

function formatSessionDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const plan = PLANS.find(p => p.id === user?.planId);
  const score = MOCK_AI_DATA.wellnessScore;
  const upcoming = MOCK_SESSIONS.filter(s => s.status === 'upcoming').slice(0, 4);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="bg-gradient-to-br from-[#263d23] to-[#192b16] rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/[0.04] rounded-full" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="small-caps text-white/40 mb-2">{today}</p>
            <h1 className="serif text-4xl leading-tight">Good day, {user?.name.split(' ')[0]}</h1>
            {plan && <p className="text-[13px] text-white/40 mt-2">{plan.name} Plan</p>}
          </div>
          <button type="button" onClick={() => navigate('/user/insights')}
            className="flex items-center gap-4 bg-white/10 rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <div className="text-left">
              <p className="small-caps text-[8px] text-white/40">Wellness Score</p>
              <p className="text-3xl font-bold">{score}</p>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-[#7aaa72] flex items-center justify-center text-[11px] font-bold">
              {score}%
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: 'Streak', value: `${MOCK_AI_DATA.streak} days`, color: 'text-terracotta' },
          { icon: Trophy, label: 'Rank', value: 'Silver', color: 'text-[#4B7399]' },
          { icon: CalendarDays, label: 'Upcoming', value: String(upcoming.length), color: 'text-forest' },
          { icon: Sparkles, label: 'Insights', value: String(MOCK_AI_DATA.insights.length), color: 'text-amber-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-brand-border p-5">
            <Icon size={18} className={cn('mb-3', color)} />
            <p className="text-2xl font-bold text-slate">{value}</p>
            <p className="small-caps text-[8px] text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <section>
        <p className="small-caps text-gray-400 mb-3">Book a session</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {ACTION_ITEMS.map(({ icon: Icon, label, sub, path, bg, text }) => (
            <button key={label} type="button" onClick={() => navigate(path)}
              className="bg-white rounded-2xl border border-brand-border p-5 text-left hover:shadow-md transition-shadow">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', bg)}>
                <Icon size={18} className={text} />
              </div>
              <p className="font-bold text-slate text-[14px]">{label}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{sub}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-brand-border p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="small-caps text-gray-400">Upcoming Sessions</p>
            <button type="button" onClick={() => navigate('/user/sessions')} className="text-[12px] font-bold text-forest">View all</button>
          </div>
          <div className="space-y-3">
            {upcoming.map(s => (
              <div key={s.id} className="flex items-center justify-between py-3 border-b border-brand-border last:border-0">
                <div>
                  <p className="text-[14px] font-semibold text-slate">{s.title}</p>
                  <p className="text-[12px] text-gray-400">{formatSessionDate(s.date)} · {s.time}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-brand-border p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="small-caps text-gray-400">Group Sessions</p>
            <button type="button" onClick={() => navigate('/user/group-sessions')} className="text-[12px] font-bold text-forest">Browse</button>
          </div>
          <div className="space-y-3">
            {GROUP_SESSIONS.slice(0, 3).map(gs => {
              const Icon = CAT_ICON[gs.category];
              return (
                <div key={gs.id} className="flex items-center gap-3 py-2">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Icon size={16} className="text-forest" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate truncate">{gs.title}</p>
                    <p className="text-[11px] text-gray-400">{gs.days.join(', ')} · {gs.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#f0f4ee] rounded-2xl border border-forest/20 p-5 flex items-start gap-3">
        <Sparkles size={18} className="text-forest shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-forest">AI Insight</p>
          <p className="text-[13px] text-gray-600 mt-1">{MOCK_AI_DATA.insights[0]}</p>
        </div>
      </motion.div>
    </div>
  );
}
