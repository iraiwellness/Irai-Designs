import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_PRACTITIONER } from '../../mockData';
import { cn } from '../../lib/utils';
import TopNav from './TopNav';
import BrandLogo from '../BrandLogo';
import type { NavItem } from './navConfig';

interface TopBarProps {
  workspace: 'practitioner' | 'admin';
  navItems?: NavItem[];
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export default function TopBar({ workspace, navItems }: TopBarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name ?? MOCK_PRACTITIONER.name;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const utilities = (
    <>
      <button
        type="button"
        className="relative w-9 h-9 rounded-xl border border-brand-border flex items-center justify-center text-gray-400 hover:bg-brand-50 hover:text-slate transition-colors"
        aria-label="Notifications"
      >
        <Bell size={16} />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-terracotta border-2 border-white rounded-full" />
      </button>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen(v => !v)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-brand-50 transition-colors"
        >
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0',
              workspace === 'admin' ? 'bg-forest' : 'bg-[#c4713a]',
            )}
          >
            {initials(displayName)}
          </div>
          <span className="text-[13px] font-medium text-slate max-w-[120px] truncate hidden sm:inline">
            {displayName}
          </span>
          <ChevronDown
            size={14}
            className={cn('text-gray-400 transition-transform', menuOpen && 'rotate-180')}
          />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-brand-border rounded-xl shadow-lg py-1 z-50">
            <div className="px-4 py-3 border-b border-brand-border">
              <p className="text-[13px] font-semibold text-slate truncate">{displayName}</p>
              <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigate(workspace === 'admin' ? '/admin/profile' : '/practitioner/profile');
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate hover:bg-brand-50 transition-colors"
            >
              <User size={15} className="text-gray-400" />
              Profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-terracotta hover:bg-[#fdf3ec] transition-colors"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );

  if (navItems) {
    const workspaceLabel = workspace === 'admin' ? 'Admin Panel' : 'Practitioner';

    return (
      <header className="h-16 shrink-0 bg-white border-b border-brand-border px-4 lg:px-6 flex items-center gap-3 lg:gap-5 sticky top-0 z-40">
        <div className="flex items-center gap-3 shrink-0">
          <BrandLogo size="sm" centered={false} variant="on-light" />
          <div className="hidden md:block min-w-0">
            <p className="font-serif text-lg text-slate leading-none">IRAI</p>
            <p className="small-caps text-[7px] text-gray-400 mt-0.5">{workspaceLabel}</p>
          </div>
        </div>

        <div className="flex-1 min-w-0 overflow-x-auto">
          <TopNav items={navItems} />
        </div>

        <div className="flex items-center gap-2 shrink-0">{utilities}</div>
      </header>
    );
  }

  return (
    <header className="h-16 shrink-0 bg-white border-b border-brand-border px-6 flex items-center justify-end sticky top-0 z-40">
      <div className="flex items-center gap-2">{utilities}</div>
    </header>
  );
}
