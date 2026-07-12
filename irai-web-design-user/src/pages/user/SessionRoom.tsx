import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, Phone, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const POSES = ['Mountain Pose', 'Cat-Cow', 'Child\'s Pose', 'Supported Bridge', 'Legs-Up-The-Wall'];
const AI_NOTES = [
  'Spinal alignment improving during seated postures',
  'Breath rate stabilised after minute 8',
  'Recommend shorter hold times for forward folds',
];

export default function SessionRoom() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get('id') ?? '1';
  const type = params.get('type') ?? 'personal';

  const [phase, setPhase] = useState<'joining' | 'live' | 'ending' | 'report'>('joining');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [poseIdx, setPoseIdx] = useState(0);

  const start = () => {
    setPhase('live');
    const interval = setInterval(() => setPoseIdx(i => (i + 1) % POSES.length), 4000);
    setTimeout(() => { clearInterval(interval); setPhase('ending'); }, 12000);
    setTimeout(() => setPhase('report'), 14000);
  };

  if (phase === 'joining') {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <div className="w-24 h-24 rounded-2xl bg-forest/30 mx-auto mb-6 flex items-center justify-center">
            <Video size={32} className="text-forest" />
          </div>
          <h1 className="serif text-3xl mb-2">Session Room</h1>
          <p className="text-white/50 text-[14px] mb-8">{type === 'group' ? 'Group' : '1-on-1'} session · {sessionId}</p>
          <button type="button" onClick={start}
            className="px-8 py-3.5 rounded-2xl bg-forest text-white font-bold text-[14px]">Join Session</button>
          <button type="button" onClick={() => navigate('/user/sessions')} className="block mx-auto mt-4 text-[13px] text-white/40 hover:text-white/70">Cancel</button>
        </div>
      </div>
    );
  }

  if (phase === 'report') {
    return (
      <div className="min-h-screen bg-brand-50 p-6 lg:p-10 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-brand-border p-8 max-w-lg w-full text-center">
          <CheckCircle2 size={48} className="text-forest mx-auto mb-4" />
          <h2 className="serif text-3xl text-slate">Session Complete</h2>
          <div className="mt-6 text-left space-y-2">
            {AI_NOTES.map(n => (
              <div key={n} className="flex items-start gap-2 text-[13px] text-gray-600">
                <Sparkles size={14} className="text-amber-500 shrink-0 mt-0.5" /> {n}
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-8">
            <button type="button" onClick={() => navigate('/user/sessions')} className="flex-1 py-3 rounded-xl border border-brand-border font-bold text-[13px]">Sessions</button>
            <button type="button" onClick={() => navigate('/user/booking')} className="flex-1 py-3 rounded-xl bg-forest text-white font-bold text-[13px]">Book Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      <div className="flex-1 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-forest/20 to-transparent" />
        <div className="relative z-10 text-center text-white">
          <p className="small-caps text-white/40 mb-2">{phase === 'ending' ? 'Wrapping up…' : 'Now practicing'}</p>
          <h2 className="serif text-4xl">{POSES[poseIdx]}</h2>
          {type === 'group' && <p className="text-[13px] text-white/40 mt-4">14 participants connected</p>}
        </div>
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
          <div className="flex gap-2">
            <button type="button" onClick={() => setMicOn(v => !v)}
              className={cn('w-11 h-11 rounded-full flex items-center justify-center', micOn ? 'bg-white/10 text-white' : 'bg-terracotta text-white')}>
              {micOn ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <button type="button" onClick={() => setCamOn(v => !v)}
              className={cn('w-11 h-11 rounded-full flex items-center justify-center', camOn ? 'bg-white/10 text-white' : 'bg-terracotta text-white')}>
              {camOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
          </div>
          <button type="button" onClick={() => setPhase('report')}
            className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center">
            <Phone size={18} className="rotate-[135deg]" />
          </button>
        </div>
      </div>
    </div>
  );
}
