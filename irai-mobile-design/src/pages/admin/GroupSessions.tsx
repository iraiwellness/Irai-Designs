import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Users, Clock, Calendar, Wind, Leaf, Activity,
  ToggleLeft, ToggleRight, X, CheckCircle2,
} from 'lucide-react';
import { ADMIN_GROUP_SESSIONS, AdminGroupSession, SessionStatus } from '../../adminData';
import { cn } from '../../lib/utils';

// ── Lookup tables ──────────────────────────────────────────────────────────────

const CATEGORY_COLOR: Record<string, string> = {
  yoga:       '#4a6741',
  breathwork: '#4B7399',
  meditation: '#7B5EA7',
  mobility:   '#E07B5A',
};

const CATEGORY_BG: Record<string, string> = {
  yoga:       'bg-[#f0f4ee]',
  breathwork: 'bg-[#eef3f9]',
  meditation: 'bg-[#f3f0f9]',
  mobility:   'bg-[#fdf3ec]',
};

const LEVEL_STYLE: Record<string, string> = {
  Beginner:     'text-forest border-forest/20 bg-[#f0f4ee]',
  Intermediate: 'text-[#4B7399] border-[#4B7399]/20 bg-[#eef3f9]',
  Advanced:     'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
};

const DAYS_OF_WEEK = ['M', 'T', 'W', 'T', 'F', 'S'];
const FULL_DAYS    = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ── Helpers ────────────────────────────────────────────────────────────────────

