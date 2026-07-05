import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutDashboard, Activity, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  {
    id:       'admin' as const,
    title:    'Admin Panel',
    sub:      'Platform management & oversight',
    icon:     LayoutDashboard,
    accent:   '#4a6741',
    accentBg: 'bg-[#f0f4ee]',
    accentTx: 'text-forest',
    href:     '/login?role=admin',
  },
  {
    id:       'practitioner' as const,
    title:    'Practitioner App',
    sub:      'Client care & scheduling',
    icon:     Activity,
    accent:   '#e8a87c',
    accentBg: 'bg-[#fdf3ec]',
    accentTx: 'text-terracotta',
    href:     '/login?role=practitioner',
  },
];

export default function RolePicker() {
  const navigate            = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin' : '/practitioner', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-white md:bg-[#F5F7F2]/30 md:flex md:items-center md:justify-center md:p-4">
      <div className="w-full min-h-screen md:min-h-0 md:max-w-[375px] md:h-[812px] md:rounded-[40px] md:shadow-[0_0_100px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col bg-gradient-to-br from-[#1b2e18] to-[#0e1b0c]">

        {/* Decorative blurs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 w-64 h-64 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />

        {/* ── Brand hero ── */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center mb-12"
          >
            {/* Wordmark */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-[22px] bg-white/[0.08] border border-white/10 mb-5">
              <span className="font-serif text-2xl text-white/90 font-semibold">ir</span>
            </div>
            <h1 className="font-serif text-[44px] text-white leading-none tracking-tight">IRAI</h1>
            <p className="text-[8px] uppercase tracking-[0.35em] text-white/30 mt-2 font-semibold">
              Wellness Platform
            </p>
          </motion.div>

          {/* Divider */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[8px] uppercase tracking-[0.25em] text-white/25 font-semibold mb-6"
          >
            Choose your workspace
          </motion.p>

          {/* Role cards */}
          <div className="w-full space-y-3">
            {ROLES.map(({ id, title, sub, icon: Icon, accent, accentBg, accentTx, href }, i) => (
              <motion.button
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.1 }}
                onClick={() => navigate(href)}
                className="w-full text-left bg-white/[0.06] border border-white/[0.09] rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-all hover:bg-white/[0.09]"
              >
                {/* Left accent bar */}
                <div className="w-0.5 h-10 rounded-full shrink-0" style={{ backgroundColor: accent }} />

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accentBg}`}>
                  <Icon size={18} className={accentTx} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-white leading-none mb-1">{title}</p>
                  <p className="text-[9px] text-white/35 font-medium leading-tight">{sub}</p>
                </div>

                <ChevronRight size={16} className="text-white/20 shrink-0" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-[7px] uppercase tracking-[0.25em] text-white/15 font-semibold pb-8 relative z-10"
        >
          Prototype · v1.0.4
        </motion.p>
      </div>
    </div>
  );
}
