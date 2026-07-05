import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Users, Wind, Leaf, Activity, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ADMIN_GROUP_SESSIONS, type AdminGroupSession, type SessionStatus } from '../../adminData';
import { cn } from '../../lib/utils';
import Modal from '../../components/ui/Modal';

const CATEGORY_COLOR: Record<string, string> = {
  yoga: '#4a6741', breathwork: '#4B7399', meditation: '#7B5EA7', mobility: '#E07B5A',
};

const CAT_ICON: Record<string, LucideIcon> = {
  yoga: Users, breathwork: Wind, meditation: Leaf, mobility: Activity,
};

const FULL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S'];

const CATEGORIES = ['yoga', 'breathwork', 'meditation', 'mobility'] as const;
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

export default function AdminGroupSessions() {
  const [sessions, setSessions] = useState(ADMIN_GROUP_SESSIONS);
  const [showCreate, setShowCreate] = useState(false);

  const toggleStatus = (id: string) =>
    setSessions(prev => prev.map(s =>
      s.id === id ? { ...s, status: (s.status === 'published' ? 'draft' : 'published') as SessionStatus } : s,
    ));

  const handleCreate = (session: AdminGroupSession) => {
    setSessions(prev => [session, ...prev]);
    setShowCreate(false);
  };

  const totalEnrolled = sessions.reduce((a, s) => a + s.enrolled, 0);
  const totalCapacity = sessions.reduce((a, s) => a + s.capacity, 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="small-caps text-gray-400 mb-1">Admin</p>
          <h1 className="serif text-4xl text-slate">Group Sessions</h1>
          <p className="text-[13px] text-gray-400 mt-1">
            {sessions.filter(s => s.status === 'published').length} published · {totalEnrolled}/{totalCapacity} enrolled
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate text-white rounded-xl text-[13px] font-bold hover:bg-slate/90 transition-colors"
        >
          <Plus size={16} /> New Session
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-border bg-brand-50/50">
              {['Session', 'Instructor', 'Schedule', 'Capacity', 'Level', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <SessionRow key={s.id} session={s} onToggle={toggleStatus} />
            ))}
          </tbody>
        </table>
      </div>

      <CreateGroupSessionModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

function SessionRow({ session, onToggle }: { session: AdminGroupSession; onToggle: (id: string) => void }) {
  const color = CATEGORY_COLOR[session.category] ?? '#4a6741';
  const Icon = CAT_ICON[session.category] ?? Users;
  const fillPct = Math.round((session.enrolled / session.capacity) * 100);

  return (
    <tr className="border-b border-brand-border last:border-0 hover:bg-brand-50/30">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
            <Icon size={16} style={{ color }} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate">{session.title}</p>
            <p className="text-[11px] text-gray-400 capitalize">{session.category} · {session.duration} min</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-[13px] text-gray-500">{session.instructor}</td>
      <td className="px-5 py-4 text-[12px] text-gray-500">{session.days.join(', ')} · {session.time}</td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold">{session.enrolled}/{session.capacity}</span>
          <div className="w-16 h-1.5 bg-brand-50 rounded-full border border-brand-border overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${fillPct}%`, backgroundColor: color }} />
          </div>
        </div>
      </td>
      <td className="px-5 py-4"><span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-brand-50 border border-brand-border">{session.level}</span></td>
      <td className="px-5 py-4">
        <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border',
          session.status === 'published' ? 'text-forest border-forest/20 bg-[#f0f4ee]' : 'text-gray-400 border-gray-200 bg-gray-50')}>
          {session.status}
        </span>
      </td>
      <td className="px-5 py-4">
        <button type="button" onClick={() => onToggle(session.id)} className="text-[12px] font-semibold text-forest hover:underline">
          {session.status === 'published' ? 'Unpublish' : 'Publish'}
        </button>
      </td>
    </tr>
  );
}

