import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Send, Paperclip } from 'lucide-react';
import { MOCK_PATIENTS } from '../../mockData';
import { cn } from '../../lib/utils';

const LAST_MESSAGES = [
  'Hello Doctor, I have a question about my diet plan...',
  'When is my next follow-up appointment?',
  'I noticed the new supplement is working really well!',
];

const MOCK_THREADS: Record<string, { from: 'patient' | 'practitioner'; text: string; time: string }[]> = {
  pt1: [
    { from: 'patient', text: 'Hello Doctor, I have a question about my diet plan. Can I have oats in the morning?', time: '12:30 PM' },
    { from: 'practitioner', text: 'Hi Emma! Yes, steel-cut oats are fine — stick to a small portion with protein on the side.', time: '12:38 PM' },
    { from: 'patient', text: 'Hello Doctor, I have a question about my diet plan...', time: '12:45 PM' },
  ],
  pt2: [
    { from: 'patient', text: 'When is my next follow-up appointment?', time: '10:15 AM' },
    { from: 'practitioner', text: 'Your next session is scheduled for May 20th at 11:30 AM.', time: '10:20 AM' },
  ],
  pt3: [
    { from: 'patient', text: 'I noticed the new supplement is working really well!', time: 'Yesterday' },
    { from: 'practitioner', text: "That's great to hear, Sophia! Let's review your progress in our next session.", time: 'Yesterday' },
  ],
};

export default function Messages() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');

  const chats = MOCK_PATIENTS.map((p, i) => ({
    ...p,
    lastMsg: LAST_MESSAGES[i % LAST_MESSAGES.length],
    time: ['12:45 PM', '10:20 AM', 'Yesterday'][i % 3],
    unread: [2, 0, 1][i % 3],
  }));

  const filtered = chats.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedId = params.get('thread') ?? filtered[0]?.id;
  const selected = chats.find(c => c.id === selectedId) ?? filtered[0];
  const messages = selected ? (MOCK_THREADS[selected.id] ?? []) : [];

  return (
    <div className="p-6 lg:p-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-5">
        <p className="small-caps text-gray-400 mb-1">Practitioner</p>
        <h1 className="serif text-4xl text-slate leading-tight">Messages</h1>
        <p className="text-[13px] text-gray-400 mt-1">
          {chats.filter(c => c.unread > 0).length} unread conversations
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-5 min-h-0">
        {/* Thread list */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-brand-border shadow-sm flex flex-col overflow-hidden">
          <div className="p-3 border-b border-brand-border">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-brand-50 border border-brand-border rounded-xl py-2 pl-9 pr-8 text-[13px] outline-none focus:border-forest/30"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <X size={13} className="text-gray-300" />
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-brand-border">
            {filtered.map(chat => (
              <button
                key={chat.id}
                onClick={() => setParams({ thread: chat.id })}
                className={cn(
                  'w-full flex items-center gap-3 p-4 text-left transition-colors',
                  chat.id === selectedId ? 'bg-[#f0f4ee]' : 'hover:bg-brand-50/50',
                )}
              >
                <div className="relative shrink-0">
                  <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-xl object-cover" />
                  {chat.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-forest text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className={cn('text-[13px] truncate', chat.unread > 0 ? 'font-bold text-slate' : 'font-medium text-slate/70')}>
                      {chat.name}
                    </p>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-2">{chat.time}</span>
                  </div>
                  <p className={cn('text-[12px] truncate mt-0.5', chat.unread > 0 ? 'text-slate/70' : 'text-gray-400')}>
                    {chat.lastMsg}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active thread */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-border shadow-sm flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="px-5 py-4 border-b border-brand-border flex items-center gap-3">
                <img src={selected.avatar} alt={selected.name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-slate">{selected.name}</p>
                  <p className="text-[12px] text-forest">{selected.condition}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-brand-50/30">
                {messages.map((msg, i) => (
                  <div key={i} className={cn('flex', msg.from === 'practitioner' ? 'justify-end' : 'justify-start')}>
                    <div
                      className={cn(
                        'max-w-[75%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed',
                        msg.from === 'practitioner'
                          ? 'bg-forest text-white rounded-br-md'
                          : 'bg-white border border-brand-border text-slate rounded-bl-md',
                      )}
                    >
                      <p>{msg.text}</p>
                      <p className={cn('text-[10px] mt-1', msg.from === 'practitioner' ? 'text-white/50' : 'text-gray-400')}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-brand-border flex items-center gap-3">
                <button className="w-9 h-9 rounded-xl border border-brand-border flex items-center justify-center text-gray-400 hover:bg-brand-50">
                  <Paperclip size={16} />
                </button>
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-brand-50 border border-brand-border rounded-xl py-2.5 px-4 text-[13px] outline-none focus:border-forest/30"
                  onKeyDown={e => { if (e.key === 'Enter') setDraft(''); }}
                />
                <button
                  onClick={() => setDraft('')}
                  className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-white hover:bg-[#3d5636] transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-[14px]">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
