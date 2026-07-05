/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Users,
  ChevronRight,
  Clock,
  Calendar,
  CheckCircle2,
  Wind,
  Leaf,
  Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GROUP_SESSIONS, GroupSession } from '../constants';
import { cn } from '../lib/utils';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'yoga', label: 'Yoga' },
  { id: 'breathwork', label: 'Breathwork' },
  { id: 'meditation', label: 'Meditation' },
  { id: 'mobility', label: 'Mobility' },
];

const LEVEL_STYLE: Record<string, string> = {
  Beginner: 'text-forest bg-[#f0f4ee] border-forest/20',
  Intermediate: 'text-[#4B7399] bg-[#eef3f9] border-[#4B7399]/20',
  Advanced: 'text-terracotta bg-[#fdf3ec] border-terracotta/20',
};

function CategoryIcon({ category, size = 18 }: { category: string; size?: number }) {
  const cls = `shrink-0`;
  if (category === 'breathwork') return <Wind size={size} className={cls} />;
  if (category === 'meditation') return <Leaf size={size} className={cls} />;
  if (category === 'mobility') return <Activity size={size} className={cls} />;
  return <Users size={size} className={cls} />;
}

export default function GroupSessions() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<GroupSession | null>(null);
  const [joined, setJoined] = useState<string[]>([]);
  const [step, setStep] = useState<'browse' | 'detail' | 'success'>('browse');

  const filtered =
    filter === 'all' ? GROUP_SESSIONS : GROUP_SESSIONS.filter(s => s.category === filter);

  const isJoined = (id: string) => joined.includes(id);

  const openDetail = (session: GroupSession) => {
    setSelected(session);
    setStep('detail');
  };

  const handleBack = () => {
    if (step !== 'browse') {
      setStep('browse');
      setSelected(null);
    } else {
      navigate('/dashboard');
    }
  };

  const handleJoin = () => {
    if (!selected) return;
    setJoined(prev => [...prev, selected.id]);
    setStep('success');
  };

  return (
    <div className="min-h-full bg-brand-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 py-10 border-b border-brand-border">
        <button
          onClick={handleBack}
          className="mb-4 w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-forest"
        >
          <ArrowLeft size={16} />
        </button>
        <AnimatePresence mode="wait">
          {step === 'browse' && (
            <motion.div key="h-browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="small-caps text-gray-400 mb-1">Community</p>
              <h2 className="serif text-3xl leading-none">Group Sessions</h2>
            </motion.div>
          )}
          {step === 'detail' && selected && (
            <motion.div key="h-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="small-caps text-gray-400 mb-1">Session Details</p>
              <h2 className="serif text-3xl leading-none">{selected.title}</h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Browse ── */}
        {step === 'browse' && (
          <motion.div
            key="browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 space-y-6"
          >
            {/* Filter tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 pb-1">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 border transition-all',
                    filter === f.id
                      ? 'bg-slate text-white border-slate'
                      : 'bg-white text-gray-400 border-brand-border'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Session cards */}
            <div className="space-y-4">
              {filtered.map((session, idx) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  onClick={() => openDetail(session)}
                  className="bg-white rounded-2xl border border-brand-border shadow-sm active:scale-[0.98] transition-all overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f5f7f2] border border-brand-border rounded-xl flex items-center justify-center text-forest">
                          <CategoryIcon category={session.category} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate text-sm uppercase tracking-tight leading-none mb-1">
                            {session.title}
                          </h4>
                          <p className="small-caps text-[8px] text-gray-400">{session.instructor}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className={cn(
                            'text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border',
                            LEVEL_STYLE[session.level]
                          )}
                        >
                          {session.level}
                        </span>
                        {isJoined(session.id) && (
                          <span className="text-[8px] font-bold text-forest uppercase tracking-widest">
                            ✓ Joined
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-3 border-t border-brand-border">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} className="text-gray-300" />
                        <span className="small-caps text-[7px]">{session.days.join(' · ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={11} className="text-gray-300" />
                        <span className="small-caps text-[7px] text-forest">{session.time}</span>
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        <Users size={11} className="text-gray-300" />
                        <span className="small-caps text-[7px]">
                          {session.enrolled}/{session.capacity}
                        </span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300" />
                    </div>
                  </div>

                  {/* Capacity bar */}
                  <div className="mx-5 mb-4 h-1 bg-[#f5f7f2] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-forest rounded-full"
                      style={{ width: `${(session.enrolled / session.capacity) * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Detail ── */}
        {step === 'detail' && selected && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 space-y-8"
          >
            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#f5f7f2] border border-brand-border text-forest capitalize">
                {selected.category}
              </span>
              <span
                className={cn(
                  'text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border',
                  LEVEL_STYLE[selected.level]
                )}
              >
                {selected.level}
              </span>
            </div>

            {/* Instructor */}
            <div className="bg-white p-5 rounded-2xl border border-brand-border flex items-center gap-4">
              <div className="w-12 h-12 bg-[#f5f7f2] border border-brand-border rounded-xl flex items-center justify-center text-forest">
                <CategoryIcon category={selected.category} size={22} />
              </div>
              <div>
                <h4 className="font-bold text-slate text-sm uppercase tracking-tight">
                  {selected.instructor}
                </h4>
                <p className="small-caps text-[8px] text-gray-400 mt-0.5">{selected.instructorTitle}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 px-1">
              <h3 className="small-caps text-gray-400">About this session</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
                {selected.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: `${selected.duration}`, label: 'Minutes' },
                { value: `${selected.capacity - selected.enrolled}`, label: 'Spots Left' },
                { value: `${selected.days.length}×`, label: 'Per Week' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-white p-4 rounded-2xl border border-brand-border text-center"
                >
                  <p className="text-lg font-bold text-forest">{value}</p>
                  <p className="small-caps text-[7px] mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Schedule visual */}
            <div className="bg-white p-5 rounded-2xl border border-brand-border space-y-3">
              <h3 className="small-caps text-gray-400">Schedule</h3>
              <div className="flex justify-between">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                  <div
                    key={day}
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase',
                      selected.days.includes(day)
                        ? 'bg-slate text-white'
                        : 'bg-[#f5f7f2] text-gray-300 border border-brand-border'
                    )}
                  >
                    {day[0]}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-brand-border">
                <Clock size={12} className="text-gray-300" />
                <span className="small-caps text-[8px] text-forest">
                  {selected.time} · {selected.duration} min
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {selected.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#f5f7f2] border border-brand-border text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleJoin}
              disabled={isJoined(selected.id)}
              className="w-full bg-forest text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-xl shadow-forest/20 disabled:opacity-50 disabled:shadow-none transition-all text-sm"
            >
              {isJoined(selected.id) ? (
                <>Session Already Joined <CheckCircle2 size={18} /></>
              ) : (
                <>Join Session <ChevronRight size={18} /></>
              )}
            </button>
          </motion.div>
        )}

        {/* ── Success ── */}
        {step === 'success' && selected && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center px-8 gap-6"
          >
            <div className="relative w-20 h-20">
              <motion.div
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 1.9, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
                className="absolute inset-0 bg-forest rounded-full"
              />
              <div className="w-20 h-20 bg-forest text-white rounded-full flex items-center justify-center shadow-xl shadow-forest/25 relative z-10">
                <CheckCircle2 size={36} />
              </div>
            </div>

            <div>
              <h3 className="serif text-3xl mb-1.5">You're In!</h3>
              <p className="text-gray-400 text-[12px] max-w-[240px] mx-auto leading-relaxed">
                <strong>{selected.title}</strong> has been added to your calendar.
              </p>
            </div>

            <div className="small-caps text-[8px] bg-[#f5f7f2] border border-brand-border px-4 py-2 rounded-full">
              Added to Calendar · Reminder Set
            </div>

            <div className="w-full space-y-2.5 mt-2">
              <button
                onClick={() =>
                  navigate('/session-room?id=' + selected.id + '&type=group')
                }
                className="w-full bg-forest text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-forest/20 text-sm"
              >
                Enter Session Room <ChevronRight size={17} />
              </button>
              <button
                onClick={() => navigate('/sessions')}
                className="w-full bg-white border border-brand-border text-slate py-4 rounded-xl font-bold text-sm"
              >
                View Calendar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
