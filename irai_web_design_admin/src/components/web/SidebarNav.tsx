import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import type { NavItem } from './navConfig';

interface SidebarNavProps {
  items: NavItem[];
  workspace: 'practitioner' | 'admin';
}

export default function SidebarNav({ items, workspace }: SidebarNavProps) {
  return (
    <aside className="w-60 shrink-0 flex flex-col bg-white border-r border-brand-border h-screen sticky top-0">
      <div className="px-5 pt-6 pb-5 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#263d23] to-[#192b16] flex items-center justify-center shrink-0">
            <span className="font-serif text-sm text-white/90 font-semibold">ir</span>
          </div>
          <div className="min-w-0">
            <p className="font-serif text-lg text-slate leading-none">IRAI</p>
            <p className="small-caps text-[7px] text-gray-400 mt-0.5 truncate">
              {workspace === 'admin' ? 'Admin Panel' : 'Practitioner'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {items.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all',
                isActive
                  ? 'bg-[#f0f4ee] text-forest'
                  : 'text-gray-500 hover:bg-brand-50 hover:text-slate',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={18}
                  className={cn('shrink-0', isActive ? 'text-forest' : 'text-gray-400')}
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-brand-border">
        <p className="small-caps text-[7px] text-gray-300">IRAI Web · v0.1.0</p>
      </div>
    </aside>
  );
}
