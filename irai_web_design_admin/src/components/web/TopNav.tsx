import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import type { NavItem } from './navConfig';

interface TopNavProps {
  items: NavItem[];
}

export default function TopNav({ items }: TopNavProps) {
  return (
    <nav className="flex items-center gap-1">
      {items.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all',
              isActive
                ? 'bg-[#f0f4ee] text-forest'
                : 'text-gray-500 hover:bg-brand-50 hover:text-slate',
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                size={16}
                className={cn('shrink-0', isActive ? 'text-forest' : 'text-gray-400')}
              />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
