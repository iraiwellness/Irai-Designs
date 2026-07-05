import { motion } from 'motion/react';
import {
  CalendarCheck, CalendarRange, UserCheck, Users,
  ChevronRight, AlertTriangle, Clock, BookOpen,
  CheckCircle2, XCircle, UserPlus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ADMIN_STATS, ADMIN_THERAPISTS, ADMIN_ACTIVITY, ADMIN_DISPUTES,
  type ActivityType,
} from '../../adminData';
import { cn } from '../../lib/utils';

const ACTIVITY_CONFIG: Record<ActivityType, { bg: string; icon: LucideIcon }> = {
  booking:  { bg: 'bg-[#f0f4ee]', icon: BookOpen     },
  join:     { bg: 'bg-[#eef3f9]', icon: UserPlus     },
  cancel:   { bg: 'bg-[#fdf3ec]', icon: XCircle      },
  signup:   { bg: 'bg-[#f0f4ee]', icon: Users        },
  complete: { bg: 'bg-[#f0f4ee]', icon: CheckCircle2 },
};

const ADMIN_ACTIONS = [
  { icon: CalendarCheck, label: 'Bookings',       sub: 'Monitor all sessions', path: '/admin/bookings',   bg: 'bg-[#f0f4ee]', text: 'text-forest'     },
  { icon: CalendarRange, label: 'Group Sessions', sub: 'Manage timetable',   path: '/admin/sessions',   bg: 'bg-[#eef3f9]', text: 'text-[#4B7399]'  },
  { icon: UserCheck,     label: 'Therapists',     sub: 'Team & approvals',   path: '/admin/therapists', bg: 'bg-[#fdf3ec]', text: 'text-terracotta' },
  { icon: Users,         label: 'Users',          sub: 'Member overview',    path: '/admin/users',      bg: 'bg-[#f3f0f9]', text: 'text-[#7B5EA7]'  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  const openDisputes     = ADMIN_DISPUTES.filter(d => d.status === 'open').length;
  const pendingApprovals = ADMIN_THERAPISTS.filter(t => t.status === 'pending').length;
  const activeTherapists = ADMIN_THERAPISTS.filter(t => t.status === 'active').slice(0, 5);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <p className="small-caps text-gray-400 mb-1">{today}</p>
        <h1 className="serif text-4xl text-slate leading-tight">Admin Panel</h1>
        <p className="text-[14px] text-gray-400 mt-1">Platform overview</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users',      value: ADMIN_STATS.totalUsers,      accent: 'text-forest',      path: '/admin/users'     },
          { label: "Today's Bookings", value: ADMIN_STATS.bookingsToday,   accent: 'text-[#4B7399]',   path: '/admin/bookings'  },
          { label: 'Active Therapists', value: ADMIN_STATS.totalTherapists, accent: 'text-terracotta', path: '/admin/therapists' },
          { label: 'Open Disputes',    value: openDisputes,                accent: 'text-amber-600',   path: '/admin/disputes'  },
        ].map((stat, i) => (
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

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 space-y-6">
          {/* Alerts */}
          {(openDisputes > 0 || pendingApprovals > 0) && (
            <div className="space-y-3">
              {openDisputes > 0 && (
                <button
                  onClick={() => navigate('/admin/disputes')}
                  className="w-full text-left bg-white border border-brand-border rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-all"
                >
                  <div className="w-9 h-9 bg-[#fdf3ec] rounded-xl flex items-center justify-center text-terracotta shrink-0">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="small-caps text-[8px] text-terracotta mb-0.5">Action Required</p>
                    <p className="text-[13px] text-slate font-medium">
                      {openDisputes} open dispute{openDisputes > 1 ? 's' : ''} need attention
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              )}
              {pendingApprovals > 0 && (
                <button
                  onClick={() => navigate('/admin/therapists')}
                  className="w-full text-left bg-white border border-brand-border rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-all"
                >
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="small-caps text-[8px] text-amber-500 mb-0.5">Pending Approval</p>
                    <p className="text-[13px] text-slate font-medium">
                      {pendingApprovals} therapist{pendingApprovals > 1 ? 's' : ''} awaiting review
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              )}
            </div>
          )}

          {/* Therapist load */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="small-caps text-gray-400">Therapist Load</p>
              <button onClick={() => navigate('/admin/therapists')} className="text-[12px] font-semibold text-forest hover:underline">
                View all →
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-50/50">
                    <th className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Therapist</th>
                    <th className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Specialty</th>
                    <th className="text-right px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Load</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTherapists.map(t => (
                    <tr key={t.id} className="border-b border-brand-border last:border-0 hover:bg-brand-50/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#f5f7f2] border border-brand-border flex items-center justify-center text-forest font-bold text-[11px] shrink-0">
                            {t.name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('')}
                          </div>
                          <span className="text-[13px] font-semibold text-slate">{t.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-gray-400">{t.specialty}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <span className={cn(
                            'text-[12px] font-bold',
                            t.loadPercent >= 85 ? 'text-terracotta' :
                            t.loadPercent >= 60 ? 'text-amber-500' : 'text-forest',
                          )}>
                            {t.loadPercent}%
                          </span>
                          <div className="w-20 h-1.5 bg-[#f5f7f2] rounded-full overflow-hidden border border-brand-border">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                t.loadPercent >= 85 ? 'bg-terracotta' :
                                t.loadPercent >= 60 ? 'bg-amber-400' : 'bg-forest',
                              )}
                              style={{ width: `${t.loadPercent}%` }}
                            />
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
          {/* Quick actions */}
          <section className="space-y-3">
            <p className="small-caps text-gray-400">Quick Access</p>
            <div className="grid grid-cols-2 gap-3">
              {ADMIN_ACTIONS.map(({ icon: Icon, label, sub, path, bg, text }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="flex flex-col p-4 bg-white rounded-2xl border border-brand-border shadow-sm gap-3 hover:border-forest/20 hover:shadow-md transition-all text-left"
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', bg)}>
                    <Icon size={18} className={text} />
                  </div>
                  <div>
                    <p className="font-bold text-slate text-[13px]">{label}</p>
                    <p className="small-caps text-[7px] text-gray-400 mt-0.5">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Activity feed */}
          <section className="space-y-3">
            <p className="small-caps text-gray-400">Recent Activity</p>
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-4">
              {ADMIN_ACTIVITY.map(item => {
                const cfg = ACTIVITY_CONFIG[item.type];
                const Icon = cfg.icon;
                return (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', cfg.bg)}>
                      <Icon size={14} className="text-gray-500" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-[12px] font-medium text-slate/80 leading-snug">{item.message}</p>
                      <p className="small-caps text-[7px] text-gray-400 mt-0.5">{item.time}</p>
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
