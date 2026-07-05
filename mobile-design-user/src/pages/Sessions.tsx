/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Users,
  Stethoscope,
  Apple,
  Brain,
  Activity,
  Clock,
  Calendar as CalIcon,
  CheckCircle2,
  X,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SESSIONS, Session } from '../constants';
import { cn } from '../lib/utils';

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const SESSION_DOT: Record<string, string> = {
  'yoga-group': 'bg-forest',
  'yoga-1on1': 'bg-forest',
  doctor: 'bg-[#4B7399]',
  nutrition: 'bg-terracotta',
  psych: 'bg-[#7B5EA7]',
  physio: 'bg-[#E07B5A]',
};

const SESSION_ICON: Record<string, React.FC<{ size?: number; className?: string }>> = {
  'yoga-group': Users,
  'yoga-1on1': Users,
  doctor: Stethoscope,
  nutrition: Apple,
  psych: Brain,
  physio: Activity,
};

const SESSION_COLOR: Record<string, string> = {
  'yoga-group': '#4a6741',
  'yoga-1on1': '#4a6741',
  doctor: '#4B7399',
  nutrition: '#e8a87c',
  psych: '#7B5EA7',
  physio: '#E07B5A',
};

const STATUS_STYLE: Record<string, string> = {
  upcoming: 'text-forest border-forest/20 bg-[#f0f4ee]',
  completed: 'text-gray-400 border-gray-200 bg-gray-50',
  missed: 'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
  cancelled: 'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
};

