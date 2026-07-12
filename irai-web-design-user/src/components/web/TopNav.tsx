import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import type { NavItem } from './navConfig';

export default function TopNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="flex items-center gap-1 w-max">
      {items.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium transition-all whitespace-nowrap',
              isActive ? 'bg-[#f0f4ee] text-forest' : 'text-gray-500 hover:bg-brand-50 hover:text-slate',
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={16} className={cn('shrink-0', isActive ? 'text-forest' : 'text-gray-400')} />
              <span className="hidden sm:inline">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
