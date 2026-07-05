import { motion } from 'motion/react';
import { LogOut, Shield, CreditCard, HelpCircle, Bell, ChevronRight, Edit3, Star, Users, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRACTITIONER } from '../mockData';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const SETTINGS = [
  { icon: Bell,       label: 'Notifications',     color: 'bg-[#f0f4ee] text-forest'    },
  { icon: Shield,     label: 'Security & Privacy', color: 'bg-[#eef3f9] text-[#4B7399]' },
  { icon: CreditCard, label: 'Payout Settings',    color: 'bg-[#f0f4ee] text-forest'    },
  { icon: HelpCircle, label: 'Help Center',        color: 'bg-[#fdf3ec] text-terracotta' },
];

export default function Profile() {
  const navigate    = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => { logout(); navigate('/', { replace: true }); };

  const displayName = user?.name ?? MOCK_PRACTITIONER.name;

  return (
    <div className="min-h-full bg-brand-50 pb-24">

      {/* ── Header hero ── */}
      <div className="bg-gradient-to-br from-[#263d23] to-[#192b16] px-6 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.03] rounded-full" />

        <div className="flex flex-col items-center text-center relative z-10">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-[28px] border-4 border-white/20 shadow-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71f1536783?w=300&h=300&fit=crop"
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl border-2 border-white/20 flex items-center justify-center shadow-md">
              <Edit3 size={13} className="text-forest" />
            </button>
          </div>

          <h1 className="serif text-[24px] text-white leading-none mb-1">{displayName}</h1>
          <p className="small-caps text-[8px] text-white/40">{MOCK_PRACTITIONER.specialty}</p>
        </div>
      </div>

      <div className="p-5 space-y-5 -mt-1">

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-brand-border shadow-sm"
        >
          <div className="grid grid-cols-3 divide-x divide-brand-border">
            {[
              { icon: CheckCircle2, value: '1.2k',  label: 'Sessions', color: 'text-forest'    },
              { icon: Star,         value: '4.9',   label: 'Rating',   color: 'text-amber-500' },
              { icon: Users,        value: '124',   label: 'Clients',  color: 'text-[#4B7399]' },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="flex flex-col items-center py-4 gap-1.5">
                <Icon size={14} className={cn(color)} />
                <p className={cn('text-[16px] font-bold leading-none', color)}>{value}</p>
                <p className="small-caps text-[7px] text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 space-y-2"
        >
          <p className="small-caps text-gray-400">About</p>
          <p className="text-[11px] text-gray-500 leading-relaxed">{MOCK_PRACTITIONER.about}</p>
        </motion.div>

        {/* Settings */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <p className="small-caps text-gray-400 px-1">Settings</p>
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
            {SETTINGS.map((item, i) => (
              <button
                key={item.label}
                className={cn(
                  'w-full p-4 flex items-center justify-between active:bg-brand-50 transition-colors',
                  i < SETTINGS.length - 1 && 'border-b border-brand-border',
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', item.color)}>
                    <item.icon size={15} />
                  </div>
                  <span className="text-[12px] font-semibold text-slate">{item.label}</span>
                </div>
                <ChevronRight size={15} className="text-gray-300" />
              </button>
            ))}
          </div>
        </motion.section>

        {/* Sign Out */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl border border-terracotta/20 bg-[#fdf3ec] text-terracotta font-bold text-[12px] active:scale-[0.98] transition-all"
        >
          <LogOut size={16} /> Sign Out
        </motion.button>

        <p className="text-center small-caps text-[7px] text-gray-300">
          IRAI Wellness · v1.0.4
        </p>
      </div>
    </div>
  );
}
