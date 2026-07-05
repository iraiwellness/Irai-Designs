import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Clock, User, Play, Users, Wind, Leaf, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { format, addDays, startOfToday, isSameDay, subDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import type { FormEvent } from 'react';
import { MOCK_GROUP_SESSIONS } from '../../mockData';
import type { PractitionerGroupSession } from '../../types';
import { cn } from '../../lib/utils';
import Modal from '../../components/ui/Modal';

type SlotStatus = 'booked' | 'available' | 'break';

interface ScheduleSlot {
  id: string;
  time: string;
  status: SlotStatus;
  apptId?: string;
  name?: string;
}

const INITIAL_SLOTS: ScheduleSlot[] = [
  { id: 's1', time: '09:00 AM', status: 'booked', apptId: 'a1', name: 'Emma Watson'     },
  { id: 's2', time: '10:00 AM', status: 'available'                                         },
  { id: 's3', time: '11:30 AM', status: 'booked', apptId: 'a2', name: 'James Rodriguez' },
  { id: 's4', time: '12:00 PM', status: 'break'                                             },
  { id: 's5', time: '01:00 PM', status: 'available'                                         },
  { id: 's6', time: '02:00 PM', status: 'available'                                         },
  { id: 's7', time: '03:00 PM', status: 'booked', apptId: 'a3', name: 'Sophia Chen'     },
  { id: 's8', time: '04:00 PM', status: 'available'                                         },
];

const TIME_PRESETS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM',
];

const CAT_ICON: Record<string, LucideIcon> = {
  yoga: Users, breathwork: Wind, meditation: Leaf, mobility: Users,
};

const CAT_COLOR: Record<string, string> = {
  yoga: '#4a6741', breathwork: '#4B7399', meditation: '#7B5EA7', mobility: '#E07B5A',
};

