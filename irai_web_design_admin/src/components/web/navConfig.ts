import {
  Home, Users, Calendar, MessageSquare, User,
  LayoutDashboard, CalendarCheck, CalendarRange, UserCheck, ShieldAlert, CalendarOff,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  end?: boolean;
}

export const PRACTITIONER_NAV: NavItem[] = [
  { icon: Home,          label: 'Home',     path: '/practitioner',          end: true  },
  { icon: Users,         label: 'Clients',  path: '/practitioner/clients',  end: false },
  { icon: Calendar,      label: 'Schedule', path: '/practitioner/schedule', end: false },
  { icon: MessageSquare, label: 'Messages', path: '/practitioner/chats',    end: false },
  { icon: User,          label: 'Profile',  path: '/practitioner/profile',  end: false },
];

export const ADMIN_NAV: NavItem[] = [
  { icon: LayoutDashboard, label: 'Home',       path: '/admin',             end: true  },
  { icon: CalendarCheck,   label: 'Bookings',   path: '/admin/bookings',    end: false },
  { icon: CalendarRange,   label: 'Sessions',   path: '/admin/sessions',    end: false },
  { icon: UserCheck,       label: 'Therapists', path: '/admin/therapists',  end: false },
  { icon: CalendarOff,     label: 'Leave',      path: '/admin/leave',       end: false },
  { icon: Users,           label: 'Users',      path: '/admin/users',       end: false },
  { icon: ShieldAlert,     label: 'Disputes',   path: '/admin/disputes',    end: false },
];
