import { motion } from 'motion/react';
import {
  Users, Play, MessageSquare, UserPlus, Clock,
  AlertTriangle, ShieldAlert, CheckCircle2, ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  MOCK_PRACTITIONER, MOCK_APPOINTMENTS, MOCK_GROUP_SESSIONS,
  MOCK_CLIENT_REQUESTS, MOCK_ATTENTION_NOTIFICATIONS,
} from '../../mockData';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import type { Practitioner } from '../../types';

type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';
type HomePractitioner = Practitioner & {
  verificationStatus?: VerificationStatus;
  rejectionReason?: string;
};

const TYPE_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  'follow-up':    { color: '#4a6741', bg: 'bg-[#f0f4ee]',  label: 'Follow-up'    },
  'initial':      { color: '#4B7399', bg: 'bg-[#eef3f9]',  label: 'Initial'      },
  'consultation': { color: '#e8a87c', bg: 'bg-[#fdf3ec]',  label: 'Consultation' },
};

function VerificationBanner({ profile }: { profile: HomePractitioner }) {
  const navigate = useNavigate();
  const verificationStatus = profile.verificationStatus ?? 'verified';
  const { rejectionReason } = profile;

  if (verificationStatus === 'verified') return null;

  const configs = {
    pending: {
      icon: Clock,
      border: 'border-amber-200',
      bg: 'bg-[#fdf8ee]',
      iconColor: 'text-amber-600',
      title: 'Profile awaiting verification',
      body: 'Your profile is under admin review. You won\'t appear in public listings until approved.',
      action: 'Complete profile',
    },
    rejected: {
      icon: AlertTriangle,
      border: 'border-terracotta/30',
      bg: 'bg-[#fdf3ec]',
      iconColor: 'text-terracotta',
      title: 'Verification rejected',
      body: rejectionReason ?? 'Please update your profile and contact support.',
      action: 'View profile',
    },
    suspended: {
      icon: ShieldAlert,
      border: 'border-red-200',
      bg: 'bg-red-50',
      iconColor: 'text-red-600',
      title: 'Account suspended',
      body: rejectionReason ?? 'Your practitioner account has been suspended.',
      action: 'View details',
    },
  } as const;

  const config = configs[verificationStatus as keyof typeof configs];

  const Icon = config.icon;

  return (
    <div className={cn('mb-6 rounded-2xl border p-4 flex items-start gap-3', config.border, config.bg)}>
      <div className={cn('w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0', config.iconColor)}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-slate">{config.title}</p>
        <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">{config.body}</p>
      </div>
      <button
        type="button"
        onClick={() => navigate('/practitioner/profile')}
        className="shrink-0 text-[12px] font-bold text-forest hover:underline"
      >
        {config.action} →
      </button>
    </div>
  );
}