const TIME_SLOTS = [
  '07:00 AM', '08:00 AM',
  '09:30 AM', '11:00 AM',
  '02:00 PM', '04:30 PM',
  '06:00 PM', '07:30 PM',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getNextWeekdays(count: number) {
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result: { short: string; date: number; dateStr: string; dayName: string }[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (result.length < count) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      result.push({
        dayName: DAY_NAMES[dow],
        date: d.getDate(),
        short: DAY_NAMES[dow].slice(0, 1),
        dateStr: toDateStr(d.getFullYear(), d.getMonth(), d.getDate()),
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return result;
}

type CalCell = { day: number; currentMonth: boolean; dateStr: string };

// ── Reschedule Sheet ──────────────────────────────────────────────────────────

interface RescheduleSheetProps {
  key?: string;
  session: Session;
  onClose: () => void;
  onConfirm: (sessionId: string, newDate: string, newTime: string) => void;
}

function RescheduleSheet({ session, onClose, onConfirm }: RescheduleSheetProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const weekdays = useMemo(() => getNextWeekdays(5), []);
  const accentColor = SESSION_COLOR[session.type] ?? '#4a6741';
  const canConfirm = !!selectedDay && !!selectedSlot;

  const selectedDayLabel = useMemo(() => {
    if (!selectedDay) return null;
    const found = weekdays.find(w => w.dateStr === selectedDay);
    return found ? `${found.dayName}, ${MONTH_NAMES[new Date(selectedDay + 'T12:00').getMonth()]} ${found.date}` : null;
  }, [selectedDay, weekdays]);

  const handleConfirm = () => {
    if (!canConfirm) return;
    setDone(true);
    setTimeout(() => {
      onConfirm(session.id, selectedDay!, selectedSlot!);
      onClose();
    }, 1600);
  };

  return (
    <>
      {/* Scrim */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 pointer-events-auto"
        onClick={!done ? onClose : undefined}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 340 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] pointer-events-auto overflow-hidden"
        style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.18)' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3.5 pb-1">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        <AnimatePresence mode="wait">
          {/* ── Success state ── */}
          {done ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-10 px-6 gap-4"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 14, stiffness: 260, delay: 0.05 }}
                className="relative"
              >
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white relative z-10 shadow-lg"
                  style={{ backgroundColor: accentColor }}
                >
                  <CheckCircle2 size={30} />
                </div>
              </motion.div>

              <div className="text-center">
                <h3 className="serif text-2xl mb-1">Session Rescheduled</h3>
                <p className="text-[12px] text-gray-400 leading-relaxed">
                  {session.title}
                </p>
                {selectedDayLabel && (
                  <p className="text-[11px] font-bold mt-2" style={{ color: accentColor }}>
                    {selectedDayLabel} · {selectedSlot}
                  </p>
                )}
              </div>

              <div className="small-caps text-[7px] bg-[#f5f7f2] border border-brand-border px-4 py-2 rounded-full mt-1">
                Calendar Updated · Reminder Set
              </div>
            </motion.div>
          ) : (
            /* ── Picker state ── */
            <motion.div
              key="picker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-6 pt-3 pb-8 space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="small-caps text-[8px] text-gray-400 mb-1">Reschedule Session</p>
                  <h3 className="serif text-2xl leading-none">{session.title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-gray-400 mt-0.5 shrink-0"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Current booking */}
              <div
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ borderColor: accentColor + '30', backgroundColor: accentColor + '0c' }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: accentColor + '22' }}
                >
                  <CalIcon size={12} style={{ color: accentColor }} />
                </div>
                <div>
                  <p className="small-caps text-[7px] text-gray-400 mb-0.5">Currently scheduled</p>
                  <p className="text-[11px] font-bold text-slate">
                    {new Date(session.date + 'T12:00').toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric',
                    })} · {session.time}
                  </p>
                </div>
              </div>

              {/* Day picker */}
              <section>
                <p className="small-caps text-[8px] text-gray-400 mb-3">Choose New Day</p>
                <div className="flex gap-2">
                  {weekdays.map((wd) => {
                    const isSelected = selectedDay === wd.dateStr;
                    return (
                      <button
                        key={wd.dateStr}
                        onClick={() => setSelectedDay(wd.dateStr)}
                        className={cn(
                          'flex-1 py-3.5 rounded-2xl flex flex-col items-center gap-1 border transition-all active:scale-95',
                          isSelected
                            ? 'text-white border-transparent shadow-lg'
                            : 'bg-white text-gray-400 border-brand-border'
                        )}
                        style={isSelected ? { backgroundColor: accentColor, boxShadow: `0 6px 20px ${accentColor}30` } : {}}
                      >
                        <span className="text-[7px] font-bold uppercase tracking-widest opacity-70">
                          {wd.dayName.slice(0, 3)}
                        </span>
                        <span className="text-[15px] font-bold leading-none">{wd.date}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Time picker */}
              <section>
                <p className="small-caps text-[8px] text-gray-400 mb-3">Choose New Time</p>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isCurrent = slot === session.time;
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          'py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-wide transition-all border active:scale-95',
                          isSelected
                            ? 'text-white border-transparent shadow-lg'
                            : isCurrent
                              ? 'bg-[#f5f7f2] border-brand-border text-gray-300 line-through'
                              : 'bg-white border-brand-border text-gray-500'
                        )}
                        style={isSelected ? { backgroundColor: accentColor, boxShadow: `0 4px 16px ${accentColor}25` } : {}}
                      >
                        <Clock size={11} className={isSelected ? 'text-white' : 'text-gray-300'} />
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Confirm */}
              <button
                disabled={!canConfirm}
                onClick={handleConfirm}
                className="w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 text-sm text-white transition-all active:scale-[0.98] disabled:opacity-30"
                style={canConfirm ? { backgroundColor: accentColor, boxShadow: `0 8px 24px ${accentColor}35` } : { backgroundColor: accentColor }}
              >
                Confirm Reschedule
                <CheckCircle2 size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Sessions() {
  const navigate = useNavigate();
  const today = new Date();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [reschedulingSession, setReschedulingSession] = useState<Session | null>(null);

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const cells: CalCell[] = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
    const result: CalCell[] = [];

    for (let i = firstWeekday - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const pm = viewMonth === 0 ? 11 : viewMonth - 1;
      const py = viewMonth === 0 ? viewYear - 1 : viewYear;
      result.push({ day: d, currentMonth: false, dateStr: toDateStr(py, pm, d) });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({ day: d, currentMonth: true, dateStr: toDateStr(viewYear, viewMonth, d) });
    }
    let nd = 1;
    while (result.length < 42) {
      const nm = viewMonth === 11 ? 0 : viewMonth + 1;
      const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
      result.push({ day: nd, currentMonth: false, dateStr: toDateStr(ny, nm, nd) });
      nd++;
    }
    return result;
  }, [viewYear, viewMonth]);

  const byDate = useMemo(() => {
    const map: Record<string, Session[]> = {};
    for (const s of sessions) {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    }
    return map;
  }, [sessions]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
    setSelectedDate(null);
  };

  const handleRescheduleConfirm = (sessionId: string, newDate: string, newTime: string) => {
    setSessions(prev =>
      prev.map(s => s.id === sessionId ? { ...s, date: newDate, time: newTime } : s)
    );
  };

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const pastSessions = sessions.filter(s => s.status !== 'upcoming');
  const listedSessions = selectedDate ? (byDate[selectedDate] ?? []) : upcomingSessions;

  const listLabel = selectedDate
    ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
      })
    : 'Upcoming Practice';

  return (
    <div className="min-h-full bg-brand-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-brand-border">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-forest"
        >
          <ArrowLeft size={16} />
        </button>
        <p className="small-caps text-gray-400 mb-1">Calendar</p>
        <h2 className="serif text-3xl leading-none">Your Sessions</h2>
      </div>

      {/* Calendar card */}
      <div className="bg-white border-b border-brand-border px-5 pb-5">
        <div className="flex items-center justify-between py-5 px-1">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-forest transition-colors hover:bg-[#f5f7f2]"
          >
            <ChevronLeft size={16} />
          </button>
          <h3 className="serif text-lg">{MONTH_NAMES[viewMonth]} {viewYear}</h3>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-forest transition-colors hover:bg-[#f5f7f2]"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map((d, i) => (
            <div key={i} className="text-center small-caps text-[8px] text-gray-300 py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((cell, i) => {
            const cellSessions = cell.currentMonth ? (byDate[cell.dateStr] ?? []) : [];
            const isToday = cell.dateStr === todayStr;
            const isSelected = cell.dateStr === selectedDate;

            return (
              <button
                key={i}
                disabled={!cell.currentMonth}
                onClick={() => setSelectedDate(isSelected ? null : cell.dateStr)}
                className={cn(
                  'flex flex-col items-center py-1.5 rounded-xl transition-all',
                  !cell.currentMonth && 'opacity-0 pointer-events-none',
                  isSelected && 'bg-slate',
                  !isSelected && isToday && 'bg-[#f0f4ee]',
                )}
              >
                <span
                  className={cn(
                    'text-[12px] font-bold leading-none mb-1',
                    isSelected ? 'text-white' : isToday ? 'text-forest' : 'text-slate',
                  )}
                >
                  {cell.day}
                </span>
                <div className="flex gap-[2px] h-[6px] items-center">
                  {cellSessions.slice(0, 3).map((s, si) => (
                    <div
                      key={si}
                      className={cn(
                        'w-[5px] h-[5px] rounded-full',
                        isSelected ? 'bg-white/70' : (SESSION_DOT[s.type] ?? 'bg-gray-300'),
                      )}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-4 flex-wrap mt-4 pt-4 border-t border-brand-border px-1">
          {[
            { color: 'bg-forest', label: 'Yoga' },
            { color: 'bg-[#4B7399]', label: 'Doctor' },
            { color: 'bg-terracotta', label: 'Nutrition' },
            { color: 'bg-[#7B5EA7]', label: 'Psych' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={cn('w-2 h-2 rounded-full', color)} />
              <span className="small-caps text-[7px] text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Session list */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="small-caps">{listLabel}</h3>
          {selectedDate && (
            <button onClick={() => setSelectedDate(null)} className="small-caps text-[8px] text-forest">
              Clear
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {listedSessions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <CalIcon size={28} className="mx-auto mb-3 text-gray-200" />
              <p className="small-caps text-[9px] text-gray-300">No sessions on this day</p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedDate ?? 'upcoming'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {listedSessions.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onReschedule={setReschedulingSession}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedDate && pastSessions.length > 0 && (
          <section className="pt-4">
            <h3 className="small-caps text-gray-300 px-1 mb-4">History</h3>
            <div className="space-y-3 opacity-60">
              {pastSessions.map(s => (
                <SessionCard key={s.id} session={s} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Reschedule sheet — portalled into modal-root inside the phone frame */}
      {createPortal(
        <AnimatePresence>
          {reschedulingSession && (
            <RescheduleSheet
              key="reschedule-sheet"
              session={reschedulingSession}
              onClose={() => setReschedulingSession(null)}
              onConfirm={handleRescheduleConfirm}
            />
          )}
        </AnimatePresence>,
        document.getElementById('modal-root')!
      )}
    </div>
  );
}

// ── Session Card ──────────────────────────────────────────────────────────────

interface SessionCardProps {
  key?: string;
  session: Session;
  onReschedule?: (session: Session) => void;
}

function SessionCard({ session, onReschedule }: SessionCardProps) {
  const navigate = useNavigate();
  const Icon = SESSION_ICON[session.type] ?? Users;
  const dot = SESSION_DOT[session.type] ?? 'bg-gray-300';
  const isUpcoming = session.status === 'upcoming';
  const isYogaUpcoming = isUpcoming && (session.type === 'yoga-1on1' || session.type === 'yoga-group');

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
      {/* Accent bar */}
      <div
        className="h-0.5 w-full"
        style={{ backgroundColor: isUpcoming ? (SESSION_COLOR[session.type] ?? '#4a6741') : 'transparent' }}
      />

      <div className="p-4">
        <div className="flex gap-3 items-center mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#f5f7f2] border border-brand-border flex items-center justify-center shrink-0 text-forest">
            <Icon size={17} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate text-[12px] uppercase tracking-tight leading-none mb-1 truncate">
              {session.title}
            </h4>
            <p className="small-caps text-[8px] text-gray-400 truncate">
              {session.provider ?? 'Group Session'}
            </p>
          </div>
          <div className={cn('w-2 h-2 rounded-full shrink-0', dot)} />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-brand-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <CalIcon size={10} className="text-gray-300" />
              <span className="small-caps text-[7px]">
                {new Date(session.date + 'T12:00').toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={10} className="text-gray-300" />
              <span className="small-caps text-[7px] text-forest">{session.time}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Reschedule — all upcoming sessions */}
            {isUpcoming && onReschedule && (
              <button
                onClick={() => onReschedule(session)}
                className="w-7 h-7 rounded-full border border-brand-border flex items-center justify-center text-gray-400 transition-all active:scale-90 hover:border-forest/30 hover:text-forest"
              >
                <RefreshCw size={11} />
              </button>
            )}

            {/* Join — yoga upcoming */}
            {isYogaUpcoming ? (
              <button
                onClick={() =>
                  navigate(
                    '/session-room?id=' + session.id + '&type=' +
                    (session.type === 'yoga-group' ? 'group' : 'personal')
                  )
                }
                className="px-4 py-1.5 rounded-full bg-forest text-[9px] font-bold uppercase tracking-widest text-white transition-all active:scale-95"
              >
                Join
              </button>
            ) : (
              /* Status badge — non-yoga or past sessions */
              <span
                className={cn(
                  'small-caps text-[7px] px-2 py-0.5 rounded-full border',
                  STATUS_STYLE[session.status] ?? STATUS_STYLE.upcoming,
                )}
              >
                {session.status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
