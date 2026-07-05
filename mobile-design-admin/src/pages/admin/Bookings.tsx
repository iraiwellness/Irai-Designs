import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Clock, Calendar, BookOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_BOOKINGS, AdminBooking, BookingStatus, BookingType, PlanId } from '../../adminData';
import { cn } from '../../lib/utils';

// ── Lookup tables ──────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<BookingType, string> = {
  'yoga-1on1':  'Yoga 1-on-1',
  'yoga-group': 'Group Yoga',
  doctor:       'Doctor',
  nutrition:    'Nutrition',
  physio:       'Physio',
  psych:        'Psychology',
};

const TYPE_COLOR: Record<BookingType, string> = {
  'yoga-1on1':  '#4a6741',
  'yoga-group': '#4a6741',
  doctor:       '#4B7399',
  nutrition:    '#e8a87c',
  physio:       '#E07B5A',
  psych:        '#7B5EA7',
};

const TYPE_BG: Record<BookingType, string> = {
  'yoga-1on1':  'bg-[#f0f4ee]',
  'yoga-group': 'bg-[#f0f4ee]',
  doctor:       'bg-[#eef3f9]',
  nutrition:    'bg-[#fdf3ec]',
  physio:       'bg-[#fdf3ec]',
  psych:        'bg-[#f3f0f9]',
};

const STATUS_STYLE: Record<BookingStatus, string> = {
  upcoming:  'text-forest border-forest/20 bg-[#f0f4ee]',
  completed: 'text-gray-400 border-gray-200 bg-gray-50',
  cancelled: 'text-terracotta border-terracotta/20 bg-[#fdf3ec]',
  missed:    'text-amber-600 border-amber-200 bg-amber-50',
};

const PLAN_STYLE: Record<PlanId, string> = {
  foundation: 'text-forest border-forest/20 bg-[#f0f4ee]',
  balanced:   'text-[#4B7399] border-[#4B7399]/20 bg-[#eef3f9]',
  transform:  'text-slate border-brand-border bg-[#f5f7f2]',
};

const FILTERS: { id: BookingStatus | 'all'; label: string }[] = [
  { id: 'all',       label: 'All' },
  { id: 'upcoming',  label: 'Upcoming' },
  { id: 'completed', label: 'Done' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'missed',    label: 'Missed' },
];

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminBookings() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [search, setSearch]  = useState('');

  const filtered = useMemo(() => {
    let list = ADMIN_BOOKINGS;
    if (filter !== 'all') list = list.filter(b => b.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.userName.toLowerCase().includes(q) || b.therapistName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, search]);

  const counts: Record<BookingStatus, number> = {
    upcoming:  ADMIN_BOOKINGS.filter(b => b.status === 'upcoming').length,
    completed: ADMIN_BOOKINGS.filter(b => b.status === 'completed').length,
    cancelled: ADMIN_BOOKINGS.filter(b => b.status === 'cancelled').length,
    missed:    ADMIN_BOOKINGS.filter(b => b.status === 'missed').length,
  };

  return (
    <div className="min-h-full bg-brand-50 pb-24">

      {/* ── Header ── */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-brand-border">
        <p className="small-caps text-gray-400 mb-1">Admin</p>
        <h2 className="serif text-3xl leading-none">All Bookings</h2>
        <p className="small-caps text-[7px] text-gray-400 mt-2">{ADMIN_BOOKINGS.length} total records</p>
      </div>

      <div className="p-6 space-y-5">

        {/* ── Status summary ── */}
        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(counts) as [BookingStatus, number][]).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilter(filter === status ? 'all' : status)}
              className={cn(
                'rounded-2xl border p-2.5 text-center shadow-sm transition-all active:scale-[0.97]',
                filter === status
                  ? 'bg-slate text-white border-slate'
                  : 'bg-white border-brand-border',
              )}
            >
              <p className={cn('text-base font-bold', filter === status ? 'text-white' : STATUS_STYLE[status].split(' ')[0])}>
                {count}
              </p>
              <p className={cn('text-[7px] uppercase tracking-widest mt-0.5 leading-tight font-semibold capitalize', filter === status ? 'text-white/60' : 'text-gray-400')}>
                {status}
              </p>
            </button>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search user or therapist..."
            className="w-full bg-white border border-brand-border rounded-xl py-3 pl-10 pr-9 text-[12px] text-slate placeholder:text-gray-300 outline-none focus:border-forest/30 transition-colors shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <X size={13} className="text-gray-300" />
            </button>
          )}
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-1">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 border transition-all',
                filter === f.id
                  ? 'bg-slate text-white border-slate'
                  : 'bg-white text-gray-400 border-brand-border',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="small-caps text-gray-400 text-[8px] px-1">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* ── Cards ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter + search}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen size={28} className="mx-auto mb-3 text-gray-200" />
                <p className="small-caps text-[9px] text-gray-300">No bookings found</p>
              </div>
            ) : (
              filtered.map((booking, i) => (
                <BookingCard key={booking.id} booking={booking} index={i} />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Booking Card ───────────────────────────────────────────────────────────────

function BookingCard({ booking, index }: { booking: AdminBooking; index: number }) {
  const color = TYPE_COLOR[booking.type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden"
    >
      <div className="h-0.5 w-full" style={{ backgroundColor: color }} />
      <div className="p-4 space-y-3">

        {/* User row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0', TYPE_BG[booking.type])}>
              <span style={{ color }}>{booking.userName.charAt(0)}</span>
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate">{booking.userName}</p>
              <p className="small-caps text-[7px] text-gray-400 truncate max-w-[150px]">{booking.therapistName}</p>
            </div>
          </div>
          <span className={cn('small-caps text-[7px] px-2.5 py-1 rounded-full border shrink-0', STATUS_STYLE[booking.status])}>
            {booking.status}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between pt-2.5 border-t border-brand-border">
          <div className="flex items-center gap-2">
            <span className={cn('small-caps text-[7px] px-2 py-0.5 rounded-full border', PLAN_STYLE[booking.planId])}>
              {booking.planId}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-tight" style={{ color }}>
              {TYPE_LABEL[booking.type]}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <div className="flex items-center gap-1">
              <Calendar size={10} />
              <span className="text-[9px] text-gray-400">
                {new Date(booking.date + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={10} />
              <span className="text-[9px] text-forest">{booking.time}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