function CategoryIcon({ category, size = 16 }: { category: string; size?: number }) {
  if (category === 'breathwork') return <Wind size={size} />;
  if (category === 'meditation') return <Leaf size={size} />;
  if (category === 'mobility')   return <Activity size={size} />;
  return <Users size={size} />;
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminGroupSessions() {
  const [sessions, setSessions] = useState<AdminGroupSession[]>(ADMIN_GROUP_SESSIONS);
  const [showCreate, setShowCreate] = useState(false);

  const toggleStatus = (id: string) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, status: (s.status === 'published' ? 'draft' : 'published') as SessionStatus }
          : s
      )
    );
  };

  const published     = sessions.filter(s => s.status === 'published');
  const drafts        = sessions.filter(s => s.status === 'draft');
  const totalEnrolled = sessions.reduce((a, s) => a + s.enrolled, 0);
  const totalCapacity = sessions.reduce((a, s) => a + s.capacity, 0);

  return (
    <div className="min-h-full bg-brand-50 pb-24">

      {/* ── Header ── */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-brand-border">
        <p className="small-caps text-gray-400 mb-1">Admin</p>
        <div className="flex items-center justify-between">
          <h2 className="serif text-3xl leading-none">Group Sessions</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="w-9 h-9 bg-slate rounded-xl flex items-center justify-center text-white active:scale-95 transition-all shadow-sm"
          >
            <Plus size={18} />
          </button>
        </div>
        <p className="small-caps text-[7px] text-gray-400 mt-2">
          {published.length} published · {drafts.length} draft
        </p>
      </div>

      <div className="p-6 space-y-5">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Published',  value: published.length, color: 'text-forest'    },
            { label: 'Enrolled',   value: totalEnrolled,    color: 'text-[#4B7399]' },
            { label: 'Capacity',   value: totalCapacity,    color: 'text-slate'     },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-brand-border shadow-sm p-3 text-center">
              <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
              <p className="small-caps text-[7px] text-gray-400 mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Published ── */}
        <section className="space-y-3">
          <p className="small-caps text-gray-400 px-1">Published</p>
          {published.map((session, i) => (
            <SessionCard key={session.id} session={session} index={i} onToggle={toggleStatus} />
          ))}
        </section>

        {/* ── Drafts ── */}
        {drafts.length > 0 && (
          <section className="space-y-3">
            <p className="small-caps text-gray-400 px-1">Drafts</p>
            {drafts.map((session, i) => (
              <SessionCard key={session.id} session={session} index={i} onToggle={toggleStatus} />
            ))}
          </section>
        )}
      </div>

      {/* ── Create sheet (portal) ── */}
      <AnimatePresence>
        {showCreate && (
          <CreateSessionSheet
            onClose={() => setShowCreate(false)}
            onCreate={(s) => { setSessions(prev => [s, ...prev]); setShowCreate(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Session Card ──────────────────────────────────────────────────────────────

function SessionCard({
  session, index, onToggle,
}: {
  session: AdminGroupSession;
  index: number;
  onToggle: (id: string) => void;
}) {
  const isPublished = session.status === 'published';
  const fillPct     = Math.round((session.enrolled / session.capacity) * 100);
  const color       = CATEGORY_COLOR[session.category] ?? '#4a6741';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={cn(
        'bg-white rounded-2xl border shadow-sm overflow-hidden',
        isPublished ? 'border-brand-border' : 'border-dashed border-brand-border opacity-70',
      )}
    >
      <div className="h-0.5 w-full" style={{ backgroundColor: isPublished ? color : 'transparent' }} />
      <div className="p-4 space-y-3">

        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', CATEGORY_BG[session.category])} style={{ color }}>
              <CategoryIcon category={session.category} />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-slate truncate">{session.title}</p>
              <p className="small-caps text-[7px] text-gray-400 truncate">{session.instructor}</p>
            </div>
          </div>
          <button
            onClick={() => onToggle(session.id)}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-full small-caps text-[7px] border transition-all shrink-0',
              isPublished
                ? 'text-forest bg-[#f0f4ee] border-forest/20'
                : 'text-gray-400 bg-gray-50 border-brand-border',
            )}
          >
            {isPublished ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
            {isPublished ? 'Live' : 'Draft'}
          </button>
        </div>

        {/* Schedule + level */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Calendar size={10} className="text-gray-300" />
            <span className="text-[9px] text-gray-400">{session.days.join(' · ')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={10} className="text-gray-300" />
            <span className="text-[9px] font-medium" style={{ color }}>{session.time} · {session.duration}m</span>
          </div>
          <span className={cn('small-caps text-[7px] px-2 py-0.5 rounded-full border ml-auto', LEVEL_STYLE[session.level])}>
            {session.level}
          </span>
        </div>

        {/* Capacity bar */}
        <div className="pt-2.5 border-t border-brand-border">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1">
              <Users size={10} className="text-gray-300" />
              <span className="text-[9px] text-gray-400">{session.enrolled}/{session.capacity} enrolled</span>
            </div>
            <span className="text-[9px] font-bold" style={{ color }}>{fillPct}% full</span>
          </div>
          <div className="h-1.5 bg-brand-50 rounded-full overflow-hidden border border-brand-border">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${fillPct}%`, backgroundColor: color }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Create Session Sheet ──────────────────────────────────────────────────────

function CreateSessionSheet({
  onClose, onCreate,
}: {
  onClose: () => void;
  onCreate: (session: AdminGroupSession) => void;
}) {
  const [title, setTitle]           = useState('');
  const [instructor, setInstructor] = useState('');
  const [time, setTime]             = useState('');
  const [duration, setDuration]     = useState('');
  const [capacity, setCapacity]     = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [submitted, setSubmitted]   = useState(false);

  const toggleDay = (day: string) =>
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);

  const canSubmit = title && instructor && time && duration && capacity && selectedDays.length > 0;

  const handleCreate = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => {
      onCreate({
        id:         `gs-new-${Date.now()}`,
        title,
        category:   'yoga',
        instructor,
        days:       selectedDays,
        time,
        duration:   parseInt(duration, 10),
        capacity:   parseInt(capacity, 10),
        enrolled:   0,
        status:     'draft',
        level:      'Beginner',
      });
    }, 1400);
  };

  const portal = document.getElementById('admin-modal-root');
  if (!portal) return null;

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 pointer-events-auto z-10"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 340 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl pointer-events-auto z-20 overflow-hidden"
      >
        <div className="flex justify-center pt-3.5 pb-1">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-10 px-6 gap-4"
            >
              <div className="relative">
                <motion.div
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                  className="absolute inset-0 bg-forest rounded-full"
                />
                <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center text-white relative z-10 shadow-lg">
                  <CheckCircle2 size={30} />
                </div>
              </div>
              <div className="text-center">
                <h3 className="serif text-2xl text-forest mb-1">Session Created</h3>
                <p className="small-caps text-[8px] text-gray-400">Saved as draft. Publish when ready.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-6 pb-8 space-y-4 max-h-[70vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="serif text-xl text-slate">Create Group Session</h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center"
                >
                  <X size={14} className="text-gray-400" />
                </button>
              </div>

              {[
                { label: 'Session Title',  value: title,      set: setTitle,      placeholder: 'e.g. Morning Flow Yoga' },
                { label: 'Instructor',     value: instructor, set: setInstructor, placeholder: 'Assign therapist...' },
                { label: 'Time',           value: time,       set: setTime,       placeholder: '07:30 AM' },
                { label: 'Duration (min)', value: duration,   set: setDuration,   placeholder: '45' },
                { label: 'Max Capacity',   value: capacity,   set: setCapacity,   placeholder: '20' },
              ].map(f => (
                <div key={f.label}>
                  <p className="small-caps text-[7px] text-gray-400 mb-1.5">{f.label}</p>
                  <input
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full bg-brand-50 border border-brand-border rounded-xl py-3 px-4 text-[12px] text-slate placeholder:text-gray-300 outline-none focus:border-forest/30 transition-colors"
                  />
                </div>
              ))}

              {/* Days */}
              <div>
                <p className="small-caps text-[7px] text-gray-400 mb-1.5">Days</p>
                <div className="flex gap-2">
                  {FULL_DAYS.map((day, i) => {
                    const selected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={cn(
                          'flex-1 h-10 rounded-xl text-[10px] font-bold transition-all border',
                          selected
                            ? 'bg-slate text-white border-slate'
                            : 'bg-brand-50 text-gray-400 border-brand-border',
                        )}
                      >
                        {DAYS_OF_WEEK[i]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                disabled={!canSubmit}
                onClick={handleCreate}
                className="w-full bg-slate text-white py-4 rounded-xl font-bold text-sm disabled:opacity-30 transition-all active:scale-[0.98]"
              >
                Create Session
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>,
    portal,
  );
}
