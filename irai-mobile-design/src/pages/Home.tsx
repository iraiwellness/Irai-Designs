import { motion } from 'motion/react';
import { Star, Users, Calendar, Clock, Play, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRACTITIONER, MOCK_APPOINTMENTS, MOCK_GROUP_SESSIONS } from '../mockData';
import { useAuth } from '../context/AuthContext';
import { useIsWebLayout } from '../hooks/useMediaQuery';
import { cn } from '../lib/utils';

const TYPE_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  'follow-up':    { color: '#4a6741', bg: 'bg-[#f0f4ee]',  label: 'Follow-up'    },
  'initial':      { color: '#4B7399', bg: 'bg-[#eef3f9]',  label: 'Initial'      },
  'consultation': { color: '#e8a87c', bg: 'bg-[#fdf3ec]',  label: 'Consultation' },
};

function HomeWeb() {
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const nextAppt   = MOCK_APPOINTMENTS.find(a => a.status === 'confirmed');
  const todayAppts = MOCK_APPOINTMENTS.filter(a => a.status === 'confirmed');
  const nextGroup  = MOCK_GROUP_SESSIONS[0];
  const displayName = user?.name ?? MOCK_PRACTITIONER.name;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="small-caps text-gray-400 mb-1">{today}</p>
          <h1 className="serif text-4xl text-slate leading-tight">
            Welcome back, {displayName.split(' ').slice(-1)[0]}
          </h1>
          <p className="text-[14px] text-gray-400 mt-1">{MOCK_PRACTITIONER.specialty}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Avg Rating',     value: MOCK_PRACTITIONER.rating, suffix: '★', accent: 'text-amber-500' },
          { label: 'Total Clients',  value: MOCK_PRACTITIONER.totalClients, suffix: '', accent: 'text-forest' },
          { label: "Today's Sessions", value: todayAppts.length, suffix: '', accent: 'text-[#4B7399]' },
          { label: 'Group Sessions', value: MOCK_GROUP_SESSIONS.length, suffix: '', accent: 'text-terracotta' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-brand-border shadow-sm px-5 py-4"
          >
            <p className="small-caps text-[8px] text-gray-400 mb-2">{stat.label}</p>
            <p className={cn('text-2xl font-bold leading-none', stat.accent)}>
              {stat.value}
              {stat.suffix && <span className="text-lg ml-0.5">{stat.suffix}</span>}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left column */}
        <div className="xl:col-span-3 space-y-6">
          {nextAppt && (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="small-caps text-gray-400 mb-3">Next 1-on-1 Session</p>
              <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
                <div className="h-1 w-full bg-forest" />
                <div className="p-5 flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#f0f4ee] rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-forest leading-none">
                      {nextAppt.time.split(':')[0]}
                    </span>
                    <span className="text-[9px] text-forest/60 font-semibold uppercase">
                      {nextAppt.time.split(' ')[1]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-slate">{nextAppt.patientName}</p>
                    <p className="small-caps text-[8px] text-gray-400 mt-1 capitalize">{nextAppt.type}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/practitioner/session/${nextAppt.id}`)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-forest rounded-xl text-white text-[13px] font-bold shrink-0 hover:bg-[#3d5636] transition-colors"
                  >
                    <Play size={14} fill="white" /> Start Session
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="small-caps text-gray-400">Today&apos;s Schedule</p>
              <button
                onClick={() => navigate('/practitioner/schedule')}
                className="text-[12px] font-semibold text-forest hover:underline"
              >
                View full calendar →
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-50/50">
                    <th className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Time</th>
                    <th className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Client</th>
                    <th className="text-left px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold hidden sm:table-cell">Type</th>
                    <th className="text-right px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppts.map((appt, i) => {
                    const cfg = TYPE_CONFIG[appt.type] ?? TYPE_CONFIG['consultation'];
                    return (
                      <motion.tr
                        key={appt.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 + i * 0.05 }}
                        className="border-b border-brand-border last:border-0 hover:bg-brand-50/30 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                            <span className="text-[13px] font-semibold text-slate">{appt.time}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[13px] font-medium text-slate">{appt.patientName}</td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full', cfg.bg)} style={{ color: cfg.color }}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => navigate(`/practitioner/session/${appt.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f4ee] rounded-lg text-[12px] font-bold text-forest hover:bg-[#e4ebe0] transition-colors"
                          >
                            <Play size={12} fill="#4a6741" /> Start
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="xl:col-span-2 space-y-6">
          {nextGroup && (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <p className="small-caps text-gray-400 mb-3">Next Group Session</p>
              <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
                <div className="h-1 w-full bg-[#4B7399]" />
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#eef3f9] rounded-xl flex items-center justify-center shrink-0">
                      <Users size={20} className="text-[#4B7399]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-slate">{nextGroup.title}</p>
                      <p className="text-[12px] text-gray-400 mt-1">
                        {nextGroup.time} · {nextGroup.enrolled}/{nextGroup.capacity} enrolled
                      </p>
                      <p className="small-caps text-[8px] text-gray-400 mt-1 capitalize">{nextGroup.level} · {nextGroup.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/practitioner/session/${nextGroup.id}?type=group`)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#4B7399] rounded-xl text-white text-[13px] font-bold hover:bg-[#3d6280] transition-colors"
                  >
                    <Play size={14} fill="white" /> Go Live
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          <section className="space-y-3">
            <p className="small-caps text-gray-400">Quick Access</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Users,         label: 'Clients',  sub: 'View all clients',  path: '/practitioner/clients',  bg: 'bg-[#f0f4ee]', text: 'text-forest'    },
                { icon: Calendar,      label: 'Schedule', sub: 'Manage slots',      path: '/practitioner/schedule', bg: 'bg-[#eef3f9]', text: 'text-[#4B7399]' },
                { icon: MessageSquare, label: 'Messages', sub: 'Unread chats',      path: '/practitioner/chats',    bg: 'bg-[#fdf3ec]', text: 'text-terracotta' },
                { icon: Star,          label: 'Profile',  sub: 'Settings & payout', path: '/practitioner/profile',  bg: 'bg-[#f3f0f9]', text: 'text-[#7B5EA7]' },
              ].map(({ icon: Icon, label, sub, path, bg, text }, i) => (
                <motion.button
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
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
                </motion.button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function HomeMobile() {
  const navigate   = useNavigate();
  const nextAppt   = MOCK_APPOINTMENTS.find(a => a.status === 'confirmed');
  const todayAppts = MOCK_APPOINTMENTS.filter(a => a.status === 'confirmed');
  const nextGroup  = MOCK_GROUP_SESSIONS[0];

  return (
    <div className="min-h-full bg-brand-50 pb-24">
      <div className="bg-gradient-to-br from-[#263d23] to-[#192b16] px-6 pt-12 pb-7 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/[0.03] rounded-full" />
        <div className="absolute bottom-0 left-8 w-24 h-24 bg-white/[0.03] rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="small-caps text-[7px] text-white/40 mb-1.5 tracking-widest">Welcome back</p>
              <h1 className="serif text-[28px] text-white leading-none">{MOCK_PRACTITIONER.name}</h1>
              <p className="small-caps text-[7px] text-white/40 mt-2">{MOCK_PRACTITIONER.specialty}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-3 text-left">
              <p className="small-caps text-[6px] text-white/35 mb-1">Avg Rating</p>
              <div className="flex items-baseline gap-1">
                <p className="text-[20px] font-bold text-white leading-none">{MOCK_PRACTITIONER.rating}</p>
                <Star size={10} className="text-amber-400 mb-0.5" fill="currentColor" />
              </div>
            </div>
            <div className="bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-3 text-left">
              <p className="small-caps text-[6px] text-white/35 mb-1">Total Clients</p>
              <p className="text-[20px] font-bold text-white leading-none">{MOCK_PRACTITIONER.totalClients}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {nextAppt && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="small-caps text-gray-400 px-1 mb-3">Next 1-on-1 Session</p>
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
              <div className="h-0.5 w-full bg-forest" />
              <div className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#f0f4ee] rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-[16px] font-bold text-forest leading-none">{nextAppt.time.split(':')[0]}</span>
                  <span className="text-[8px] text-forest/60 font-semibold uppercase">{nextAppt.time.split(' ')[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-slate truncate">{nextAppt.patientName}</p>
                  <p className="small-caps text-[7px] text-gray-400 mt-0.5 capitalize">{nextAppt.type}</p>
                </div>
                <button
                  onClick={() => navigate(`/practitioner/session/${nextAppt.id}`)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-forest rounded-xl text-white text-[10px] font-bold shrink-0 active:scale-95 transition-all"
                >
                  <Play size={11} fill="white" /> Start
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {nextGroup && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <p className="small-caps text-gray-400 px-1 mb-3">Next Group Session</p>
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
              <div className="h-0.5 w-full bg-[#4B7399]" />
              <div className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#eef3f9] rounded-xl flex flex-col items-center justify-center shrink-0">
                  <Users size={16} className="text-[#4B7399]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-slate truncate">{nextGroup.title}</p>
                  <p className="small-caps text-[7px] text-gray-400 mt-0.5">
                    {nextGroup.time} · {nextGroup.enrolled}/{nextGroup.capacity} enrolled
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/practitioner/session/${nextGroup.id}?type=group`)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#4B7399] rounded-xl text-white text-[10px] font-bold shrink-0 active:scale-95 transition-all"
                >
                  <Play size={11} fill="white" /> Go Live
                </button>
              </div>
            </div>
          </motion.section>
        )}

        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="small-caps text-gray-400">Today&apos;s Schedule</p>
            <button onClick={() => navigate('/practitioner/schedule')} className="small-caps text-[8px] text-forest">
              View All
            </button>
          </div>
          <div className="space-y-2.5">
            {todayAppts.map((appt, i) => {
              const cfg = TYPE_CONFIG[appt.type] ?? TYPE_CONFIG['consultation'];
              return (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 flex items-center gap-3"
                >
                  <div className="w-1.5 h-10 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                  <div className="flex items-center gap-1.5 w-16 shrink-0">
                    <Clock size={10} className="text-gray-300" />
                    <span className="text-[9px] font-bold text-gray-400">{appt.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-slate truncate">{appt.patientName}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/practitioner/session/${appt.id}`)}
                    className="w-7 h-7 bg-[#f0f4ee] rounded-lg flex items-center justify-center active:scale-95 transition-all shrink-0"
                  >
                    <Play size={10} className="text-forest" fill="#4a6741" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <p className="small-caps text-gray-400 px-1">Quick Access</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Users,    label: 'Clients',  sub: 'View all clients',  path: '/practitioner/clients',  bg: 'bg-[#f0f4ee]', text: 'text-forest'    },
              { icon: Calendar, label: 'Schedule', sub: 'Manage time slots', path: '/practitioner/schedule', bg: 'bg-[#eef3f9]', text: 'text-[#4B7399]' },
            ].map(({ icon: Icon, label, sub, path, bg, text }) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
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
      </div>
    </div>
  );
}

export default function Home() {
  const isWeb = useIsWebLayout();
  return isWeb ? <HomeWeb /> : <HomeMobile />;
}
