import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import SidebarNav from './SidebarNav';
import TopBar from './TopBar';
import type { NavItem } from './navConfig';

interface WebShellProps {
  navItems: NavItem[];
  workspace: 'practitioner' | 'admin';
}

export default function WebShell({ navItems, workspace }: WebShellProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-brand-50">
      <SidebarNav items={navItems} workspace={workspace} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar workspace={workspace} />

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-y-auto"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
