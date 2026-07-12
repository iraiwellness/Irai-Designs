import { motion } from 'motion/react';
import {
  ChevronRight, AlertTriangle, Clock, BookOpen, IndianRupee,
  CheckCircle2, XCircle, UserPlus, Users, TrendingUp, UserCheck,
  ShieldAlert, CalendarOff,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ADMIN_STATS, ADMIN_THERAPISTS, ADMIN_ACTIVITY, ADMIN_DISPUTES,
  therapistFullName, type ActivityType,
} from '../../adminData';
import { MOCK_PRACTITIONER_BREAKS } from '../../mockData';
import { cn } from '../../lib/utils';

const ACTIVITY_CONFIG: Record<ActivityType, { bg: string; icon: LucideIcon }> = {
  booking:  { bg: 'bg-[#f0f4ee]', icon: BookOpen     },
  join:     { bg: 'bg-[#eef3f9]', icon: UserPlus     },
  cancel:   { bg: 'bg-[#fdf3ec]', icon: XCircle      },
  signup:   { bg: 'bg-[#f0f4ee]', icon: Users        },
  complete: { bg: 'bg-[#f0f4ee]', icon: CheckCircle2 },
  login:    { bg: 'bg-[#f3f0f9]', icon: UserCheck    },
  dispute:  { bg: 'bg-[#fdf3ec]', icon: ShieldAlert  },
  payout:   { bg: 'bg-[#eef3f9]', icon: IndianRupee  },
};

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatCurrency(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  const openDisputes = ADMIN_DISPUTES.filter(d => d.status === 'open').length;
  const pendingApprovals = ADMIN_THERAPISTS.filter(t => t.status === 'pending').length;
  const pendingLeave = MOCK_PRACTITIONER_BREAKS.filter(b => b.kind === 'day_off' && b.status === 'pending').length;
  const verifiedTherapists = ADMIN_THERAPISTS.filter(t => t.status === 'verified').slice(0, 5);

  const primaryStats = [
    { label: 'Total Users', value: ADMIN_STATS.totalUsers, accent: 'text-forest', path: '/admin/users' },
    { label: 'Total Practitioners', value: ADMIN_STATS.totalPractitioners, accent: 'text-terracotta', path: '/admin/therapists' },
    { label: 'Total Bookings', value: ADMIN_STATS.totalBookings, accent: 'text-[#4B7399]', path: '/admin/bookings' },
    { label: "Today's Bookings", value: ADMIN_STATS.bookingsToday, accent: 'text-[#4B7399]', path: '/admin/bookings' },
  ];

  const secondaryStats = [
    { label: 'Revenue Today', value: formatCurrency(ADMIN_STATS.revenueToday), accent: 'text-forest', icon: IndianRupee },
    { label: 'Weekly Revenue', value: formatCurrency(ADMIN_STATS.weeklyRevenue), accent: 'text-forest', icon: TrendingUp },
    { label: 'Monthly Revenue', value: formatCurrency(ADMIN_STATS.monthlyRevenue), accent: 'text-forest', icon: TrendingUp },
    { label: 'Completion Rate', value: `${ADMIN_STATS.completionRate}%`, accent: 'text-[#4B7399]', icon: CheckCircle2 },
    { label: 'Active Subscriptions', value: ADMIN_STATS.activeSubscriptions, accent: 'text-[#4B7399]', icon: Users },
    { label: 'Pending Verification', value: ADMIN_STATS.pendingTherapists, accent: 'text-amber-600', icon: Clock, path: '/admin/therapists?tab=pending' },
    { label: 'Open Disputes', value: openDisputes, accent: 'text-terracotta', icon: ShieldAlert, path: '/admin/disputes' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <p className="small-caps text-gray-400 mb-1">{today}</p>
        <h1 className="serif text-4xl text-slate leading-tight">Admin Panel</h1>
        <p className="text-[14px] text-gray-400 mt-1">Platform overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {primaryStats.map((stat, i) => (
          <motion.button
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(stat.path)}
            className="bg-white rounded-2xl border border-brand-border shadow-sm px-5 py-4 text-left hover:border-forest/20 hover:shadow-md transition-all"
          >
            <p className="small-caps text-[8px] text-gray-400 mb-2">{stat.label}</p>
            <p className={cn('text-2xl font-bold leading-none', stat.accent)}>{stat.value}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-4">
        {secondaryStats.map((stat, i) => {
          const Icon = stat.icon;
          const inner = (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-gray-400" />
                <p className="small-caps text-[7px] text-gray-400">{stat.label}</p>
              </div>
              <p className={cn('text-lg font-bold leading-none', stat.accent)}>{stat.value}</p>
            </>
          );
          return stat.path ? (
            <motion.button
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.03 }}
              onClick={() => navigate(stat.path!)}
              className="bg-white rounded-2xl border border-brand-border shadow-sm px-4 py-3 text-left hover:border-forest/20 transition-all"
            >
              {inner}
            </motion.button>
          ) : (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.03 }}
              className="bg-white rounded-2xl border border-brand-border shadow-sm px-4 py-3"
            >
              {inner}
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 space-y-6">
          {(openDisputes > 0 || pendingApprovals > 0 || pendingLeave > 0) && (
            <div className="space-y-3">
              {openDisputes > 0 && (
                <button onClick={() => navigate('/admin/disputes')}
                  className="w-full text-left bg-white border border-brand-border rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-all">
                  <div className="w-9 h-9 bg-[#fdf3ec] rounded-xl flex items-center justify-center text-terracotta shrink-0">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="small-caps text-[8px] text-terracotta mb-0.5">Action Required</p>
                    <p className="text-[13px] text-slate font-medium">{openDisputes} open dispute{openDisputes > 1 ? 's' : ''} need attention</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              )}
              {pendingApprovals > 0 && (
                <button onClick={() => navigate('/admin/therapists?tab=pending')}
                  className="w-full text-left bg-white border border-brand-border rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-all">
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="small-caps text-[8px] text-amber-500 mb-0.5">Pending Verification</p>
                    <p className="text-[13px] text-slate font-medium">{pendingApprovals} practitioner{pendingApprovals > 1 ? 's' : ''} awaiting review</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              )}
              {pendingLeave > 0 && (
                <button onClick={() => navigate('/admin/leave')}
                  className="w-full text-left bg-white border border-brand-border rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-all">
                  <div className="w-9 h-9 bg-[#fdf3ec] rounded-xl flex items-center justify-center text-terracotta shrink-0">
                    <CalendarOff size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="small-caps text-[8px] text-terracotta mb-0.5">Leave Requests</p>
                    <p className="text-[13px] text-slate font-medium">{pendingLeave} day-off request{pendingLeave > 1 ? 's' : ''} awaiting approval</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              )}
            </div>
          )}

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="small-caps text-gray-400">Practitioner Load</p>
              <button onClick={() => navigate('/admin/therapists')} className="text-[12px] font-semibold text-forest hover:underline">View all →</button>
            </div>
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-50/50">
                    <th className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Practitioner</th>
                    <th className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Specialty</th>
                    <th className="text-right px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Load</th>
                  </tr>
                </thead>
                <tbody>
                  {verifiedTherapists.map(t => (
                    <tr key={t.id} className="border-b border-brand-border last:border-0 hover:bg-brand-50/30 cursor-pointer" onClick={() => navigate(`/admin/therapists/${t.id}`)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#f5f7f2] border border-brand-border flex items-center justify-center text-forest font-bold text-[11px] shrink-0">
                            {t.firstName[0]}{t.lastName[0]}
                          </div>
                          <span className="text-[13px] font-semibold text-slate">{therapistFullName(t)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-gray-400">{t.specialty}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <span className={cn('text-[12px] font-bold', t.loadPercent >= 85 ? 'text-terracotta' : t.loadPercent >= 60 ? 'text-amber-500' : 'text-forest')}>{t.loadPercent}%</span>
                          <div className="w-20 h-1.5 bg-[#f5f7f2] rounded-full overflow-hidden border border-brand-border">
                            <div className={cn('h-full rounded-full', t.loadPercent >= 85 ? 'bg-terracotta' : t.loadPercent >= 60 ? 'bg-amber-400' : 'bg-forest')} style={{ width: `${t.loadPercent}%` }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="small-caps text-gray-400">Recent Activity</p>
              <button onClick={() => navigate('/admin/activity')} className="text-[12px] font-semibold text-forest hover:underline">View all →</button>
            </div>
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-4">
              {ADMIN_ACTIVITY.slice(0, 6).map(item => {
                const cfg = ACTIVITY_CONFIG[item.type];
                const Icon = cfg.icon;
                return (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', cfg.bg)}>
                      <Icon size={14} className="text-gray-500" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-[12px] font-medium text-slate/80 leading-snug">{item.description}</p>
                      <p className="small-caps text-[7px] text-gray-400 mt-0.5">{formatRelativeTime(item.createdAt)} · {item.type}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
