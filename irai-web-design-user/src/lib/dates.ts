export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface CalCell {
  day: number;
  currentMonth: boolean;
  dateStr: string;
}

export interface DayPill {
  dateStr: string;
  weekday: string;
  label: string;
  dayNum: number;
}

export function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function todayDateStr() {
  const t = new Date();
  return toDateStr(t.getFullYear(), t.getMonth(), t.getDate());
}

export function weekdayFromDateStr(dateStr: string) {
  return WEEKDAY_NAMES[new Date(dateStr + 'T12:00:00').getDay()];
}

export function formatLongDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

export function formatShortDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function buildMonthCells(viewYear: number, viewMonth: number): CalCell[] {
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
}

export function getNextDayPills(count: number, startFrom = new Date()): DayPill[] {
  const result: DayPill[] = [];
  const d = new Date(startFrom);
  d.setHours(12, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    const dateStr = toDateStr(d.getFullYear(), d.getMonth(), d.getDate());
    const weekday = WEEKDAY_NAMES[d.getDay()];
    result.push({
      dateStr,
      weekday,
      label: formatShortDate(dateStr),
      dayNum: d.getDate(),
    });
    d.setDate(d.getDate() + 1);
  }
  return result;
}

export type RelativePreset = 'today' | 'tomorrow' | 'this_week' | 'this_month';

export interface DateRange {
  start: string;
  end: string;
}

export function addDaysToDateStr(dateStr: string, days: number) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return toDateStr(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getRelativeDateRange(preset: RelativePreset): DateRange {
  const today = todayDateStr();
  if (preset === 'today') return { start: today, end: today };
  if (preset === 'tomorrow') {
    const t = addDaysToDateStr(today, 1);
    return { start: t, end: t };
  }
  if (preset === 'this_week') {
    const d = new Date(today + 'T12:00:00');
    const dow = d.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(d);
    monday.setDate(d.getDate() + mondayOffset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: toDateStr(monday.getFullYear(), monday.getMonth(), monday.getDate()),
      end: toDateStr(sunday.getFullYear(), sunday.getMonth(), sunday.getDate()),
    };
  }
  const d = new Date(today + 'T12:00:00');
  const start = toDateStr(d.getFullYear(), d.getMonth(), 1);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return { start, end: toDateStr(last.getFullYear(), last.getMonth(), last.getDate()) };
}

export function isDateInRange(dateStr: string, range: DateRange) {
  return dateStr >= range.start && dateStr <= range.end;
}

export function formatRangeLabel(range: DateRange, preset?: RelativePreset) {
  if (preset === 'today') return 'Today';
  if (preset === 'tomorrow') return 'Tomorrow';
  if (preset === 'this_week') return 'This week';
  if (preset === 'this_month') return 'This month';
  if (range.start === range.end) {
    return new Date(range.start + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  const s = new Date(range.start + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const e = new Date(range.end + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${s} – ${e}`;
}

export function eachDateInRange(range: DateRange): string[] {
  const dates: string[] = [];
  let cur = range.start;
  while (cur <= range.end) {
    dates.push(cur);
    cur = addDaysToDateStr(cur, 1);
  }
  return dates;
}
