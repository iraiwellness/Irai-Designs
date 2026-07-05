import { motion } from 'motion/react';
import { Bell, ArrowRight, Star, Users, Calendar, Clock, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRACTITIONER, MOCK_APPOINTMENTS, MOCK_GROUP_SESSIONS } from '../mockData';
import { cn } from '../lib/utils';

const TYPE_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  'follow-up':    { color: '#4a6741', bg: 'bg-[#f0f4ee]',  label: 'Follow-up'    },
  'initial':      { color: '#4B7399', bg: 'bg-[#eef3f9]',  label: 'Initial'      },
  'consultation': { color: '#e8a87c', bg: 'bg-[#fdf3ec]',  label: 'Consultation' },
};

export default function Home() {
  const navigate   = useNavigate();
  const nextAppt   = MOCK_APPOINTMENTS.find(a => a.status === 'confirmed');
  const todayAppts = MOCK_APPOINTMENTS.filter(a => a.status === 'confirmed');
  const nextGroup  = MOCK_GROUP_SESSIONS[0];

  return (
    <div className="min-h-full bg-brand-50 pb-24">

      {/* ── Dark hero header ── */}
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
            <button className="relative w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
              <Bell size={16} className="text-white/70" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta border-2 border-[#192b16] rounded-full" />
            </button>
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

      {/* ── Body ── */}
      <div className="p-5 space-y-6">

        {/* ── Next 1-on-1 Session ── */}
        {nextAppt && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="small-caps text-gray-400 px-1 mb-3">Next 1-on-1 Session</p>
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
              <div className="h-0.5 w-full bg-forest" />
              <div className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#f0f4ee] rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-[16px] font-bold text-forest leading-none">
                    {nextAppt.time.split(':')[0]}
                  </span>
                  <span className="text-[8px] text-forest/60 font-semibold uppercase">
                    {nextAppt.time.split(' ')[1]}
                  </span>
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

        {/* ── Next Group Session ── */}
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

        {/* ── Today's Schedule ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="small-caps text-gray-400">Today's Schedule</p>
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

        {/* ── Quick Access ── */}
        <section className="space-y-3">
          <p className="small-caps text-gray-400 px-1">Quick Access</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Users,    label: 'Clients',        sub: 'View all clients',     path: '/practitioner/clients',  bg: 'bg-[#f0f4ee]', text: 'text-forest'    },
              { icon: Calendar, label: 'Schedule',       sub: 'Manage time slots',    path: '/practitioner/schedule', bg: 'bg-[#eef3f9]', text: 'text-[#4B7399]' },
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
