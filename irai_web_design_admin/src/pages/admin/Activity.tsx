import { useState, useMemo } from 'react';
import {
  BookOpen, UserPlus, XCircle, Users, CheckCircle2, UserCheck,
  ShieldAlert, IndianRupee, Search, X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ADMIN_ACTIVITY, type ActivityItem, type ActivityType } from '../../adminData';
import { cn } from '../../lib/utils';

const ACTIVITY_CONFIG: Record<ActivityType, { bg: string; icon: LucideIcon; label: string }> = {
  booking:  { bg: 'bg-[#f0f4ee]', icon: BookOpen,     label: 'Booking'  },
  join:     { bg: 'bg-[#eef3f9]', icon: UserPlus,     label: 'Join'     },
  cancel:   { bg: 'bg-[#fdf3ec]', icon: XCircle,      label: 'Cancel'   },
  signup:   { bg: 'bg-[#f0f4ee]', icon: Users,        label: 'Signup'   },
  complete: { bg: 'bg-[#f0f4ee]', icon: CheckCircle2, label: 'Complete' },
  login:    { bg: 'bg-[#f3f0f9]', icon: UserCheck,    label: 'Login'    },
  dispute:  { bg: 'bg-[#fdf3ec]', icon: ShieldAlert,  label: 'Dispute'  },
  payout:   { bg: 'bg-[#eef3f9]', icon: IndianRupee,  label: 'Payout'   },
};

const TYPE_FILTERS: { id: ActivityType | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  ...Object.entries(ACTIVITY_CONFIG).map(([id, cfg]) => ({ id: id as ActivityType, label: cfg.label })),
];

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export default function AdminActivity() {
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = ADMIN_ACTIVITY;
    if (filter !== 'all') list = list.filter(a => a.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.description.toLowerCase().includes(q));
    }
    return list;
  }, [filter, search]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activity..."
            className="w-full bg-white border border-brand-border rounded-xl py-2.5 pl-10 pr-9 text-[13px] outline-none focus:border-forest/30" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} className="text-gray-300" /></button>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPE_FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={cn('px-3 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all',
                filter === f.id ? 'bg-slate text-white border-slate' : 'bg-white text-gray-400 border-brand-border')}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm divide-y divide-brand-border">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No activity found</div>
        ) : (
          filtered.map(item => <ActivityRow key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const cfg = ACTIVITY_CONFIG[item.type];
  const Icon = cfg.icon;

  return (
    <div className="px-5 py-4 flex items-start gap-4 hover:bg-brand-50/30 transition-colors">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', cfg.bg)}>
        <Icon size={16} className="text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-slate leading-snug">{item.description}</p>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-50 border border-brand-border text-gray-500">{item.type}</span>
          <span className="text-[11px] text-gray-400">{formatTimestamp(item.createdAt)}</span>
          {item.metadata && Object.entries(item.metadata).map(([k, v]) => (
            <span key={k} className="text-[10px] font-mono text-gray-400 bg-brand-50 px-1.5 py-0.5 rounded">{k}: {v}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
