import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Video, Users, Stethoscope, Apple, Brain, Activity } from 'lucide-react';
import { MOCK_SESSIONS } from '../../userData';
import type { Session } from '../../userData';
import Modal from '../../components/ui/Modal';
import DateRangeFilter, { defaultDateFilter } from '../../components/ui/DateRangeFilter';
import { cn } from '../../lib/utils';
import { formatLongDate, isDateInRange } from '../../lib/dates';

const STATUS_STYLE = {
  upcoming: 'text-forest border-forest/20 bg-[#f0f4ee]',
  completed: 'text-gray-400 border-gray-200 bg-gray-50',
  missed: 'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
  cancelled: 'text-amber-600 border-amber-200 bg-amber-50',
};

const SESSION_ICON = {
  'yoga-group': Users,
  'yoga-1on1': Users,
  doctor: Stethoscope,
  nutrition: Apple,
  psych: Brain,
  physio: Activity,
};

const TIME_SLOTS = ['08:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];

export default function Sessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [dateFilter, setDateFilter] = useState(defaultDateFilter('this_month'));
  const [reschedule, setReschedule] = useState<Session | null>(null);
  const [newSlot, setNewSlot] = useState('');

  const filtered = useMemo(() => {
    let list = sessions.filter(s => isDateInRange(s.date, dateFilter.range));
    if (filter !== 'all') list = list.filter(s => s.status === filter);
    return list.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [sessions, filter, dateFilter]);

  const submitReschedule = () => {
    if (!reschedule || !newSlot) return;
    setSessions(prev => prev.map(s => s.id === reschedule.id ? { ...s, time: newSlot } : s));
    setReschedule(null);
    setNewSlot('');
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <DateRangeFilter value={dateFilter} onChange={setDateFilter} />
        <div className="flex flex-wrap gap-2">
          {(['all', 'upcoming', 'completed'] as const).map(f => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={cn('px-4 py-2 rounded-full text-[11px] font-bold uppercase border',
                filter === f ? 'bg-slate text-white border-slate' : 'bg-white text-gray-400 border-brand-border')}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border p-12 text-center">
            <Calendar size={28} className="mx-auto mb-3 text-gray-200" />
            <p className="text-[14px] text-gray-400">No sessions in this date range.</p>
          </div>
        ) : (
          filtered.map(s => {
            const Icon = SESSION_ICON[s.type] ?? Calendar;
            return (
              <div key={s.id} className="bg-white rounded-2xl border border-brand-border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-forest" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate">{s.title}</p>
                  <p className="text-[12px] text-gray-400">
                    {s.provider ?? 'Group session'} · {formatLongDate(s.date)} · {s.time}
                  </p>
                  <span className={cn('inline-block mt-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border', STATUS_STYLE[s.status])}>
                    {s.status}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0">
                  {s.status === 'upcoming' && (
                    <>
                      <button type="button" onClick={() => setReschedule(s)}
                        className="px-4 py-2 rounded-xl border border-brand-border text-[12px] font-bold">Reschedule</button>
                      <button type="button" onClick={() => navigate(`/user/session-room?id=${s.id}&type=${s.type.includes('group') ? 'group' : 'personal'}`)}
                        className="px-4 py-2 rounded-xl bg-forest text-white text-[12px] font-bold flex items-center gap-1.5">
                        <Video size={14} /> Join
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal open={!!reschedule} onClose={() => setReschedule(null)} title="Reschedule Session">
        <p className="text-[13px] text-gray-500 mb-4">Select a new time for {reschedule?.title}</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {TIME_SLOTS.map(t => (
            <button key={t} type="button" onClick={() => setNewSlot(t)}
              className={cn('py-2 rounded-xl text-[12px] font-bold border',
                newSlot === t ? 'bg-forest text-white border-forest' : 'border-brand-border')}>{t}</button>
          ))}
        </div>
        <button type="button" disabled={!newSlot} onClick={submitReschedule}
          className="w-full py-2.5 rounded-xl bg-forest text-white text-[13px] font-bold disabled:opacity-50">Confirm</button>
      </Modal>
    </div>
  );
}
