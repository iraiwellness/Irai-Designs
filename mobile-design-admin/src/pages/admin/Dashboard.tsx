import { motion } from 'motion/react';
import {
  Bell, CalendarCheck, CalendarRange, UserCheck, Users,
  ChevronRight, AlertTriangle, Clock, BookOpen,
  CheckCircle2, XCircle, UserPlus, Activity, LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ADMIN_STATS, ADMIN_THERAPISTS, ADMIN_ACTIVITY, ADMIN_DISPUTES,
  ActivityType,
} from '../../adminData';
import { cn } from '../../lib/utils';

// ── Activity config ────────────────────────────────────────────────────────────

const ACTIVITY_CONFIG: Record<ActivityType, { bg: string; icon: React.FC<{ size?: number; className?: string }> }> = {
  booking:  { bg: 'bg-[#f0f4ee]', icon: (p) => <BookOpen    {...p} className="text-forest"      /> },
  join:     { bg: 'bg-[#eef3f9]', icon: (p) => <UserPlus    {...p} className="text-[#4B7399]"   /> },
  cancel:   { bg: 'bg-[#fdf3ec]', icon: (p) => <XCircle     {...p} className="text-terracotta"  /> },
  signup:   { bg: 'bg-[#f0f4ee]', icon: (p) => <Users       {...p} className="text-forest"      /> },
  complete: { bg: 'bg-[#f0f4ee]', icon: (p) => <CheckCircle2 {...p} className="text-forest"     /> },
};

// ── Quick action tiles (mirror user-side booking grid) ────────────────────────

