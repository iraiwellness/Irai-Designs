import { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  MONTH_NAMES, DAY_LABELS, buildMonthCells, getRelativeDateRange, formatRangeLabel,
  todayDateStr, type DateRange, type RelativePreset,
} from '../../lib/dates';

const RELATIVE_OPTIONS: { id: RelativePreset; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'this_week', label: 'This week' },
  { id: 'this_month', label: 'This month' },
];

export type DateFilterValue =
  | { mode: 'relative'; preset: RelativePreset; range: DateRange }
  | { mode: 'absolute'; range: DateRange };

export function defaultDateFilter(preset: RelativePreset = 'this_month'): DateFilterValue {
  const range = getRelativeDateRange(preset);
  return { mode: 'relative', preset, range };
}

interface DateRangeFilterProps {
  value: DateFilterValue;
  onChange: (value: DateFilterValue) => void;
}

export default function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [pickStart, setPickStart] = useState<string | null>(null);
  const [pickEnd, setPickEnd] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const todayStr = todayDateStr();

  const label = value.mode === 'relative'
    ? formatRangeLabel(value.range, value.preset)
    : formatRangeLabel(value.range);

  const cells = useMemo(() => buildMonthCells(viewYear, viewMonth), [viewYear, viewMonth]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  useEffect(() => {
    if (open && value.mode === 'absolute') {
      setPickStart(value.range.start);
      setPickEnd(value.range.end);
    }
  }, [open, value]);

  const selectRelative = (preset: RelativePreset) => {
    onChange({ mode: 'relative', preset, range: getRelativeDateRange(preset) });
    setOpen(false);
  };

  const onCalendarDay = (dateStr: string) => {
    if (!pickStart || (pickStart && pickEnd)) {
      setPickStart(dateStr);
      setPickEnd(null);
      return;
    }
    const start = dateStr < pickStart ? dateStr : pickStart;
    const end = dateStr < pickStart ? pickStart : dateStr;
    setPickStart(start);
    setPickEnd(end);
    onChange({ mode: 'absolute', range: { start, end } });
    setOpen(false);
  };

  const inPickedRange = (dateStr: string) => {
    if (!pickStart) return false;
    const end = pickEnd ?? pickStart;
    const lo = pickStart < end ? pickStart : end;
    const hi = pickStart < end ? end : pickStart;
    return dateStr >= lo && dateStr <= hi;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl border text-[13px] font-semibold transition-colors',
          open ? 'border-forest bg-[#f0f4ee] text-forest' : 'border-brand-border bg-white text-slate hover:border-forest/30',
        )}
      >
        <Calendar size={15} className="text-gray-400" />
        {label}
        <ChevronDown size={14} className={cn('text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 w-[min(100vw-2rem,320px)] bg-white border border-brand-border rounded-2xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-brand-border">
            <p className="small-caps text-[8px] text-gray-400 mb-2 px-1">Relative</p>
            <div className="grid grid-cols-2 gap-1.5">
              {RELATIVE_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => selectRelative(opt.id)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-[12px] font-bold text-left transition-colors',
                    value.mode === 'relative' && value.preset === opt.id
                      ? 'bg-forest text-white'
                      : 'bg-brand-50 text-slate hover:bg-[#f0f4ee]',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3">
            <p className="small-caps text-[8px] text-gray-400 mb-2 px-1">Custom range</p>
            <div className="flex items-center justify-between mb-2">
              <button type="button" onClick={() => {
                if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
                else setViewMonth(m => m - 1);
              }}
                className="w-7 h-7 rounded-lg border border-brand-border flex items-center justify-center text-forest">
                <ChevronLeft size={14} />
              </button>
              <span className="text-[13px] font-semibold text-slate">{MONTH_NAMES[viewMonth]} {viewYear}</span>
              <button type="button" onClick={() => {
                if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
                else setViewMonth(m => m + 1);
              }}
                className="w-7 h-7 rounded-lg border border-brand-border flex items-center justify-center text-forest">
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-0.5">
              {DAY_LABELS.map((d, i) => (
                <div key={i} className="text-center text-[9px] font-bold text-gray-300 py-0.5">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {cells.map((cell, i) => {
                const isToday = cell.dateStr === todayStr;
                const inRange = cell.currentMonth && inPickedRange(cell.dateStr);
                const isStart = cell.dateStr === pickStart;
                const isEnd = cell.dateStr === pickEnd;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!cell.currentMonth}
                    onClick={() => cell.currentMonth && onCalendarDay(cell.dateStr)}
                    className={cn(
                      'h-8 rounded-lg text-[11px] font-bold transition-colors',
                      !cell.currentMonth && 'opacity-0 pointer-events-none',
                      inRange && 'bg-[#f0f4ee] text-forest',
                      (isStart || isEnd) && 'bg-forest text-white',
                      !inRange && cell.currentMonth && 'hover:bg-brand-50 text-slate',
                      isToday && !inRange && 'ring-1 ring-forest/30',
                    )}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 mt-2 px-1">
              {pickStart && !pickEnd ? 'Select end date' : 'Click start and end dates'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
