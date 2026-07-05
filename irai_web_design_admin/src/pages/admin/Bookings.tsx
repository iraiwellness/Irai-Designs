import { useState, useMemo } from 'react';
import { Search, X, BookOpen } from 'lucide-react';
import {
  ADMIN_BOOKINGS, type AdminBooking, type BookingStatus, type BookingType, type PlanId,
} from '../../adminData';
import { cn } from '../../lib/utils';

const TYPE_LABEL: Record<BookingType, string> = {
  'yoga-1on1': 'Yoga 1-on-1', 'yoga-group': 'Group Yoga', doctor: 'Doctor',
  nutrition: 'Nutrition', physio: 'Physio', psych: 'Psychology',
};

const TYPE_COLOR: Record<BookingType, string> = {
  'yoga-1on1': '#4a6741', 'yoga-group': '#4a6741', doctor: '#4B7399',
  nutrition: '#e8a87c', physio: '#E07B5A', psych: '#7B5EA7',
};

const STATUS_STYLE: Record<BookingStatus, string> = {
  upcoming: 'text-forest border-forest/20 bg-[#f0f4ee]',
  completed: 'text-gray-400 border-gray-200 bg-gray-50',
  cancelled: 'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
  missed: 'text-amber-600 border-amber-200 bg-amber-50',
};

const FILTERS: { id: BookingStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Done' }, { id: 'cancelled', label: 'Cancelled' }, { id: 'missed', label: 'Missed' },
];

export default function AdminBookings() {
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = ADMIN_BOOKINGS;
    if (filter !== 'all') list = list.filter(b => b.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b => b.userName.toLowerCase().includes(q) || b.therapistName.toLowerCase().includes(q));
    }
    return list;
  }, [filter, search]);

  const counts = {
    upcoming: ADMIN_BOOKINGS.filter(b => b.status === 'upcoming').length,
    completed: ADMIN_BOOKINGS.filter(b => b.status === 'completed').length,
    cancelled: ADMIN_BOOKINGS.filter(b => b.status === 'cancelled').length,
    missed: ADMIN_BOOKINGS.filter(b => b.status === 'missed').length,
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <p className="small-caps text-gray-400 mb-1">Admin</p>
        <h1 className="serif text-4xl text-slate">All Bookings</h1>
        <p className="text-[13px] text-gray-400 mt-1">{ADMIN_BOOKINGS.length} total records</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {(Object.entries(counts) as [BookingStatus, number][]).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilter(filter === status ? 'all' : status)}
            className={cn(
              'rounded-2xl border p-4 text-left transition-all',
              filter === status ? 'bg-slate text-white border-slate' : 'bg-white border-brand-border hover:border-forest/20',
            )}
          >
            <p className={cn('text-2xl font-bold', filter === status ? 'text-white' : STATUS_STYLE[status].split(' ')[0])}>{count}</p>
            <p className={cn('text-[11px] uppercase tracking-wider mt-1 capitalize', filter === status ? 'text-white/60' : 'text-gray-400')}>{status}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user or therapist..."
            className="w-full bg-white border border-brand-border rounded-xl py-2.5 pl-10 pr-9 text-[13px] outline-none focus:border-forest/30" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} className="text-gray-300" /></button>}
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={cn('px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all',
                filter === f.id ? 'bg-slate text-white border-slate' : 'bg-white text-gray-400 border-brand-border')}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16"><BookOpen size={32} className="mx-auto mb-3 text-gray-200" /><p className="text-gray-400">No bookings found</p></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border bg-brand-50/50">
                {['User', 'Therapist', 'Type', 'Date', 'Time', 'Plan', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <BookingRow key={b.id} booking={b} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function BookingRow({ booking }: { booking: AdminBooking }) {
  const color = TYPE_COLOR[booking.type];
  return (
    <tr className="border-b border-brand-border last:border-0 hover:bg-brand-50/30 transition-colors">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-[13px] font-semibold text-slate">{booking.userName}</span>
        </div>
      </td>
      <td className="px-5 py-4 text-[13px] text-gray-500">{booking.therapistName}</td>
      <td className="px-5 py-4"><span className="text-[11px] font-bold uppercase" style={{ color }}>{TYPE_LABEL[booking.type]}</span></td>
      <td className="px-5 py-4 text-[13px] text-gray-500">{new Date(booking.date + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
      <td className="px-5 py-4 text-[13px] font-semibold text-forest">{booking.time}</td>
      <td className="px-5 py-4"><span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-brand-50 border border-brand-border capitalize">{booking.planId}</span></td>
      <td className="px-5 py-4"><span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', STATUS_STYLE[booking.status])}>{booking.status}</span></td>
    </tr>
  );
}
