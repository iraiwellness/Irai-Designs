import {
  Home, Calendar, CalendarRange, BarChart3, Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  end?: boolean;
}

export const USER_NAV: NavItem[] = [
  { icon: Home,          label: 'Home',     path: '/user',              end: true  },
  { icon: Calendar,      label: 'Book',     path: '/user/booking',      end: false },
  { icon: CalendarRange, label: 'Sessions', path: '/user/sessions',     end: false },
  { icon: Users,         label: 'Groups',   path: '/user/group-sessions', end: false },
  { icon: BarChart3,     label: 'Insights', path: '/user/insights',     end: false },
];
