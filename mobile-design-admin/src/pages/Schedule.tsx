import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Clock, User, Play, Users, Wind, Leaf } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { MOCK_APPOINTMENTS, MOCK_GROUP_SESSIONS } from '../mockData';
import { cn } from '../lib/utils';

const SLOTS = [
  { time: '09:00 AM', status: 'booked',    apptId: 'a1', name: 'Emma Watson'     },
  { time: '10:00 AM', status: 'available'                                         },
  { time: '11:30 AM', status: 'booked',    apptId: 'a2', name: 'James Rodriguez' },
  { time: '12:00 PM', status: 'break'                                             },
  { time: '01:00 PM', status: 'available'                                         },
  { time: '02:00 PM', status: 'available'                                         },
  { time: '03:00 PM', status: 'booked',    apptId: 'a3', name: 'Sophia Chen'     },
  { time: '04:00 PM', status: 'available'                                         },
];

const CAT_ICON: Record<string, LucideIcon> = {
  yoga:       Users,
  breathwork: Wind,
  meditation: Leaf,
  mobility:   Users,
};

const CAT_COLOR: Record<string, string> = {
  yoga:       '#4a6741',
  breathwork: '#4B7399',
  meditation: '#7B5EA7',
  mobility:   '#E07B5A',
};

export default function Schedule() {
  const navigate     = useNavigate();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const today    = startOfToday();
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const booked    = SLOTS.filter(s => s.status === 'booked').length;
  const available = SLOTS.filter(s => s.status === 'available').length;

  return (
    <div className="min-h-full bg-brand-50 pb-24">

      {/* ── Header ── */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-brand-border">
        <p className="small-caps text-gray-400 mb-1">Practitioner</p>
        <div className="flex items-center justify-between">
          <h2 className="serif text-3xl leading-none">Schedule</h2>
          <button className="w-9 h-9 bg-slate rounded-xl flex items-center justify-center text-white active:scale-95 transition-all shadow-sm">
            <Plus size={18} />
          </button>
        </div>
        <p className="small-caps text-[7px] text-gray-400 mt-2">
          {booked} booked · {available} available
        </p>
      </div>

      <div className="p-6 space-y-5">

        {/* ── Week strip ── */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-3 flex justify-between gap-1">
          {weekDays.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday    = isSameDay(date, today);
            return (
              <button
                key={date.toString()}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  'flex flex-col items-center gap-1.5 py-2 px-1.5 rounded-xl transition-all flex-1',
                  isSelected ? 'bg-slate' : '',
                )}
              >
                <span className={cn('text-[8px] font-bold uppercase', isSelected ? 'text-white/60' : 'text-gray-300')}>
                  {format(date, 'eee')}
                </span>
                <span className={cn('text-[13px] font-bold leading-none', isSelected ? 'text-white' : isToday ? 'text-forest' : 'text-slate')}>
                  {format(date, 'd')}
                </span>
                {isToday && !isSelected && <span className="w-1 h-1 rounded-full bg-forest" />}
              </button>
            );
          })}
        </div>

        {/* ── Time slots label ── */}
        <div className="flex items-center justify-between px-1">
          <p className="small-caps text-gray-400">Time Slots</p>
          <p className="small-caps text-[8px] text-gray-400">{format(selectedDate, 'MMMM d, yyyy')}</p>
        </div>

        {/* ── Slots ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate.toString()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2.5"
          >
            {SLOTS.map((slot, idx) => (
              <motion.div
                key={slot.time}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={cn(
                  'bg-white rounded-2xl border p-4 flex items-center gap-3 shadow-sm',
                  slot.status === 'booked'    ? 'border-forest/20'            : '',
                  slot.status === 'break'     ? 'border-brand-border opacity-50' : '',
                  slot.status === 'available' ? 'border-dashed border-brand-border' : '',
                )}
              >
                <div className="flex items-center gap-1.5 w-20 shrink-0">
                  <Clock size={10} className="text-gray-300" />
                  <span className="text-[10px] font-bold text-gray-400">{slot.time}</span>
                </div>

                {slot.status === 'booked' && (
                  <div className="w-1.5 h-8 bg-forest rounded-full shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  {slot.status === 'booked' ? (
                    <div className="flex items-center gap-2">
                      <User size={11} className="text-forest shrink-0" />
                      <span className="text-[12px] font-bold text-slate truncate">{slot.name}</span>
                    </div>
                  ) : slot.status === 'break' ? (
                    <span className="text-[11px] italic text-gray-400">Coffee Break</span>
                  ) : (
                    <span className="small-caps text-[8px] text-forest/50">Available</span>
                  )}
                </div>

                {slot.status === 'available' && (
                  <button className="small-caps text-[8px] text-forest bg-[#f0f4ee] border border-forest/20 px-3 py-1.5 rounded-full shrink-0 active:scale-95 transition-all">
                    Book
                  </button>
                )}
                {slot.status === 'booked' && slot.apptId && (
                  <button
                    onClick={() => navigate(`/practitioner/session/${slot.apptId}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-forest rounded-full text-white text-[9px] font-bold shrink-0 active:scale-95 transition-all"
                  >
                    <Play size={9} fill="white" /> Start
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Group Sessions ── */}
        <section className="space-y-3 pt-2">
          <p className="small-caps text-gray-400 px-1">My Group Sessions</p>
          <div className="space-y-2.5">
            {MOCK_GROUP_SESSIONS.map((gs, i) => {
              const color   = CAT_COLOR[gs.category] ?? '#4a6741';
              const IconComp = CAT_ICON[gs.category] ?? CAT_ICON.yoga;
              const fillPct  = Math.round((gs.enrolled / gs.capacity) * 100);
              return (
                <motion.div
                  key={gs.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden"
                >
                  <div className="h-0.5 w-full" style={{ backgroundColor: color }} />
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${color}18` }}
                      >
                        <IconComp size={16} style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-slate truncate">{gs.title}</p>
                        <p className="small-caps text-[7px] text-gray-400">
                          {gs.days.join(' · ')} · {gs.time}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/practitioner/session/${gs.id}?type=group`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-[9px] font-bold shrink-0 active:scale-95 transition-all"
                        style={{ backgroundColor: color }}
                      >
                        <Play size={9} fill="white" /> Go Live
                      </button>
                    </div>

                    {/* Capacity bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-gray-400">{gs.enrolled}/{gs.capacity} enrolled</span>
                        <span className="text-[9px] font-bold" style={{ color }}>{fillPct}%</span>
                      </div>
                      <div className="h-1.5 bg-brand-50 rounded-full overflow-hidden border border-brand-border">
                        <div className="h-full rounded-full" style={{ width: `${fillPct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
