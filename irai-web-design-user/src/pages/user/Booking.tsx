import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2, Star, ChevronLeft, Search, Clock, Calendar,
  Globe, Video, Users, Stethoscope, Apple, Brain, Activity, Wind,
} from 'lucide-react';
import {
  MOCK_PRACTITIONERS, PRACTITIONER_CATEGORIES, CATEGORY_STYLE,
  getPractitionerAvailability, nextAvailableSlot, formatAvailDate, languageLabel,
} from '../../userData';
import type { BookablePractitioner, PractitionerCategory } from '../../types';
import { cn } from '../../lib/utils';

const CAT_ICON: Record<PractitionerCategory, typeof Users> = {
  yoga: Users, doctor: Stethoscope, nutrition: Apple, psych: Brain, physio: Activity, breathwork: Wind,
};

type Step = 'browse' | 'slots' | 'confirm' | 'done';

function parseCategoryParam(raw: string | null): PractitionerCategory | 'all' {
  const map: Record<string, PractitionerCategory | 'all'> = {
    all: 'all', yoga: 'yoga', doctor: 'doctor', nutrition: 'nutrition',
    psych: 'psych', physio: 'physio', breathwork: 'breathwork',
    // legacy home links
    type: 'all',
  };
  if (!raw) return 'all';
  return map[raw] ?? (['yoga', 'doctor', 'nutrition', 'psych', 'physio', 'breathwork'].includes(raw) ? raw as PractitionerCategory : 'all');
}

