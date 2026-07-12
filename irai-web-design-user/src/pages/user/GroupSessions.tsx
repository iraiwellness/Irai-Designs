import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Wind, Leaf, Activity, CheckCircle2, Calendar } from 'lucide-react';
import { GROUP_SESSIONS } from '../../userData';
import type { GroupSession } from '../../userData';
import DateRangeFilter, { defaultDateFilter } from '../../components/ui/DateRangeFilter';
import { cn } from '../../lib/utils';
import { eachDateInRange, formatLongDate, weekdayFromDateStr } from '../../lib/dates';

const FILTERS = ['all', 'yoga', 'breathwork', 'meditation', 'mobility'] as const;
const CAT_ICON = { yoga: Users, breathwork: Wind, meditation: Leaf, mobility: Activity };

interface GroupOccurrence {
  session: GroupSession;
  date: string;
}

export default function GroupSessions() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');
  const [dateFilter, setDateFilter] = useState(defaultDateFilter('this_week'));
  const [selected, setSelected] = useState<GroupOccurrence | null>(null);
  const [joined, setJoined] = useState<string | null>(null);

  const occurrences = useMemo(() => {
    const dates = eachDateInRange(dateFilter.range);
    const result: GroupOccurrence[] = [];

    for (const date of dates) {
      const weekday = weekdayFromDateStr(date);
      for (const session of GROUP_SESSIONS) {
        if (filter !== 'all' && session.category !== filter) continue;
        if (!session.days.includes(weekday)) continue;
        result.push({ session, date });
      }
    }

    return result.sort((a, b) => a.date.localeCompare(b.date) || a.session.time.localeCompare(b.session.time));
  }, [filter, dateFilter]);

  const join = (occ: GroupOccurrence) => {
    setJoined(`${occ.session.id}-${occ.date}`);
    setSelected(occ);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <DateRangeFilter value={dateFilter} onChange={setDateFilter} />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={cn('px-4 py-2 rounded-full text-[11px] font-bold uppercase border',
                filter === f ? 'bg-slate text-white border-slate' : 'bg-white text-gray-400 border-brand-border')}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {occurrences.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-border p-12 text-center">
          <Calendar size={28} className="mx-auto mb-3 text-gray-200" />
          <p className="text-[14px] text-gray-400">No group sessions in this date range.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {occurrences.map(occ => {
            const { session: gs, date } = occ;
            const Icon = CAT_ICON[gs.category];
            const key = `${gs.id}-${date}`;
            return (
              <div key={key} className="bg-white rounded-2xl border border-brand-border p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Icon size={18} className="text-forest" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate">{gs.title}</p>
                    <p className="text-[12px] text-gray-400">{gs.instructor} · {gs.level}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#f0f4ee] text-forest">
                    {weekdayFromDateStr(date)}
                  </span>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-4 line-clamp-2">{gs.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-400">
                    {formatLongDate(date)} · {gs.time} · {gs.duration} min
                  </span>
                  <button type="button" onClick={() => join(occ)}
                    className="px-4 py-2 rounded-xl bg-forest text-white text-[12px] font-bold">Join</button>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  Recurring: {gs.days.join(', ')} · {gs.enrolled}/{gs.capacity} enrolled
                </p>
              </div>
            );
          })}
        </div>
      )}

      {selected && joined === `${selected.session.id}-${selected.date}` && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl border border-brand-border p-6 max-w-md w-full text-center">
            <CheckCircle2 size={40} className="text-forest mx-auto mb-3" />
            <h3 className="serif text-2xl text-slate">Joined {selected.session.title}</h3>
            <p className="text-[13px] text-gray-400 mt-2 mb-1">
              {formatLongDate(selected.date)} at {selected.session.time}
            </p>
            <p className="text-[13px] text-gray-400 mb-6">
              {selected.session.enrolled + 1}/{selected.session.capacity} enrolled
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setJoined(null); setSelected(null); }}
                className="flex-1 py-2.5 rounded-xl border border-brand-border font-bold text-[13px]">Close</button>
              <button type="button" onClick={() => navigate(`/user/session-room?id=${selected.session.id}&type=group`)}
                className="flex-1 py-2.5 rounded-xl bg-forest text-white font-bold text-[13px]">Enter Room</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