function CreateGroupSessionModal({
  open, onClose, onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (session: AdminGroupSession) => void;
}) {
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('45');
  const [capacity, setCapacity] = useState('20');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('yoga');
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('Beginner');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setTitle(''); setInstructor(''); setTime(''); setDuration('45'); setCapacity('20');
    setCategory('yoga'); setLevel('Beginner'); setSelectedDays([]);
    setSuccess(false); setError('');
  };

  const handleClose = () => { reset(); onClose(); };

  const toggleDay = (day: string) =>
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);

  const canSubmit = title.trim() && instructor.trim() && time.trim() && duration && capacity && selectedDays.length > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setError('Please fill in all required fields and select at least one day.');
      return;
    }
    const dur = parseInt(duration, 10);
    const cap = parseInt(capacity, 10);
    if (isNaN(dur) || dur <= 0 || isNaN(cap) || cap <= 0) {
      setError('Duration and capacity must be positive numbers.');
      return;
    }

    const session: AdminGroupSession = {
      id: `gs-new-${Date.now()}`,
      title: title.trim(),
      category,
      instructor: instructor.trim(),
      days: selectedDays,
      time: time.trim(),
      duration: dur,
      capacity: cap,
      enrolled: 0,
      status: 'draft',
      level,
    };

    setSuccess(true);
    setTimeout(() => {
      onCreate(session);
      reset();
    }, 900);
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create Group Session">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-8 gap-3"
          >
            <div className="w-14 h-14 bg-[#f0f4ee] rounded-full flex items-center justify-center">
              <CheckCircle2 size={28} className="text-forest" />
            </div>
            <p className="serif text-xl text-slate">Session created</p>
            <p className="text-[13px] text-gray-400">Saved as draft. Publish when ready.</p>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Session Title', value: title, set: setTitle, placeholder: 'e.g. Morning Flow Yoga' },
              { label: 'Instructor', value: instructor, set: setInstructor, placeholder: 'Assign therapist...' },
              { label: 'Time', value: time, set: setTime, placeholder: '07:30 AM' },
            ].map(f => (
              <div key={f.label}>
                <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">{f.label}</label>
                <input
                  value={f.value}
                  onChange={e => { f.set(e.target.value); setError(''); }}
                  placeholder={f.placeholder}
                  className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-4 text-[13px] outline-none focus:border-forest/30"
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">Duration (min)</label>
                <input value={duration} onChange={e => setDuration(e.target.value)} type="number" min={1}
                  className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-4 text-[13px] outline-none focus:border-forest/30" />
              </div>
              <div>
                <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">Max Capacity</label>
                <input value={capacity} onChange={e => setCapacity(e.target.value)} type="number" min={1}
                  className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-4 text-[13px] outline-none focus:border-forest/30" />
              </div>
            </div>

            <div>
              <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} type="button" onClick={() => setCategory(cat)}
                    className={cn('px-3 py-1.5 rounded-full text-[11px] font-bold uppercase border capitalize transition-all',
                      category === cat ? 'bg-slate text-white border-slate' : 'bg-white text-gray-400 border-brand-border')}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">Level</label>
              <div className="flex gap-2">
                {LEVELS.map(lvl => (
                  <button key={lvl} type="button" onClick={() => setLevel(lvl)}
                    className={cn('flex-1 py-2 rounded-xl text-[11px] font-bold border transition-all',
                      level === lvl ? 'bg-slate text-white border-slate' : 'bg-brand-50 text-gray-400 border-brand-border')}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">Days</label>
              <div className="flex gap-2">
                {FULL_DAYS.map((day, i) => {
                  const selected = selectedDays.includes(day);
                  return (
                    <button key={day} type="button" onClick={() => toggleDay(day)}
                      className={cn('flex-1 h-10 rounded-xl text-[11px] font-bold border transition-all',
                        selected ? 'bg-slate text-white border-slate' : 'bg-brand-50 text-gray-400 border-brand-border')}>
                      {DAY_LABELS[i]}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && <p className="text-[12px] text-terracotta font-medium">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleClose}
                className="flex-1 py-3 rounded-xl border border-brand-border text-[13px] font-bold text-slate hover:bg-brand-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={!canSubmit}
                className="flex-1 py-3 rounded-xl bg-slate text-white text-[13px] font-bold disabled:opacity-40 hover:bg-slate/90 transition-colors">
                Create Session
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  );
}
