import { useState, useMemo } from 'react';
import { Search, X, BookOpen } from 'lucide-react';
import {
  ADMIN_BOOKINGS, type AdminBooking, type BookingStatus, type BookingType,
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
  requested:  'text-amber-600 border-amber-200 bg-amber-50',
  scheduled:  'text-[#4B7399] border-[#4B7399]/20 bg-[#eef3f9]',
  confirmed:  'text-forest border-forest/20 bg-[#f0f4ee]',
  completed:  'text-gray-400 border-gray-200 bg-gray-50',
  cancelled:  'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
  missed:     'text-amber-600 border-amber-200 bg-amber-50',
  'no-show':  'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  requested: 'Requested', scheduled: 'Scheduled', confirmed: 'Confirmed',
  completed: 'Completed', cancelled: 'Cancelled', missed: 'Missed', 'no-show': 'No-show',
};

// Order mirrors the backend Session.SESSION_STATUS_CHOICES enum.
const STATUS_ORDER: BookingStatus[] = [
  'requested', 'scheduled', 'confirmed', 'completed', 'cancelled', 'missed', 'no-show',
];

export default function AdminBookings() {
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = ADMIN_BOOKINGS;
    if (filter !== 'all') list = list.filter(b => b.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.userName.toLowerCase().includes(q) ||
        b.therapistName.toLowerCase().includes(q) ||
        b.bookingId.toLowerCase().includes(q),
      );
    }
    return list;
  }, [filter, search]);

  const counts = useMemo(() => {
    const c: Record<BookingStatus, number> = {
      requested: 0, scheduled: 0, confirmed: 0, completed: 0, cancelled: 0, missed: 0, 'no-show': 0,
    };
    ADMIN_BOOKINGS.forEach(b => { c[b.status] += 1; });
    return c;
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <p className="small-caps text-gray-400 mb-1">Admin</p>
        <h1 className="serif text-4xl text-slate">All Bookings</h1>
        <p className="text-[13px] text-gray-400 mt-1">{ADMIN_BOOKINGS.length} total records</p>
      </div>

      {/* Status filter chips — one per backend Session status */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all',
            filter === 'all' ? 'bg-slate text-white border-slate' : 'bg-white text-gray-400 border-brand-border hover:border-forest/20',
          )}
        >
          All · {ADMIN_BOOKINGS.length}
        </button>
        {STATUS_ORDER.map(status => (
          <button
            key={status}
            onClick={() => setFilter(filter === status ? 'all' : status)}
            className={cn(
              'px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all',
              filter === status ? 'bg-slate text-white border-slate' : 'bg-white text-gray-400 border-brand-border hover:border-forest/20',
            )}
          >
            {STATUS_LABEL[status]} · {counts[status]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search booking ID, user, or therapist..."
            className="w-full bg-white border border-brand-border rounded-xl py-2.5 pl-10 pr-9 text-[13px] outline-none focus:border-forest/30" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} className="text-gray-300" /></button>}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16"><BookOpen size={32} className="mx-auto mb-3 text-gray-200" /><p className="text-gray-400">No bookings found</p></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border bg-brand-50/50">
                {['Booking ID', 'User', 'Therapist', 'Type', 'Date', 'Time', 'Plan', 'Status'].map(h => (
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
        <span className="text-[12px] font-mono font-semibold text-slate">{booking.bookingId}</span>
      </td>
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
      <td className="px-5 py-4"><span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', STATUS_STYLE[booking.status])}>{STATUS_LABEL[booking.status]}</span></td>
    </tr>
  );
}
