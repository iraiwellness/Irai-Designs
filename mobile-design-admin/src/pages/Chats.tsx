import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Edit2, X } from 'lucide-react';
import { MOCK_PATIENTS } from '../mockData';
import { cn } from '../lib/utils';

const LAST_MESSAGES = [
  'Hello Doctor, I have a question about my diet plan...',
  'When is my next follow-up appointment?',
  'I noticed the new supplement is working really well!',
];

export default function Chats() {
  const [search, setSearch] = useState('');

  const chats = MOCK_PATIENTS.map((p, i) => ({
    ...p,
    lastMsg: LAST_MESSAGES[i % LAST_MESSAGES.length],
    time:    ['12:45 PM', '10:20 AM', 'Yesterday'][i % 3],
    unread:  [2, 0, 1][i % 3],
  }));

  const filtered = chats.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full bg-brand-50 pb-24">

      {/* ── Header ── */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-brand-border">
        <p className="small-caps text-gray-400 mb-1">Practitioner</p>
        <div className="flex items-center justify-between">
          <h2 className="serif text-3xl leading-none">Messages</h2>
          <button className="w-9 h-9 bg-slate rounded-xl flex items-center justify-center text-white active:scale-95 transition-all shadow-sm">
            <Edit2 size={16} />
          </button>
        </div>
        <p className="small-caps text-[7px] text-gray-400 mt-2">
          {chats.filter(c => c.unread > 0).length} unread conversations
        </p>
      </div>

      <div className="p-6 space-y-4">

        {/* ── Search ── */}
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full bg-white border border-brand-border rounded-xl py-3 pl-10 pr-9 text-[12px] text-slate placeholder:text-gray-300 outline-none focus:border-forest/30 transition-colors shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <X size={13} className="text-gray-300" />
            </button>
          )}
        </div>

        {/* ── Chat list ── */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
          {filtered.map((chat, idx) => (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                'w-full flex items-center gap-3 p-4 text-left active:bg-brand-50 transition-colors',
                idx < filtered.length - 1 && 'border-b border-brand-border',
              )}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-2xl object-cover"
                />
                {chat.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-forest text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {chat.unread}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className={cn('text-[12px] truncate', chat.unread > 0 ? 'font-bold text-slate' : 'font-semibold text-slate/70')}>
                    {chat.name}
                  </h4>
                  <span className="small-caps text-[7px] text-gray-400 shrink-0 ml-2">{chat.time}</span>
                </div>
                <p className={cn('text-[10px] truncate', chat.unread > 0 ? 'text-slate/60 font-medium' : 'text-gray-300')}>
                  {chat.lastMsg}
                </p>
              </div>
            </motion.button>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="small-caps text-[9px] text-gray-300">No conversations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