function parseTimeToMinutes(time: string): number {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function sortSlots(slots: ScheduleSlot[]): ScheduleSlot[] {
  return [...slots].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
}

export default function Schedule() {
  const navigate = useNavigate();
  const today = startOfToday();
  const [weekStart, setWeekStart] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [slots, setSlots] = useState<ScheduleSlot[]>(INITIAL_SLOTS);
  const [groupSessions, setGroupSessions] = useState(MOCK_GROUP_SESSIONS);
  const [showAvailability, setShowAvailability] = useState(false);
  const [showGroupCreate, setShowGroupCreate] = useState(false);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const booked = slots.filter(s => s.status === 'booked').length;
  const available = slots.filter(s => s.status === 'available').length;
  const existingTimes = useMemo(() => slots.map(s => s.time), [slots]);

  const addSlot = (time: string, status: 'available' | 'break') => {
    if (slots.some(s => s.time.toUpperCase() === time.toUpperCase())) {
      return 'A slot already exists at this time.';
    }
    setSlots(prev => sortSlots([...prev, { id: `slot-${Date.now()}`, time, status }]));
    return null;
  };

  const addGroupSession = (session: PractitionerGroupSession) => {
    setGroupSessions(prev => [session, ...prev]);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="small-caps text-gray-400 mb-1">Practitioner</p>
          <h1 className="serif text-4xl text-slate leading-tight">Schedule</h1>
          <p className="text-[13px] text-gray-400 mt-1">{booked} booked · {available} available today</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAvailability(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate text-white rounded-xl text-[13px] font-bold hover:bg-slate/90 transition-colors"
        >
          <Plus size={16} /> Add Availability
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <button type="button" onClick={() => setWeekStart(subDays(weekStart, 7))}
                className="w-8 h-8 rounded-lg border border-brand-border flex items-center justify-center text-gray-400 hover:bg-brand-50">
                <ChevronLeft size={16} />
              </button>
              <p className="text-[14px] font-semibold text-slate">
                {format(weekDays[0], 'MMM d')} – {format(weekDays[6], 'MMM d, yyyy')}
              </p>
              <button type="button" onClick={() => setWeekStart(addDays(weekStart, 7))}
                className="w-8 h-8 rounded-lg border border-brand-border flex items-center justify-center text-gray-400 hover:bg-brand-50">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map(date => {
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, today);
                return (
                  <button key={date.toString()} type="button" onClick={() => setSelectedDate(date)}
                    className={cn('flex flex-col items-center gap-1 py-3 rounded-xl transition-all',
                      isSelected ? 'bg-slate text-white' : 'hover:bg-brand-50')}>
                    <span className={cn('text-[10px] font-bold uppercase', isSelected ? 'text-white/60' : 'text-gray-400')}>
                      {format(date, 'eee')}
                    </span>
                    <span className={cn('text-[16px] font-bold', isSelected ? 'text-white' : isToday ? 'text-forest' : 'text-slate')}>
                      {format(date, 'd')}
                    </span>
                    {isToday && !isSelected && <span className="w-1.5 h-1.5 rounded-full bg-forest" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="small-caps text-gray-400">Time Slots</p>
              <p className="text-[13px] text-gray-400">{format(selectedDate, 'EEEE, MMMM d')}</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={selectedDate.toString()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-brand-border shadow-sm divide-y divide-brand-border overflow-hidden">
                {slots.length === 0 ? (
                  <p className="px-5 py-10 text-center text-[13px] text-gray-400">No slots yet. Add availability to get started.</p>
                ) : (
                  slots.map(slot => (
                    <div key={slot.id} className={cn('px-5 py-4 flex items-center gap-4', slot.status === 'break' && 'opacity-50 bg-brand-50/30')}>
                      <div className="flex items-center gap-2 w-24 shrink-0">
                        <Clock size={14} className="text-gray-300" />
                        <span className="text-[13px] font-semibold text-gray-500">{slot.time}</span>
                      </div>
                      {slot.status === 'booked' && <div className="w-1 h-8 bg-forest rounded-full shrink-0" />}
                      <div className="flex-1 min-w-0">
                        {slot.status === 'booked' ? (
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-forest" />
                            <span className="text-[14px] font-semibold text-slate">{slot.name}</span>
                          </div>
                        ) : slot.status === 'break' ? (
                          <span className="text-[13px] italic text-gray-400">Break / Blocked</span>
                        ) : (
                          <span className="text-[12px] font-semibold text-forest/60 uppercase tracking-wider">Available</span>
                        )}
                      </div>
                      {slot.status === 'available' && (
                        <button type="button" onClick={() => setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, status: 'break' } : s))}
                          className="text-[12px] font-bold text-forest bg-[#f0f4ee] border border-forest/20 px-4 py-1.5 rounded-lg hover:bg-[#e4ebe0] transition-colors">
                          Block
                        </button>
                      )}
                      {slot.status === 'break' && (
                        <button type="button" onClick={() => setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, status: 'available' } : s))}
                          className="text-[12px] font-bold text-gray-500 bg-white border border-brand-border px-4 py-1.5 rounded-lg hover:bg-brand-50 transition-colors">
                          Unblock
                        </button>
                      )}
                      {slot.status === 'booked' && slot.apptId && (
                        <button type="button" onClick={() => navigate(`/practitioner/session/${slot.apptId}`)}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-forest rounded-lg text-white text-[12px] font-bold hover:bg-[#3d5636] transition-colors">
                          <Play size={12} fill="white" /> Start
                        </button>
                      )}
                    </div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="small-caps text-gray-400">My Group Sessions</p>
            <button type="button" onClick={() => setShowGroupCreate(true)}
              className="flex items-center gap-1 text-[12px] font-semibold text-forest hover:underline">
              <Plus size={14} /> Add Session
            </button>
          </div>
          {groupSessions.map(gs => {
            const color = CAT_COLOR[gs.category] ?? '#4a6741';
            const IconComp = CAT_ICON[gs.category] ?? Users;
            const fillPct = Math.round((gs.enrolled / gs.capacity) * 100);
            return (
              <div key={gs.id} className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
                <div className="h-1 w-full" style={{ backgroundColor: color }} />
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
                      <IconComp size={18} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-slate">{gs.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{gs.days.join(' · ')} · {gs.time}</p>
                      <p className="text-[10px] text-gray-400 capitalize mt-0.5">{gs.level} · {gs.category}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] text-gray-400">{gs.enrolled}/{gs.capacity} enrolled</span>
                      <span className="text-[11px] font-bold" style={{ color }}>{fillPct}%</span>
                    </div>
                    <div className="h-1.5 bg-brand-50 rounded-full border border-brand-border overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${fillPct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                  <button type="button" onClick={() => navigate(`/practitioner/session/${gs.id}?type=group`)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-white text-[12px] font-bold transition-colors"
                    style={{ backgroundColor: color }}>
                    <Play size={12} fill="white" /> Go Live
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddAvailabilityModal
        open={showAvailability}
        onClose={() => setShowAvailability(false)}
        existingTimes={existingTimes}
        onAdd={(time, status) => {
          const err = addSlot(time, status);
          if (!err) setShowAvailability(false);
          return err;
        }}
      />

      <AddGroupSessionModal
        open={showGroupCreate}
        onClose={() => setShowGroupCreate(false)}
        onCreate={(session) => { addGroupSession(session); setShowGroupCreate(false); }}
      />
    </div>
  );
}

function AddAvailabilityModal({
  open, onClose, existingTimes, onAdd,
}: {
  open: boolean;
  onClose: () => void;
  existingTimes: string[];
  onAdd: (time: string, status: 'available' | 'break') => string | null;
}) {
  const [time, setTime] = useState('10:00 AM');
  const [customTime, setCustomTime] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [slotType, setSlotType] = useState<'available' | 'break'>('available');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setTime('10:00 AM'); setCustomTime(''); setUseCustom(false);
    setSlotType('available'); setError(''); setSuccess(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const resolvedTime = useCustom ? customTime.trim() : time;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!resolvedTime) {
      setError('Please select or enter a time.');
      return;
    }
    if (!/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.test(resolvedTime)) {
      setError('Use format like 10:00 AM');
      return;
    }
    const normalized = resolvedTime.replace(/\s*(am|pm)\s*$/i, m => ` ${m.toUpperCase()}`);
    if (existingTimes.some(t => t.toUpperCase() === normalized.toUpperCase())) {
      setError('A slot already exists at this time.');
      return;
    }
    const err = onAdd(normalized, slotType);
    if (err) { setError(err); return; }
    setSuccess(true);
    setTimeout(() => { reset(); onClose(); }, 800);
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Availability">
      {success ? (
        <div className="flex flex-col items-center py-8 gap-3">
          <CheckCircle2 size={32} className="text-forest" />
          <p className="text-[14px] font-semibold text-slate">Slot added to schedule</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">Time</label>
            {!useCustom ? (
              <select value={time} onChange={e => setTime(e.target.value)}
                className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-4 text-[13px] outline-none focus:border-forest/30">
                {TIME_PRESETS.filter(t => !existingTimes.some(e => e.toUpperCase() === t.toUpperCase())).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            ) : (
              <input value={customTime} onChange={e => setCustomTime(e.target.value)} placeholder="e.g. 10:30 AM"
                className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-4 text-[13px] outline-none focus:border-forest/30" />
            )}
            <button type="button" onClick={() => setUseCustom(v => !v)} className="text-[12px] text-forest font-semibold mt-2 hover:underline">
              {useCustom ? 'Choose from presets' : 'Enter custom time'}
            </button>
          </div>

          <div>
            <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">Slot Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['available', 'break'] as const).map(type => (
                <button key={type} type="button" onClick={() => setSlotType(type)}
                  className={cn('py-2.5 rounded-xl text-[12px] font-bold border capitalize transition-all',
                    slotType === type ? 'bg-slate text-white border-slate' : 'bg-brand-50 text-gray-400 border-brand-border')}>
                  {type === 'break' ? 'Break / Block' : 'Available'}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-[12px] text-terracotta font-medium">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose} className="flex-1 py-3 rounded-xl border border-brand-border text-[13px] font-bold hover:bg-brand-50">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-slate text-white text-[13px] font-bold hover:bg-slate/90">Add Slot</button>
          </div>
        </form>
      )}
    </Modal>
  );
}

function AddGroupSessionModal({
  open, onClose, onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (session: PractitionerGroupSession) => void;
}) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('07:30 AM');
  const [duration, setDuration] = useState('45');
  const [capacity, setCapacity] = useState('15');
  const [category, setCategory] = useState<PractitionerGroupSession['category']>('yoga');
  const [level, setLevel] = useState<PractitionerGroupSession['level']>('Beginner');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const FULL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const reset = () => {
    setTitle(''); setTime('07:30 AM'); setDuration('45'); setCapacity('15');
    setCategory('yoga'); setLevel('Beginner'); setSelectedDays(['Mon', 'Wed', 'Fri']);
    setError(''); setSuccess(false);
  };
  const handleClose = () => { reset(); onClose(); };

  const toggleDay = (day: string) =>
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !time.trim() || selectedDays.length === 0) {
      setError('Title, time, and at least one day are required.');
      return;
    }
    const dur = parseInt(duration, 10);
    const cap = parseInt(capacity, 10);
    if (isNaN(dur) || dur <= 0 || isNaN(cap) || cap <= 0) {
      setError('Duration and capacity must be positive numbers.');
      return;
    }
    onCreate({
      id: `gs-prac-${Date.now()}`,
      title: title.trim(),
      category,
      time: time.trim(),
      days: selectedDays,
      duration: dur,
      enrolled: 0,
      capacity: cap,
      level,
    });
    setSuccess(true);
    setTimeout(() => { reset(); onClose(); }, 800);
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Group Session">
      {success ? (
        <div className="flex flex-col items-center py-8 gap-3">
          <CheckCircle2 size={32} className="text-forest" />
          <p className="text-[14px] font-semibold text-slate">Group session added</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">Session Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Evening Breathwork"
              className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-4 text-[13px] outline-none focus:border-forest/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">Time</label>
              <input value={time} onChange={e => setTime(e.target.value)} placeholder="07:30 AM"
                className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-4 text-[13px] outline-none focus:border-forest/30" />
            </div>
            <div>
              <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">Duration (min)</label>
              <input value={duration} onChange={e => setDuration(e.target.value)} type="number" min={1}
                className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-4 text-[13px] outline-none focus:border-forest/30" />
            </div>
          </div>
          <div>
            <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">Capacity</label>
            <input value={capacity} onChange={e => setCapacity(e.target.value)} type="number" min={1}
              className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-4 text-[13px] outline-none focus:border-forest/30" />
          </div>
          <div>
            <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {(['yoga', 'breathwork', 'meditation', 'mobility'] as const).map(cat => (
                <button key={cat} type="button" onClick={() => setCategory(cat)}
                  className={cn('px-3 py-1.5 rounded-full text-[11px] font-bold capitalize border',
                    category === cat ? 'bg-slate text-white border-slate' : 'bg-white text-gray-400 border-brand-border')}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">Level</label>
            <div className="flex gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
                <button key={lvl} type="button" onClick={() => setLevel(lvl)}
                  className={cn('flex-1 py-2 rounded-xl text-[11px] font-bold border',
                    level === lvl ? 'bg-slate text-white border-slate' : 'bg-brand-50 text-gray-400 border-brand-border')}>
                  {lvl}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="small-caps text-[8px] text-gray-400 mb-1.5 block">Days</label>
            <div className="flex flex-wrap gap-2">
              {FULL_DAYS.map(day => (
                <button key={day} type="button" onClick={() => toggleDay(day)}
                  className={cn('px-3 py-1.5 rounded-xl text-[11px] font-bold border',
                    selectedDays.includes(day) ? 'bg-slate text-white border-slate' : 'bg-brand-50 text-gray-400 border-brand-border')}>
                  {day}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-[12px] text-terracotta font-medium">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose} className="flex-1 py-3 rounded-xl border border-brand-border text-[13px] font-bold hover:bg-brand-50">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-slate text-white text-[13px] font-bold hover:bg-slate/90">Add Session</button>
          </div>
        </form>
      )}
    </Modal>
  );
}
