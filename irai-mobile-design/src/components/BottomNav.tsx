import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar, MessageSquare, User } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: Home,          label: 'Home',     path: '/practitioner',          end: true  },
  { icon: Users,         label: 'Clients',  path: '/practitioner/clients',  end: false },
  { icon: Calendar,      label: 'Schedule', path: '/practitioner/schedule', end: false },
  { icon: MessageSquare, label: 'Chats',    path: '/practitioner/chats',    end: false },
  { icon: User,          label: 'Profile',  path: '/practitioner/profile',  end: false },
];

export default function BottomNav() {
  return (
    <>
      {navItems.map(item => (
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
