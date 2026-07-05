import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, CalendarRange, UserCheck, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview',   path: '/admin',             end: true  },
  { icon: CalendarCheck,   label: 'Bookings',   path: '/admin/bookings',    end: false },
  { icon: CalendarRange,   label: 'Sessions',   path: '/admin/sessions',    end: false },
  { icon: UserCheck,       label: 'Therapists', path: '/admin/therapists',  end: false },
  { icon: ShieldAlert,     label: 'Disputes',   path: '/admin/disputes',    end: false },
];

export default function AdminBottomNav() {
  return (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 transition-colors',
              isActive ? 'text-forest' : 'text-gray-300',
            )
          }
        >
          <item.icon size={18} />
          <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
        </NavLink>
      ))}
    </>
  );
}