const ADMIN_ACTIONS = [
  { icon: CalendarCheck, label: 'Bookings',      sub: 'Monitor all sessions',  path: '/admin/bookings',    bg: 'bg-[#f0f4ee]', text: 'text-forest'    },
  { icon: CalendarRange, label: 'Group Sessions', sub: 'Manage timetable',     path: '/admin/sessions',    bg: 'bg-[#eef3f9]', text: 'text-[#4B7399]' },
  { icon: UserCheck,     label: 'Therapists',    sub: 'Team & approvals',      path: '/admin/therapists',  bg: 'bg-[#fdf3ec]', text: 'text-terracotta'},
  { icon: Users,         label: 'Users',         sub: 'Member overview',       path: '/admin/users',       bg: 'bg-[#f3f0f9]', text: 'text-[#7B5EA7]' },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/', { replace: true }); };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  const openDisputes     = ADMIN_DISPUTES.filter(d => d.status === 'open').length;
  const pendingApprovals = ADMIN_THERAPISTS.filter(t => t.status === 'pending').length;
  const activeTherapists = ADMIN_THERAPISTS.filter(t => t.status === 'active').slice(0, 4);

  return (
    <div className="min-h-full bg-brand-50">

      {/* ── Dark hero header (mirrors user Dashboard) ── */}
      <div className="bg-gradient-to-br from-[#263d23] to-[#192b16] px-6 pt-12 pb-7 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/[0.03] rounded-full" />
        <div className="absolute bottom-0 left-8 w-24 h-24 bg-white/[0.03] rounded-full blur-2xl" />

        <div className="relative z-10">
          {/* Greeting row */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="small-caps text-[7px] text-white/40 mb-1.5 tracking-widest">{today}</p>
              <h1 className="serif text-[30px] text-white leading-none">Admin Panel</h1>
              <p className="small-caps text-[7px] text-white/40 mt-2">Platform Overview</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
                <Bell size={16} className="text-white/70" />
              </div>
              {(openDisputes + pendingApprovals) > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta border-2 border-[#192b16] rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                  {openDisputes + pendingApprovals}
                </span>
              )}
            </div>
          </div>

          {/* Platform stat chips */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-3 text-left active:scale-[0.97] transition-all"
            >
              <p className="small-caps text-[6px] text-white/35 mb-1">Total Users</p>
              <p className="text-[20px] font-bold text-white leading-none">
                {ADMIN_STATS.totalUsers}
              </p>
            </button>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-3 text-left active:scale-[0.97] transition-all"
            >
              <p className="small-caps text-[6px] text-white/35 mb-1">Today's Bookings</p>
              <p className="text-[20px] font-bold text-white leading-none">
                {ADMIN_STATS.bookingsToday}
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5 space-y-6 pb-24">

        {/* ── Alert banners ── */}
        {openDisputes > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate('/admin/disputes')}
            className="w-full text-left bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3 p-4">
              <div className="w-8 h-8 bg-[#fdf3ec] rounded-xl flex items-center justify-center text-terracotta shrink-0">
                <AlertTriangle size={14} />
              </div>
              <div className="flex-1">
                <p className="small-caps text-[7px] text-terracotta mb-0.5 tracking-widest">Action Required</p>
                <p className="text-[12px] text-slate/80 font-medium leading-snug">
                  {openDisputes} open dispute{openDisputes > 1 ? 's' : ''} need your attention
                </p>
              </div>
              <ChevronRight size={14} className="text-gray-200 shrink-0" />
            </div>
            <div className="h-[2px] bg-brand-50">
              <motion.div
                className="h-full bg-terracotta"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </motion.button>
        )}

        {pendingApprovals > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onClick={() => navigate('/admin/therapists')}
            className="w-full text-left bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3 p-4">
              <div className="w-8 h-8 bg-[#fef9ec] rounded-xl flex items-center justify-center shrink-0">
                <Clock size={14} className="text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="small-caps text-[7px] text-amber-500 mb-0.5 tracking-widest">Pending Approval</p>
                <p className="text-[12px] text-slate/80 font-medium leading-snug">
                  {pendingApprovals} therapist{pendingApprovals > 1 ? 's' : ''} awaiting review
                </p>
              </div>
              <ChevronRight size={14} className="text-gray-200 shrink-0" />
            </div>
          </motion.button>
        )}

        {/* ── Quick Actions grid (mirrors user booking grid) ── */}
        <section className="space-y-3">
          <p className="small-caps text-gray-400 px-1">Quick Access</p>
          <div className="grid grid-cols-2 gap-3">
            {ADMIN_ACTIONS.map(({ icon: Icon, label, sub, path, bg, text }, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                onClick={() => navigate(path)}
                className="flex flex-col p-4 bg-white rounded-2xl border border-brand-border shadow-sm gap-3 active:scale-[0.98] transition-all text-left"
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', bg)}>
                  <Icon size={18} className={text} />
                </div>
                <div>
                  <p className="font-bold text-slate text-[12px] uppercase tracking-tight">{label}</p>
                  <p className="small-caps text-[7px] text-gray-400 mt-0.5">{sub}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ── Therapist Load ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="small-caps text-gray-400">Therapist Load</p>
            <button
              onClick={() => navigate('/admin/therapists')}
              className="small-caps text-[8px] text-forest"
            >
              View All
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
            {activeTherapists.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                className={cn('p-4 flex items-center gap-3', i < activeTherapists.length - 1 && 'border-b border-brand-border')}
              >
                <div className="w-9 h-9 rounded-xl bg-[#f5f7f2] border border-brand-border flex items-center justify-center text-forest font-bold text-sm shrink-0">
                  {t.name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate truncate">{t.name}</p>
                  <p className="small-caps text-[7px] text-gray-400 truncate">{t.specialty}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 w-20 shrink-0">
                  <p className={cn(
                    'text-[10px] font-bold',
                    t.loadPercent >= 85 ? 'text-terracotta' :
                    t.loadPercent >= 60 ? 'text-amber-500' :
                    'text-forest',
                  )}>
                    {t.loadPercent}%
                  </p>
                  <div className="w-full h-1.5 bg-[#f5f7f2] rounded-full overflow-hidden border border-brand-border">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        t.loadPercent >= 85 ? 'bg-terracotta' :
                        t.loadPercent >= 60 ? 'bg-amber-400' :
                        'bg-forest',
                      )}
                      style={{ width: `${t.loadPercent}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Recent Activity ── */}
        <section className="space-y-3">
          <p className="small-caps text-gray-400 px-1">Recent Activity</p>
          <div className="space-y-3">
            {ADMIN_ACTIVITY.map((item, i) => {
              const cfg = ACTIVITY_CONFIG[item.type];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', cfg.bg)}>
                    <cfg.icon size={13} />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-[11px] font-medium text-slate/80 leading-snug">{item.message}</p>
                    <p className="small-caps text-[7px] text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-brand-border text-gray-400 text-[11px] font-bold active:scale-[0.98] transition-all"
        >
          <LogOut size={13} />
          Sign Out
        </button>

        <p className="text-center small-caps text-[7px] text-gray-300">
          IRAI Admin · Platform Version 1.0.4
        </p>
      </div>
    </div>
  );
}
