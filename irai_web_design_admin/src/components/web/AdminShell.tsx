import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import TopBar from './TopBar';
import { ADMIN_NAV } from './navConfig';

export default function AdminShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <TopBar workspace="admin" navItems={ADMIN_NAV} />

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
  );
}
