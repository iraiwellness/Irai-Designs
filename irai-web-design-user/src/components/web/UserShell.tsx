import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import TopBar from './TopBar';

export default function UserShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <TopBar />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
