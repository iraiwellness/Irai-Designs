/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Calendar, BarChart3, User, LogIn } from 'lucide-react';
import { cn } from './lib/utils';
import { User as UserType } from './constants';

// Pages (will create these next)
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Pricing from './pages/Pricing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Sessions from './pages/Sessions';
import AIInsights from './pages/AIInsights';
import Profile from './pages/Profile';
import GroupSessions from './pages/GroupSessions';
import HealthVault from './pages/HealthVault';
import SessionRoom from './pages/SessionRoom';

function MainLayout({ children, user }: { children: React.ReactNode, user: UserType | null }) {
  const location = useLocation();
  const noNavPaths = ['/', '/auth', '/pricing', '/onboarding', '/session-room'];
  const showNav = user && user.onboarded && !noNavPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white md:bg-[#F5F7F2]/30 md:flex md:items-center md:justify-center md:p-4">
      <div className="w-full min-h-screen md:min-h-0 md:max-w-[375px] md:h-[812px] md:rounded-[40px] md:shadow-[0_0_100px_rgba(0,0,0,0.05)] bg-white relative overflow-hidden flex flex-col">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto overflow-x-hidden relative"
        >
          {children}
          {showNav && <div className="h-16" />}
        </motion.main>

        {/* Portal target for bottom sheets and modals — sits above content, inside phone frame */}
        <div id="modal-root" className="absolute inset-0 pointer-events-none z-[60] rounded-[40px] overflow-hidden" />

        {showNav && (
          <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-brand-border px-6 py-3 pb-safe-area-bottom z-50 flex justify-between items-center shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
            <BottomNav />
          </nav>
        )}
      </div>
    </div>
  );
}

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
    { icon: Calendar, label: 'Book', path: '/booking' },
    { icon: BarChart3, label: 'Insights', path: '/insights' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-forest" : "text-gray-300"
            )}
          >
            <item.icon size={18} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </>
  );
}

export default function App() {
  const [user, setUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('irai_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('irai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('irai_user');
    }
  }, [user]);

  return (
    <Router>
      <MainLayout user={user}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth onLogin={setUser} />} />
          <Route 
            path="/pricing" 
            element={user ? <Pricing onSelectPlan={(planId) => setUser({ ...user, planId })} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/onboarding" 
            element={user ? <Onboarding onComplete={() => setUser({ ...user, onboarded: true })} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/dashboard" 
            element={user?.onboarded ? <Dashboard user={user} /> : <Navigate to={user ? (user.planId ? "/onboarding" : "/pricing") : "/auth"} />} 
          />
          <Route path="/booking" element={<Booking />} />
          <Route path="/group-sessions" element={<GroupSessions />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/insights" element={<AIInsights />} />
          <Route path="/profile" element={<Profile user={user} onLogout={() => setUser(null)} />} />
          <Route path="/health-vault" element={<HealthVault user={user} />} />
          <Route path="/session-room" element={<SessionRoom />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