export default function PractitionerHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const todayAppts = MOCK_APPOINTMENTS.filter(a => a.status === 'confirmed');
  const nextGroup = MOCK_GROUP_SESSIONS[0];
  const pendingRequests = MOCK_CLIENT_REQUESTS;
  const unreadNotifications = MOCK_ATTENTION_NOTIFICATIONS;
  const practitioner = MOCK_PRACTITIONER as HomePractitioner;
  const displayName = user?.name ?? MOCK_PRACTITIONER.name;
  const profileLine = MOCK_PRACTITIONER.title ?? MOCK_PRACTITIONER.specialty;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  const attentionCount = pendingRequests.length + unreadNotifications.length;

  return (
    <div className="p-6 lg:p-8">
      <VerificationBanner profile={practitioner} />

      <div className="mb-8">
        <p className="small-caps text-gray-400 mb-1">{today}</p>
        <h1 className="serif text-4xl text-slate leading-tight">
          Welcome back, {displayName.split(' ').slice(-1)[0]}
        </h1>
        <p className="text-[14px] text-gray-400 mt-1">{profileLine}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Avg Rating',           value: MOCK_PRACTITIONER.rating,              suffix: '★', accent: 'text-amber-500'   },
          { label: 'Total Clients',        value: MOCK_PRACTITIONER.totalClients,        suffix: '',  accent: 'text-forest'      },
          { label: "Today's Sessions",     value: todayAppts.length,                     suffix: '',  accent: 'text-[#4B7399]'   },
          { label: 'Active Relationships', value: MOCK_PRACTITIONER.activeRelationships, suffix: '',  accent: 'text-terracotta'  },
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
              {stat.value}{stat.suffix && <span className="text-lg ml-0.5">{stat.suffix}</span>}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="small-caps text-gray-400">Today&apos;s Schedule</p>
              <button type="button" onClick={() => navigate('/practitioner/schedule')} className="text-[12px] font-semibold text-forest hover:underline">
                View full calendar →
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
              {todayAppts.length === 0 ? (
                <p className="px-5 py-10 text-center text-[13px] text-gray-400">No sessions scheduled for today.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-50/50">
                      {['Time', 'Client', 'Type', 'Action'].map(h => (
                        <th key={h} className={cn(
                          'px-5 py-3 small-caps text-[8px] text-gray-400 font-semibold',
                          h === 'Action' ? 'text-right' : 'text-left',
                        )}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {todayAppts.map(appt => {
                      const cfg = TYPE_CONFIG[appt.type] ?? TYPE_CONFIG.consultation;
                      return (
                        <tr key={appt.id} className="border-b border-brand-border last:border-0 hover:bg-brand-50/30 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                              <span className="text-[13px] font-semibold text-slate">{appt.time}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => navigate(`/practitioner/clients/${appt.patientId}`)}
                              className="text-[13px] font-medium text-slate hover:text-forest hover:underline transition-colors text-left"
                            >
                              {appt.patientName}
                            </button>
                          </td>
                          <td className="px-5 py-4">
                            <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full', cfg.bg)} style={{ color: cfg.color }}>
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => navigate(`/practitioner/session/${appt.id}`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f4ee] rounded-lg text-[12px] font-bold text-forest hover:bg-[#e4ebe0] transition-colors"
                            >
                              <Play size={12} fill="#4a6741" /> Start
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {nextGroup && (
            <section>
              <p className="small-caps text-gray-400 mb-3">Next Group Session</p>
              <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
                <div className="h-1 w-full bg-[#4B7399]" />
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#eef3f9] rounded-xl flex items-center justify-center shrink-0">
                      <Users size={20} className="text-[#4B7399]" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-slate">{nextGroup.title}</p>
                      <p className="text-[12px] text-gray-400 mt-1">
                        {nextGroup.time} · {nextGroup.enrolled}/{nextGroup.capacity} enrolled
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/practitioner/session/${nextGroup.id}?type=group`)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#4B7399] rounded-xl text-white text-[13px] font-bold hover:bg-[#3d6280] transition-colors"
                  >
                    <Play size={14} fill="white" /> Go Live
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="xl:col-span-2 space-y-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="small-caps text-gray-400">Needs Attention</p>
              {attentionCount > 0 && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#fdf3ec] text-terracotta">
                  {attentionCount}
                </span>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm divide-y divide-brand-border overflow-hidden">
              {pendingRequests.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[12px] font-bold text-slate flex items-center gap-2">
                      <UserPlus size={14} className="text-forest" />
                      Client requests
                    </p>
                    <button type="button" onClick={() => navigate('/practitioner/clients?tab=requested')} className="text-[11px] font-semibold text-forest hover:underline">
                      Review all
                    </button>
                  </div>
                  <div className="space-y-2">
                    {pendingRequests.map(req => (
                      <button
                        key={req.id}
                        type="button"
                        onClick={() => navigate(`/practitioner/clients?selected=${req.id}&tab=requested`)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-brand-50 hover:bg-[#f0f4ee] transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#f0f4ee] flex items-center justify-center shrink-0">
                          <Users size={14} className="text-forest" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-slate truncate">{req.name}</p>
                          <p className="text-[11px] text-gray-400 truncate">{req.serviceType} · {req.requestedAt}</p>
                        </div>
                        <ChevronRight size={14} className="text-gray-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {unreadNotifications.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[12px] font-bold text-slate flex items-center gap-2">
                      <MessageSquare size={14} className="text-[#4B7399]" />
                      Unread
                    </p>
                    <button type="button" onClick={() => navigate('/practitioner/chats')} className="text-[11px] font-semibold text-forest hover:underline">
                      Open messages
                    </button>
                  </div>
                  <div className="space-y-2">
                    {unreadNotifications.map(note => (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => navigate('/practitioner/chats')}
                        className="w-full p-3 rounded-xl hover:bg-brand-50 transition-colors text-left"
                      >
                        <p className="text-[13px] font-semibold text-slate">{note.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{note.body}</p>
                        <p className="text-[10px] text-gray-300 mt-1">{note.createdAt}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(practitioner.verificationStatus ?? 'verified') === 'verified' && attentionCount === 0 && (
                <div className="p-6 flex flex-col items-center gap-2 text-center">
                  <CheckCircle2 size={24} className="text-forest" />
                  <p className="text-[13px] font-semibold text-slate">You&apos;re all caught up</p>
                  <p className="text-[12px] text-gray-400">No pending requests or unread alerts</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
