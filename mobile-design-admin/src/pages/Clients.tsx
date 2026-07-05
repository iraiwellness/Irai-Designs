import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, X, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_PATIENTS } from '../mockData';
import { cn } from '../lib/utils';

const STATUS_TABS = ['All', 'Active', 'New', 'Completed'];

export default function Clients() {
  const [search, setSearch]       = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filtered = MOCK_PATIENTS.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full bg-brand-50 pb-24">

      {/* ── Header ── */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-brand-border">
        <p className="small-caps text-gray-400 mb-1">Practitioner</p>
        <h2 className="serif text-3xl leading-none">My Clients</h2>
        <p className="small-caps text-[7px] text-gray-400 mt-2">
          {MOCK_PATIENTS.length} total clients
        </p>
      </div>

      <div className="p-6 space-y-4">

        {/* ── Search ── */}
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or condition..."
            className="w-full bg-white border border-brand-border rounded-xl py-3 pl-10 pr-9 text-[12px] text-slate placeholder:text-gray-300 outline-none focus:border-forest/30 transition-colors shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <X size={13} className="text-gray-300" />
            </button>
          )}
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-1">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 border transition-all',
                activeTab === tab
                  ? 'bg-slate text-white border-slate'
                  : 'bg-white text-gray-400 border-brand-border',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <p className="small-caps text-gray-400 text-[8px] px-1">
          {filtered.length} client{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* ── Client cards ── */}
        <div className="space-y-3">
          {filtered.map((patient, idx) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="active:scale-[0.98] transition-transform"
            >
              <Link
                to={`/practitioner/clients/${patient.id}`}
                className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 flex items-center gap-4 block"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-forest border-2 border-white rounded-full" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate truncate">{patient.name}</p>
                  <p className="small-caps text-[7px] text-forest mt-0.5 truncate">{patient.condition}</p>
                </div>

                {/* Next appointment */}
                <div className="text-right shrink-0">
                  <p className="text-[9px] font-bold text-gray-400">Next appt.</p>
                  <p className="text-[9px] text-slate font-semibold">
                    {new Date(patient.nextAppointment + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Users size={28} className="mx-auto mb-3 text-gray-200" />
              <p className="small-caps text-[9px] text-gray-300">No clients found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