export default function Booking() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const initialCategory = parseCategoryParam(params.get('category') ?? params.get('type'));

  const [step, setStep] = useState<Step>('browse');
  const [category, setCategory] = useState<PractitionerCategory | 'all'>(initialCategory);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<BookablePractitioner | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_PRACTITIONERS.filter(p => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      const hay = `${p.firstName} ${p.lastName} ${p.title} ${p.bio} ${p.specializations.join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [category, search]);

  const availability = useMemo(
    () => (selected ? getPractitionerAvailability(selected) : []),
    [selected],
  );

  const activeDay = availability.find(d => d.date === selectedDate) ?? availability[0] ?? null;

  const selectPractitioner = (p: BookablePractitioner) => {
    setSelected(p);
    const days = getPractitionerAvailability(p);
    const first = days[0];
    setSelectedDate(first?.date ?? null);
    setSelectedSlot(null);
    setStep('slots');
  };

  const setCategoryFilter = (id: PractitionerCategory | 'all') => {
    setCategory(id);
    if (id === 'all') {
      params.delete('category');
      params.delete('type');
    } else {
      params.set('category', id);
      params.delete('type');
    }
    setParams(params, { replace: true });
  };

  const confirm = () => {
    setStep('done');
    setTimeout(() => navigate('/user/sessions'), 2800);
  };

  const goBack = () => {
    if (step === 'slots') { setStep('browse'); setSelected(null); setSelectedDate(null); setSelectedSlot(null); }
    else if (step === 'confirm') setStep('slots');
    else navigate('/user');
  };

  if (step === 'done') {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <CheckCircle2 size={48} className="text-forest mx-auto mb-4" />
          <h2 className="serif text-3xl text-slate">Booking requested</h2>
          <p className="text-[14px] text-gray-400 mt-2 leading-relaxed">
            Your session with {selected?.firstName} {selected?.lastName} on{' '}
            {selectedDate && formatAvailDate(selectedDate)} at {selectedSlot} has been sent to the practitioner.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'confirm' && selected && selectedDate && selectedSlot) {
    const style = CATEGORY_STYLE[selected.category];
    return (
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <button type="button" onClick={goBack}
          className="flex items-center gap-2 text-[13px] text-gray-400 hover:text-slate mb-6">
          <ChevronLeft size={16} /> Back
        </button>
        <p className="small-caps text-gray-400 mb-1">Confirm booking</p>
        <h1 className="serif text-3xl text-slate mb-6">Review &amp; request</h1>

        <div className="bg-white rounded-2xl border border-brand-border p-6 space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-brand-border">
            <PractitionerAvatar p={selected} />
            <div>
              <p className="font-bold text-slate">{selected.firstName} {selected.lastName}</p>
              <p className="text-[12px] text-gray-400">{selected.title}</p>
              <span className={cn('inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full', style.bg, style.text)}>
                {style.label}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-[13px]">
            <Row label="Date" value={formatAvailDate(selectedDate)} />
            <Row label="Time" value={selectedSlot} />
            <Row label="Duration" value={`${selected.durationMinutes} min`} />
            <Row label="Fee" value={`₹${selected.consultationFee.toLocaleString('en-IN')}`} />
            <Row label="Format" value="Video session" />
          </div>

          <p className="text-[12px] text-gray-400 bg-brand-50 rounded-xl p-3 leading-relaxed">
            This creates a booking request. The practitioner will confirm based on their schedule.
            Relationship status starts as <strong>requested</strong>.
          </p>

          <button type="button" onClick={confirm}
            className="w-full py-3.5 rounded-xl bg-forest text-white font-bold text-[14px] hover:bg-[#3d5636] transition-colors">
            Confirm Booking Request
          </button>
        </div>
      </div>
    );
  }

  if (step === 'slots' && selected) {
    const style = CATEGORY_STYLE[selected.category];
    const availCount = availability.reduce((n, d) => n + d.slots.filter(s => s.available).length, 0);

    return (
      <div className="p-6 lg:p-8">
        <button type="button" onClick={goBack}
          className="flex items-center gap-2 text-[13px] text-gray-400 hover:text-slate mb-6">
          <ChevronLeft size={16} /> All practitioners
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Practitioner summary */}
          <div className="xl:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-brand-border p-5">
              <div className="flex items-start gap-4">
                <PractitionerAvatar p={selected} large />
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-slate text-lg">{selected.firstName} {selected.lastName}</h2>
                  <p className="text-[12px] text-gray-400">{selected.title}</p>
                  <span className={cn('inline-block mt-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full', style.bg, style.text)}>
                    {style.label}
                  </span>
                </div>
              </div>
              <p className="text-[13px] text-gray-500 mt-4 leading-relaxed">{selected.bio}</p>
              <div className="flex flex-wrap gap-3 mt-4 text-[12px]">
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Star size={13} className="fill-amber-500" /> {selected.rating}
                </span>
                <span className="text-gray-400">{selected.experienceYears} yrs exp</span>
                <span className="text-gray-400">{selected.totalSessions} sessions</span>
                <span className="font-semibold text-slate">₹{selected.consultationFee}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {selected.specializations.map(s => (
                  <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 border border-brand-border text-gray-500">{s}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4 text-[12px] text-gray-400">
                <Globe size={13} />
                {selected.languages.map(languageLabel).join(', ')}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[12px]">
                <span className={cn('w-2 h-2 rounded-full', selected.isOnline ? 'bg-forest' : 'bg-gray-300')} />
                <span className="text-gray-500">{selected.isOnline ? 'Accepting bookings' : 'Offline — limited slots'}</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1.5">
                <Clock size={12} /> {availCount} open slots in the next 2 weeks
              </p>
            </div>
          </div>

          {/* Slot picker */}
          <div className="xl:col-span-2 space-y-5">
            <div>
              <p className="small-caps text-gray-400 mb-3">Select a date</p>
              {availability.length === 0 ? (
                <p className="text-[13px] text-gray-400 bg-white rounded-2xl border border-brand-border p-6">
                  No availability in the next two weeks. Try another practitioner.
                </p>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {availability.map(day => {
                    const open = day.slots.filter(s => s.available).length;
                    const active = selectedDate === day.date;
                    return (
                      <button key={day.date} type="button"
                        onClick={() => { setSelectedDate(day.date); setSelectedSlot(null); }}
                        className={cn(
                          'shrink-0 min-w-[88px] px-3 py-3 rounded-xl border text-center transition-colors',
                          active ? 'bg-forest text-white border-forest' : 'bg-white border-brand-border hover:border-forest/30',
                        )}>
                        <p className="text-[11px] font-bold">{formatAvailDate(day.date)}</p>
                        <p className={cn('text-[10px] mt-0.5', active ? 'text-white/70' : 'text-gray-400')}>
                          {open} slot{open !== 1 ? 's' : ''}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {activeDay && (
              <div className="bg-white rounded-2xl border border-brand-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="small-caps text-gray-400">Available times · {formatAvailDate(activeDay.date)}</p>
                  <p className="text-[12px] text-gray-400">{selected.durationMinutes}-min session</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {activeDay.slots.map(slot => (
                    <button key={slot.time} type="button" disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={cn(
                        'py-3 rounded-xl text-[12px] font-bold border flex items-center justify-center gap-1.5 transition-colors',
                        !slot.available && 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-300 border-brand-border',
                        slot.available && selectedSlot === slot.time && 'bg-forest text-white border-forest',
                        slot.available && selectedSlot !== slot.time && 'bg-white border-brand-border hover:border-forest/40 text-slate',
                      )}>
                      <Clock size={13} />
                      {slot.time}
                    </button>
                  ))}
                </div>
                {activeDay.slots.every(s => !s.available) && (
                  <p className="text-[13px] text-gray-400 mt-3">Fully booked on this day.</p>
                )}
              </div>
            )}

            <div className="bg-[#f0f4ee] rounded-xl border border-forest/20 p-4 flex gap-3 text-[12px] text-gray-600">
              <Video size={16} className="text-forest shrink-0 mt-0.5" />
              <p>
                Slots reflect practitioner availability from their schedule.
                {selected.bookingBufferDays > 0 && ` Bookings require ${selected.bookingBufferDays} day${selected.bookingBufferDays > 1 ? 's' : ''} advance notice.`}
              </p>
            </div>

            <button type="button" disabled={!selectedDate || !selectedSlot}
              onClick={() => setStep('confirm')}
              className="w-full py-3.5 rounded-xl bg-forest text-white font-bold text-[14px] disabled:opacity-40 hover:bg-[#3d5636] transition-colors">
              Continue to confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Browse — main practitioner list
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <p className="small-caps text-gray-400 mb-1">Book a session</p>
        <h1 className="serif text-3xl lg:text-4xl text-slate">Choose a practitioner</h1>
        <p className="text-[13px] text-gray-400 mt-2">
          Browse verified practitioners and book based on their availability.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {PRACTITIONER_CATEGORIES.map(cat => (
          <button key={cat.id} type="button" onClick={() => setCategoryFilter(cat.id)}
            className={cn(
              'shrink-0 px-4 py-2 rounded-xl text-[12px] font-bold border transition-colors',
              category === cat.id ? 'bg-forest text-white border-forest' : 'bg-white border-brand-border text-gray-500 hover:border-forest/30',
            )}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, specialty…"
          className="w-full bg-white border border-brand-border rounded-xl py-2.5 pl-10 pr-4 text-[13px] outline-none focus:border-forest/30" />
      </div>

      {/* Practitioner grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-border p-10 text-center">
          <p className="text-[14px] text-gray-400">No practitioners match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <PractitionerCard key={p.id} p={p} onSelect={() => selectPractitioner(p)} />
          ))}
        </div>
      )}
    </div>
  );
}

function PractitionerCard({ p, onSelect }: { p: BookablePractitioner; onSelect: () => void }) {
  const style = CATEGORY_STYLE[p.category];
  const Icon = CAT_ICON[p.category];
  const next = nextAvailableSlot(p);
  const openSlots = getPractitionerAvailability(p).reduce(
    (n, d) => n + d.slots.filter(s => s.available).length, 0,
  );

  return (
    <button type="button" onClick={onSelect}
      className="bg-white rounded-2xl border border-brand-border p-5 text-left hover:border-forest/30 hover:shadow-sm transition-all group">
      <div className="flex items-start gap-4 mb-3">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', style.bg)}>
          <Icon size={20} className={style.text} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate group-hover:text-forest transition-colors">
            {p.firstName} {p.lastName}
          </p>
          <p className="text-[12px] text-gray-400 truncate">{p.title}</p>
        </div>
        <span className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0', style.bg, style.text)}>
          {style.label}
        </span>
      </div>

      <p className="text-[12px] text-gray-500 line-clamp-2 mb-3 leading-relaxed">{p.bio}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {p.specializations.slice(0, 2).map(s => (
          <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 border border-brand-border text-gray-500">{s}</span>
        ))}
      </div>

      <div className="flex items-center justify-between text-[12px] pt-3 border-t border-brand-border">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-amber-600 font-semibold">
            <Star size={12} className="fill-amber-500" /> {p.rating}
          </span>
          <span className="text-gray-400">₹{p.consultationFee}</span>
        </div>
        <span className={cn('flex items-center gap-1 font-medium', p.isOnline ? 'text-forest' : 'text-gray-400')}>
          <span className={cn('w-1.5 h-1.5 rounded-full', p.isOnline ? 'bg-forest' : 'bg-gray-300')} />
          {p.isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        {next ? (
          <p className="text-[11px] text-gray-400 flex items-center gap-1">
            <Calendar size={11} />
            Next: {formatAvailDate(next.date)}, {next.time}
          </p>
        ) : (
          <p className="text-[11px] text-gray-400">No slots soon</p>
        )}
        <span className="text-[11px] font-bold text-forest">{openSlots} open</span>
      </div>
    </button>
  );
}

function PractitionerAvatar({ p, large }: { p: BookablePractitioner; large?: boolean }) {
  const style = CATEGORY_STYLE[p.category];
  const Icon = CAT_ICON[p.category];
  return (
    <div className={cn(
      'rounded-xl flex items-center justify-center shrink-0',
      large ? 'w-14 h-14' : 'w-12 h-12',
      style.bg,
    )}>
      <Icon size={large ? 22 : 18} className={style.text} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold text-slate">{value}</span>
    </div>
  );
}
