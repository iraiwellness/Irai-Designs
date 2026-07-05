import { LogOut, Shield, CreditCard, HelpCircle, Bell, ChevronRight, Edit3, Star, Users, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRACTITIONER } from '../../mockData';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const SETTINGS = [
  { icon: Bell,       label: 'Notifications',      desc: 'Email and push alerts',     color: 'bg-[#f0f4ee] text-forest'     },
  { icon: Shield,     label: 'Security & Privacy', desc: 'Password, 2FA, data',       color: 'bg-[#eef3f9] text-[#4B7399]' },
  { icon: CreditCard, label: 'Payout Settings',    desc: 'Bank account, tax info',    color: 'bg-[#f0f4ee] text-forest'     },
  { icon: HelpCircle, label: 'Help Center',        desc: 'Docs, support, FAQs',       color: 'bg-[#fdf3ec] text-terracotta' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const displayName = user?.name ?? MOCK_PRACTITIONER.name;

  const handleLogout = () => { logout(); navigate('/', { replace: true }); };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <p className="small-caps text-gray-400 mb-1">Practitioner</p>
        <h1 className="serif text-4xl text-slate leading-tight">Profile & Settings</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#263d23] to-[#192b16] rounded-2xl p-6 text-white text-center">
            <div className="relative inline-block mb-4">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71f1536783?w=300&h=300&fit=crop"
                alt={displayName}
                className="w-24 h-24 rounded-2xl border-4 border-white/20 object-cover mx-auto"
              />
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md">
                <Edit3 size={13} className="text-forest" />
              </button>
            </div>
            <h2 className="serif text-2xl leading-none mb-1">{displayName}</h2>
            <p className="small-caps text-[9px] text-white/40">{MOCK_PRACTITIONER.specialty}</p>
            <p className="text-[12px] text-white/30 mt-3">{user?.email}</p>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm">
            <div className="grid grid-cols-3 divide-x divide-brand-border">
              {[
                { icon: CheckCircle2, value: '1.2k', label: 'Sessions', color: 'text-forest'    },
                { icon: Star,         value: '4.9',  label: 'Rating',   color: 'text-amber-500' },
                { icon: Users,        value: '124',  label: 'Clients',  color: 'text-[#4B7399]' },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="flex flex-col items-center py-5 gap-1.5">
                  <Icon size={16} className={color} />
                  <p className={cn('text-xl font-bold', color)}>{value}</p>
                  <p className="small-caps text-[8px] text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-terracotta/20 bg-[#fdf3ec] text-terracotta font-bold text-[13px] hover:bg-[#fce8dc] transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* About + settings */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
            <p className="small-caps text-gray-400 mb-3">About</p>
            <p className="text-[14px] text-gray-500 leading-relaxed">{MOCK_PRACTITIONER.about}</p>
            <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-brand-border">
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1">Experience</p>
                <p className="text-[14px] font-semibold text-slate">{MOCK_PRACTITIONER.experience}</p>
              </div>
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1">Specialty</p>
                <p className="text-[14px] font-semibold text-slate">{MOCK_PRACTITIONER.specialty}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-border">
              <p className="small-caps text-gray-400">Settings</p>
            </div>
            {SETTINGS.map((item, i) => (
              <button
                key={item.label}
                className={cn(
                  'w-full px-6 py-4 flex items-center justify-between hover:bg-brand-50/50 transition-colors',
                  i < SETTINGS.length - 1 && 'border-b border-brand-border',
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', item.color)}>
                    <item.icon size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-semibold text-slate">{item.label}</p>
                    <p className="text-[12px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
