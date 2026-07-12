import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Clock, User, Play, Users, Wind, Leaf,
  ChevronLeft, ChevronRight, CheckCircle2,
  CalendarOff, Trash2, Palmtree, Stethoscope, Hourglass,
} from 'lucide-react';
import { format, addDays, startOfToday, isSameDay, subDays, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import type { FormEvent } from 'react';
import { MOCK_GROUP_SESSIONS, MOCK_PRACTITIONER_BREAKS } from '../../mockData';
import type { PractitionerGroupSession, PractitionerBreak, UnavailabilityKind, BreakRequestStatus } from '../../types';
import { cn } from '../../lib/utils';
import Modal from '../../components/ui/Modal';

type SlotStatus = 'booked' | 'available' | 'break' | 'off';

interface ScheduleSlot {
  id: string;
  time: string;
  status: SlotStatus;
  apptId?: string;
  name?: string;
  offReason?: string;
}

const BASE_SLOTS: Omit<ScheduleSlot, 'id' | 'status' | 'offReason'>[] = [
  { time: '09:00 AM', apptId: 'a1', name: 'Emma Watson' },
  { time: '10:00 AM' },
  { time: '11:30 AM', apptId: 'a2', name: 'James Rodriguez' },
  { time: '12:00 PM' },
  { time: '01:00 PM' },
  { time: '02:00 PM' },
  { time: '03:00 PM', apptId: 'a3', name: 'Sophia Chen' },
  { time: '04:00 PM' },
];

const CAT_ICON: Record<string, LucideIcon> = {
  yoga: Users, breathwork: Wind, meditation: Leaf, mobility: Users,
};

const CAT_COLOR: Record<string, string> = {
  yoga: '#4a6741', breathwork: '#4B7399', meditation: '#7B5EA7', mobility: '#E07B5A',
};

const REASON_OPTIONS = [
  'Personal leave',
  'Sick leave',
  'Holiday',
  'Doctor appointment',
  'Family emergency',
  'Other',
] as const;

const PARTIAL_START_OPTIONS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
const PARTIAL_END_OPTIONS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const CURRENT_PRACTITIONER_ID = 't1';

const STATUS_STYLE: Record<BreakRequestStatus, string> = {
  pending:  'text-amber-600 border-amber-200 bg-amber-50',
  approved: 'text-forest border-forest/20 bg-[#f0f4ee]',
  rejected: 'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
};

function dateKey(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

function parseSlotMinutes(time: string) {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function parse24hMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m ?? 0);
}

function format24hLabel(time: string) {
  const [h, m] = time.split(':').map(Number);
  const meridiem = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${meridiem}`;
}

function isApproved(b: PractitionerBreak) {
  return b.status === 'approved';
}

function getBreakForDate(breaks: PractitionerBreak[], key: string) {
  return breaks.filter(b => b.date === key);
}

function isApprovedFullDayOff(breaks: PractitionerBreak[], key: string) {
  return getBreakForDate(breaks, key).some(b => b.kind === 'day_off' && isApproved(b));
}

function isPendingDayOff(breaks: PractitionerBreak[], key: string) {
  return getBreakForDate(breaks, key).find(b => b.kind === 'day_off' && b.status === 'pending');
}

function slotIsBlocked(slotTime: string, breaks: PractitionerBreak[], key: string) {
  const dayBreaks = getBreakForDate(breaks, key).filter(isApproved);
  if (dayBreaks.some(b => b.kind === 'day_off')) {
    return dayBreaks.find(b => b.kind === 'day_off') ?? null;
  }
  const slotMin = parseSlotMinutes(slotTime);
  return dayBreaks.find(b => {
    if (b.kind !== 'partial') return false;
    const start = parse24hMinutes(b.startTime);
    const end = parse24hMinutes(b.endTime);
    return slotMin >= start && slotMin < end;
  }) ?? null;
}

function buildSlotsForDate(key: string, breaks: PractitionerBreak[]): ScheduleSlot[] {
  return BASE_SLOTS.map((slot, i) => {
    const blocked = slotIsBlocked(slot.time, breaks, key);
    if (blocked) {
      return {
        id: `slot-${slot.time}`,
        ...slot,
        status: 'off' as const,
        offReason: blocked.reason,
        apptId: undefined,
        name: undefined,
      };
    }
    if (i === 3) {
      return { id: `slot-${slot.time}`, ...slot, status: 'break' as const };
    }
    if (slot.apptId && slot.name) {
      return { id: `slot-${slot.time}`, ...slot, status: 'booked' as const };
    }
    return { id: `slot-${slot.time}`, ...slot, status: 'available' as const };
  });
}

function reasonIcon(reason: string) {
  if (reason.toLowerCase().includes('doctor') || reason.toLowerCase().includes('sick')) {
    return Stethoscope;
  }
  if (reason.toLowerCase().includes('holiday') || reason.toLowerCase().includes('personal')) {
    return Palmtree;
  }
  return CalendarOff;
}

export default function Schedule() {
  const navigate = useNavigate();
  const today = startOfToday();
  const [weekStart, setWeekStart] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [breaks, setBreaks] = useState<PractitionerBreak[]>(
    MOCK_PRACTITIONER_BREAKS.filter(b => b.practitionerId === CURRENT_PRACTITIONER_ID),
  );
  const [groupSessions, setGroupSessions] = useState(MOCK_GROUP_SESSIONS);
  const [showDayOff, setShowDayOff] = useState(false);
  const [showGroupCreate, setShowGroupCreate] = useState(false);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const selectedKey = dateKey(selectedDate);
  const slots = useMemo(() => buildSlotsForDate(selectedKey, breaks), [selectedKey, breaks]);
  const approvedFullDayOff = isApprovedFullDayOff(breaks, selectedKey);
  const pendingDayOff = isPendingDayOff(breaks, selectedKey);
  const dayBreaks = getBreakForDate(breaks, selectedKey);

  const booked = slots.filter(s => s.status === 'booked').length;
  const available = slots.filter(s => s.status === 'available').length;

  const upcomingBreaks = useMemo(
    () =>
      [...breaks]
        .filter(b => b.date >= dateKey(today))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [breaks, today],
  );

  const addGroupSession = (session: PractitionerGroupSession) => {
    setGroupSessions(prev => [session, ...prev]);
  };

  const handleRemoveBreak = (id: string) => {
    setBreaks(prev => prev.filter(b => b.id !== id));
  };

  const openDayOffModal = () => {
    setShowDayOff(true);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex justify-end mb-5">
        <button
          type="button"
          onClick={openDayOffModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate text-white rounded-xl text-[13px] font-bold hover:bg-slate/90 transition-colors"
        >
          <CalendarOff size={16} /> Day off
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
                const key = dateKey(date);
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, today);
                const dayItems = getBreakForDate(breaks, key);
                const hasOff = dayItems.length > 0;
                const approvedOff = isApprovedFullDayOff(breaks, key);
                const pendingOff = dayItems.some(b => b.kind === 'day_off' && b.status === 'pending');
                return (
                  <button key={date.toString()} type="button" onClick={() => setSelectedDate(date)}
                    className={cn('flex flex-col items-center gap-1 py-3 rounded-xl transition-all relative',
                      isSelected ? 'bg-slate text-white' : 'hover:bg-brand-50')}>
                    <span className={cn('text-[10px] font-bold uppercase', isSelected ? 'text-white/60' : 'text-gray-400')}>
                      {format(date, 'eee')}
                    </span>
                    <span className={cn(
                      'text-[16px] font-bold',
                      isSelected ? 'text-white' : isToday ? 'text-forest' : approvedOff ? 'text-terracotta' : pendingOff ? 'text-amber-600' : 'text-slate',
                    )}>
                      {format(date, 'd')}
                    </span>
                    {hasOff && (
                      <span className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        approvedOff ? 'bg-terracotta' : pendingOff ? 'bg-amber-400' : 'bg-forest/40',
                        isSelected && 'bg-white/70',
                      )} />
                    )}
                    {isToday && !isSelected && !hasOff && <span className="w-1.5 h-1.5 rounded-full bg-forest" />}
                  </button>
                );
              })}
            </div>
          </div>

          {pendingDayOff && !approvedFullDayOff && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4"
            >
              <div className="w-11 h-11 bg-white rounded-xl border border-amber-200 flex items-center justify-center shrink-0">
                <Hourglass size={20} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="small-caps text-amber-600 mb-1">Day off · Pending approval</p>
                <h3 className="serif text-xl text-slate leading-tight">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h3>
                <p className="text-[12px] text-gray-500 mt-1">{pendingDayOff.reason}</p>
                <p className="text-[11px] text-gray-400 mt-2">
                  Your schedule stays open until an admin approves this request.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveBreak(pendingDayOff.id)}
                className="shrink-0 w-8 h-8 rounded-lg border border-amber-200 flex items-center justify-center text-amber-500 hover:bg-white transition-colors"
                aria-label="Cancel request"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          )}

          {approvedFullDayOff ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#fdf3ec] border border-terracotta/20 rounded-2xl p-6 text-center space-y-4"
            >
              <div className="w-14 h-14 mx-auto bg-white rounded-2xl border border-terracotta/20 flex items-center justify-center">
                <CalendarOff size={24} className="text-terracotta" />
              </div>
              <div>
                <p className="small-caps text-terracotta mb-1">Day off · Approved</p>
                <h3 className="serif text-2xl text-slate">{format(selectedDate, 'EEEE, MMMM d')}</h3>
                <p className="text-[13px] text-gray-500 mt-2">
                  {dayBreaks.find(b => b.kind === 'day_off' && b.status === 'approved')?.reason ?? 'Unavailable'}
                </p>
              </div>
              <p className="text-[12px] text-gray-400">No sessions can be booked on this day.</p>
              <button
                type="button"
                onClick={() => {
                  const off = dayBreaks.find(b => b.kind === 'day_off' && b.status === 'approved');
                  if (off) handleRemoveBreak(off.id);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-terracotta/30 bg-white text-terracotta text-[12px] font-bold hover:bg-[#fdf3ec] transition-colors"
              >
                <Trash2 size={14} /> Remove day off
              </button>
            </motion.div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="small-caps text-gray-400">Time Slots</p>
                <p className="text-[13px] text-gray-400">
                  {format(selectedDate, 'EEEE, MMMM d')} · {booked} booked · {available} available
                </p>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={selectedKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl border border-brand-border shadow-sm divide-y divide-brand-border overflow-hidden">
                  {slots.map(slot => (
                    <div
                      key={slot.id}
                      className={cn(
                        'px-5 py-4 flex items-center gap-4',
                        slot.status === 'break' && 'opacity-50 bg-brand-50/30',
                        slot.status === 'off' && 'bg-[#fdf8f5]',
                      )}
                    >
                      <div className="flex items-center gap-2 w-24 shrink-0">
                        <Clock size={14} className="text-gray-300" />
                        <span className="text-[13px] font-semibold text-gray-500">{slot.time}</span>
                      </div>
                      {slot.status === 'booked' && <div className="w-1 h-8 bg-forest rounded-full shrink-0" />}
                      {slot.status === 'off' && <div className="w-1 h-8 bg-terracotta rounded-full shrink-0" />}
                      <div className="flex-1 min-w-0">
                        {slot.status === 'booked' ? (
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-forest" />
                            <span className="text-[14px] font-semibold text-slate">{slot.name}</span>
                          </div>
                        ) : slot.status === 'break' ? (
                          <span className="text-[13px] italic text-gray-400">Break / Blocked</span>
                        ) : slot.status === 'off' ? (
                          <div>
                            <span className="text-[13px] font-semibold text-terracotta">Unavailable</span>
                            {slot.offReason && (
                              <p className="text-[11px] text-gray-400 mt-0.5 truncate">{slot.offReason}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[12px] font-semibold text-forest/60 uppercase tracking-wider">Available</span>
                        )}
                      </div>
                      {slot.status === 'booked' && slot.apptId && (
                        <button type="button" onClick={() => navigate(`/practitioner/session/${slot.apptId}`)}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-forest rounded-lg text-white text-[12px] font-bold hover:bg-[#3d5636] transition-colors">
                          <Play size={12} fill="white" /> Start
                        </button>
                      )}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {upcomingBreaks.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="small-caps text-gray-400">Time Off & Leave</p>
                <button
                  type="button"
                  onClick={openDayOffModal}
                  className="text-[12px] font-semibold text-forest hover:underline"
                >
                  Day off
                </button>
              </div>
              <div className="space-y-2.5">
                {upcomingBreaks.map((item, i) => {
                  const Icon = reasonIcon(item.reason);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 flex items-center gap-3"
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                          item.kind === 'day_off' ? 'bg-[#fdf3ec] text-terracotta' : 'bg-amber-50 text-amber-600',
                        )}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[12px] font-bold text-slate">
                            {format(parseISO(item.date), 'EEE, MMM d')}
                          </p>
                          <span className={cn('small-caps text-[7px] px-2 py-0.5 rounded-full border capitalize', STATUS_STYLE[item.status])}>
                            {item.status}
                          </span>
                          <span
                            className={cn(
                              'small-caps text-[7px] px-2 py-0.5 rounded-full border',
                              item.kind === 'day_off'
                                ? 'bg-[#fdf3ec] text-terracotta border-terracotta/20'
                                : 'bg-amber-50 text-amber-700 border-amber-200',
                            )}
                          >
                            {item.kind === 'day_off' ? 'Day off' : 'Partial'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">{item.reason}</p>
                        {item.status === 'rejected' && item.rejectionReason && (
                          <p className="text-[10px] text-terracotta mt-0.5">Rejected: {item.rejectionReason}</p>
                        )}
                        {item.kind === 'partial' && (
                          <p className="small-caps text-[7px] text-gray-400 mt-0.5">
                            {format24hLabel(item.startTime)} – {format24hLabel(item.endTime)}
                          </p>
                        )}
                      </div>
                      {(item.status === 'pending' || item.status === 'rejected') && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBreak(item.id)}
                          className="w-8 h-8 rounded-lg border border-brand-border flex items-center justify-center text-gray-300 hover:text-terracotta hover:border-terracotta/30 transition-colors shrink-0"
                          aria-label="Cancel request"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}
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

      <DayOffModal
        open={showDayOff}
        onClose={() => setShowDayOff(false)}
        selectedDate={selectedKey}
        onSubmit={(entry) => {
          setBreaks(prev => {
            const withoutSameDayFull = entry.kind === 'day_off'
              ? prev.filter(b => !(b.date === entry.date && b.kind === 'day_off'))
              : prev;
            return [...withoutSameDayFull, entry];
          });
          setSelectedDate(parseISO(entry.date));
          setShowDayOff(false);
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

function DayOffModal({
  open,
  onClose,
  selectedDate,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  selectedDate: string;
  onSubmit: (entry: PractitionerBreak) => void;
}) {
  const [kind, setKind] = useState<UnavailabilityKind>('day_off');
  const [formDate, setFormDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [reason, setReason] = useState<string>(REASON_OPTIONS[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) setFormDate(selectedDate);
  }, [open, selectedDate]);

  const reset = () => {
    setKind('day_off');
    setFormDate(selectedDate);
    setStartTime('14:00');
    setEndTime('16:00');
    setReason(REASON_OPTIONS[0]);
    setNotes('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const canSubmit =
    formDate &&
    reason &&
    (kind === 'day_off' || parse24hMinutes(endTime) > parse24hMinutes(startTime));

  const handleSubmit = () => {
    if (!canSubmit) return;
    const fullReason = notes.trim() ? `${reason} — ${notes.trim()}` : reason;
    onSubmit({
      id: `br-${Date.now()}`,
      practitionerId: CURRENT_PRACTITIONER_ID,
      practitionerName: 'Dr. Sarah Mitchell',
      date: formDate,
      startTime: kind === 'day_off' ? '00:00' : startTime,
      endTime: kind === 'day_off' ? '23:59' : endTime,
      reason: fullReason,
      kind,
      status: kind === 'day_off' ? 'pending' : 'approved',
      isRecurring: false,
      recurringDay: null,
      requestedAt: new Date().toISOString(),
      reviewedAt: kind === 'partial' ? new Date().toISOString() : null,
    });
    reset();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Time Off">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: 'day_off' as const, label: 'Full day off', desc: 'Requires admin approval' },
            { id: 'partial' as const, label: 'Partial block', desc: 'Specific hours' },
          ]).map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => setKind(option.id)}
              className={cn(
                'p-3 rounded-xl border text-left transition-all',
                kind === option.id
                  ? 'border-forest bg-[#f0f4ee]'
                  : 'border-brand-border bg-white hover:border-forest/20',
              )}
            >
              <p className="text-[12px] font-bold text-slate">{option.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{option.desc}</p>
            </button>
          ))}
        </div>

        <div>
          <label className="small-caps text-[8px] text-gray-400 block mb-2">Date</label>
          <input
            type="date"
            value={formDate}
            onChange={e => setFormDate(e.target.value)}
            className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-3 text-[13px] text-slate outline-none focus:border-forest/30"
          />
        </div>

        {kind === 'partial' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="small-caps text-[8px] text-gray-400 block mb-2">From</label>
              <select
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-3 text-[13px] text-slate outline-none focus:border-forest/30"
              >
                {PARTIAL_START_OPTIONS.map(t => (
                  <option key={t} value={t}>{format24hLabel(t)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="small-caps text-[8px] text-gray-400 block mb-2">To</label>
              <select
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-3 text-[13px] text-slate outline-none focus:border-forest/30"
              >
                {PARTIAL_END_OPTIONS.map(t => (
                  <option key={t} value={t}>{format24hLabel(t)}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div>
          <label className="small-caps text-[8px] text-gray-400 block mb-2">Reason</label>
          <select
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-3 text-[13px] text-slate outline-none focus:border-forest/30"
          >
            {REASON_OPTIONS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="small-caps text-[8px] text-gray-400 block mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. Annual family trip"
            className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 px-3 text-[13px] text-slate placeholder:text-gray-300 outline-none focus:border-forest/30 resize-none"
          />
        </div>

        {kind === 'day_off' && (
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
            Full day off requests stay <strong>pending</strong> until an admin approves them. Your calendar remains bookable until then.
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3 rounded-xl border border-brand-border text-slate text-[13px] font-bold hover:bg-brand-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-3 rounded-xl bg-forest text-white text-[13px] font-bold disabled:opacity-40 hover:bg-forest/90 transition-colors"
          >
            {kind === 'day_off' ? 'Submit request' : 'Save time off'}
          </button>
        </div>
      </div>
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
