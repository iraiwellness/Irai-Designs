import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import AdminBottomNav from './AdminBottomNav';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white md:bg-[#F5F7F2]/30 md:flex md:items-center md:justify-center md:p-4">
      <div className="w-full min-h-screen md:min-h-0 md:max-w-[375px] md:h-[812px] md:rounded-[40px] md:shadow-[0_0_100px_rgba(0,0,0,0.05)] bg-white relative overflow-hidden flex flex-col">

        {/* Scrollable content area */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 overflow-y-auto overflow-x-hidden relative"
        >
          <Outlet />
          {/* Spacer so content clears bottom nav */}
          <div className="h-20" />
        </motion.div>

        {/* Portal target for modals / bottom sheets */}
        <div
          id="admin-modal-root"
          className="absolute inset-0 pointer-events-none z-[60] md:rounded-[40px] overflow-hidden"
        />

        {/* Bottom navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-brand-border px-6 py-3 z-50 flex justify-between items-center shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
          <AdminBottomNav />
        </nav>
      </div>
    </div>
  );
}
