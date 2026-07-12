import { useMemo, useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, X, Send, Paperclip, Phone, MoreVertical,
  ArrowLeft, MessageSquare,
} from 'lucide-react';
import { MOCK_PATIENTS } from '../../mockData';
import { cn } from '../../lib/utils';

interface ChatMessage {
  id: string;
  from: 'patient' | 'practitioner';
  text: string;
  time: string;
}

const LAST_MESSAGES = [
  'Hello Doctor, I have a question about my diet plan...',
  'When is my next follow-up appointment?',
  'I noticed the new supplement is working really well!',
];

const MOCK_THREADS: Record<string, ChatMessage[]> = {
  pt1: [
    { id: 'm1', from: 'patient', text: 'Hello Doctor, I have a question about my diet plan for this week.', time: '12:30 PM' },
    { id: 'm2', from: 'practitioner', text: 'Hi Emma! Of course — what would you like to adjust?', time: '12:38 PM' },
    { id: 'm3', from: 'patient', text: 'Can we swap the evening carbs for more protein? I feel bloated after dinner.', time: '12:45 PM' },
  ],
  pt2: [
    { id: 'm4', from: 'patient', text: 'When is my next follow-up appointment?', time: '10:15 AM' },
    { id: 'm5', from: 'practitioner', text: 'Your next session is scheduled for May 20 at 11:30 AM.', time: '10:20 AM' },
  ],
  pt3: [
    { id: 'm6', from: 'patient', text: 'I noticed the new supplement is working really well!', time: 'Yesterday' },
    { id: 'm7', from: 'practitioner', text: 'That is great to hear, Sophia. Keep monitoring how you feel and note any changes.', time: 'Yesterday' },
    { id: 'm8', from: 'patient', text: 'Energy levels are much more stable in the afternoons now.', time: 'Yesterday' },
  ],
};

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [threads, setThreads] = useState(MOCK_THREADS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedId = searchParams.get('thread');

  const chats = useMemo(
    () =>
      MOCK_PATIENTS.map((p, i) => ({
        ...p,
        lastMsg: LAST_MESSAGES[i % LAST_MESSAGES.length],
        time: ['12:45 PM', '10:20 AM', 'Yesterday'][i % 3],
        unread: [2, 0, 1][i % 3],
      })),
    [],
  );

  const filtered = chats.filter(
    c => !search || c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = chats.find(c => c.id === selectedId) ?? null;
  const messages = selectedId ? (threads[selectedId] ?? []) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedId, messages.length]);

  const selectThread = (id: string) => {
    setSearchParams({ thread: id });
    setDraft('');
  };

  const handleSend = () => {
    if (!draft.trim() || !selectedId) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      from: 'practitioner',
      text: draft.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setThreads(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), newMsg],
    }));
    setDraft('');
  };

  const unreadTotal = chats.filter(c => c.unread > 0).length;

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-brand-50 overflow-hidden">
      {/* ── Left: contact list ── */}
      <aside
        className={cn(
          'flex flex-col border-r border-brand-border bg-white shrink-0',
          'w-full md:w-80 lg:w-[340px]',
          selectedId && 'hidden md:flex',
        )}
      >
        <div className="px-4 py-4 border-b border-brand-border shrink-0">
          <h2 className="serif text-2xl text-slate leading-none mb-1">Messages</h2>
          <p className="small-caps text-[7px] text-gray-400">
            {unreadTotal} unread conversation{unreadTotal !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="px-4 py-3 border-b border-brand-border shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search contacts..."
              className="w-full bg-brand-50 border border-brand-border rounded-xl py-2.5 pl-9 pr-8 text-[12px] text-slate placeholder:text-gray-300 outline-none focus:border-forest/30 transition-colors"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={13} className="text-gray-300" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map(chat => {
            const active = chat.id === selectedId;
            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => selectThread(chat.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-brand-border/60',
                  active ? 'bg-[#f0f4ee] border-l-2 border-l-forest' : 'hover:bg-brand-50/80 border-l-2 border-l-transparent',
                )}
              >
                <div className="relative shrink-0">
                  <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-xl object-cover" />
                  {chat.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-forest text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2 mb-0.5">
                    <h4 className={cn('text-[13px] truncate', chat.unread > 0 || active ? 'font-bold text-slate' : 'font-semibold text-slate/70')}>
                      {chat.name}
                    </h4>
                    <span className="small-caps text-[7px] text-gray-400 shrink-0">{chat.time}</span>
                  </div>
                  <p className={cn('text-[11px] truncate', chat.unread > 0 ? 'text-slate/60 font-medium' : 'text-gray-400')}>
                    {chat.lastMsg}
                  </p>
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 px-4">
              <p className="small-caps text-[9px] text-gray-300">No contacts found</p>
            </div>
          )}
        </div>
      </aside>

      {/* ── Right: chat thread ── */}
      <main
        className={cn(
          'flex-1 flex flex-col min-w-0 bg-brand-50',
          !selectedId && 'hidden md:flex',
          selectedId && 'flex',
        )}
      >
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              {/* Chat header */}
              <div className="shrink-0 bg-white border-b border-brand-border px-4 py-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="md:hidden w-9 h-9 rounded-xl border border-brand-border flex items-center justify-center text-slate"
                >
                  <ArrowLeft size={16} />
                </button>
                <img src={selected.avatar} alt={selected.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-slate truncate">{selected.name}</p>
                  <p className="small-caps text-[7px] text-gray-400 truncate">{selected.condition}</p>
                </div>
                <button type="button" className="w-9 h-9 rounded-xl border border-brand-border flex items-center justify-center text-gray-400 hover:text-forest transition-colors">
                  <Phone size={16} />
                </button>
                <button type="button" className="w-9 h-9 rounded-xl border border-brand-border flex items-center justify-center text-gray-400 hover:text-forest transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map(msg => {
                  const isMine = msg.from === 'practitioner';
                  return (
                    <div key={msg.id} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
                      <div
                        className={cn(
                          'max-w-[75%] lg:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm',
                          isMine
                            ? 'bg-forest text-white rounded-br-md'
                            : 'bg-white border border-brand-border text-slate rounded-bl-md',
                        )}
                      >
                        <p className="text-[13px] leading-relaxed">{msg.text}</p>
                        <p className={cn('text-[9px] mt-1 text-right', isMine ? 'text-white/60' : 'text-gray-400')}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Compose bar */}
              <div className="shrink-0 bg-white border-t border-brand-border px-4 py-3">
                <div className="flex items-end gap-2 max-w-4xl mx-auto w-full">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-xl border border-brand-border flex items-center justify-center text-gray-400 hover:text-forest shrink-0"
                  >
                    <Paperclip size={16} />
                  </button>
                  <textarea
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    rows={1}
                    placeholder="Type a message..."
                    className="flex-1 resize-none bg-brand-50 border border-brand-border rounded-xl px-4 py-2.5 text-[13px] text-slate placeholder:text-gray-300 outline-none focus:border-forest/30 min-h-[42px] max-h-28"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!draft.trim()}
                    className="w-10 h-10 rounded-xl bg-forest text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-forest/90 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:flex flex-1 flex-col items-center justify-center text-center px-8"
            >
              <div className="w-16 h-16 bg-white rounded-2xl border border-brand-border flex items-center justify-center mb-4">
                <MessageSquare size={28} className="text-gray-300" />
              </div>
              <p className="serif text-xl text-slate mb-1">Select a conversation</p>
              <p className="text-[13px] text-gray-400 max-w-sm">
                Choose a client from the list to view messages and reply.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
