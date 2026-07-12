import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyzeDocument } from '../lib/gemini';
import type { HealthDocument } from '../userData';
import { cn } from '../lib/utils';

const STORAGE_KEY = 'irai_health_docs';
const CONDITIONS = ['Lower back pain', 'Stress & anxiety', 'Weight management', 'General wellness', 'Post-injury recovery'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [concern, setConcern] = useState('');
  const [docs, setDocs] = useState<HealthDocument[]>([]);
  const [uploading, setUploading] = useState(false);

  if (!user) { navigate('/login', { replace: true }); return null; }
  if (!user.planId) { navigate('/pricing', { replace: true }); return null; }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || docs.length >= 2) return;
    setUploading(true);
    const summary = await analyzeDocument(file);
    const doc: HealthDocument = {
      id: `doc-${Date.now()}`,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      status: 'done',
      summary,
    };
    const next = [...docs, doc];
    setDocs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUploading(false);
  };

  const complete = () => {
    updateUser({ onboarded: true, onboardingStep: 3 });
    navigate('/user');
  };

  const skip = () => {
    updateUser({ onboarded: true, onboardingStep: 3 });
    navigate('/user');
  };

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={cn('h-1 flex-1 rounded-full', step >= s ? 'bg-forest' : 'bg-brand-border')} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h1 className="serif text-3xl text-slate">Tell us about yourself</h1>
            <p className="text-[14px] text-gray-400">Helps practitioners personalise your care.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONDITIONS.map(c => (
                <button key={c} type="button" onClick={() => setConcern(c)}
                  className={cn('p-4 rounded-xl border text-left text-[13px] font-medium transition-colors',
                    concern === c ? 'border-forest bg-[#f0f4ee] text-forest' : 'border-brand-border hover:bg-brand-50')}>
                  {c}
                </button>
              ))}
            </div>
            <button type="button" disabled={!concern} onClick={() => setStep(2)}
              className="flex items-center gap-2 py-3 px-6 rounded-xl bg-forest text-white font-bold text-[13px] disabled:opacity-50">
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h1 className="serif text-3xl text-slate">Upload health documents</h1>
            <p className="text-[14px] text-gray-400">Optional · AI extracts diagnoses, medications &amp; safe poses</p>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-brand-border rounded-2xl p-10 cursor-pointer hover:bg-brand-50 transition-colors">
              <Upload size={28} className="text-gray-300 mb-3" />
              <span className="text-[13px] font-semibold text-slate">{uploading ? 'Analyzing…' : 'Upload PDF or image'}</span>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} disabled={uploading || docs.length >= 2} />
            </label>
            {docs.map(d => (
              <div key={d.id} className="bg-white rounded-xl border border-brand-border p-4 flex items-center gap-3">
                <Sparkles size={18} className="text-amber-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate truncate">{d.name}</p>
                  <p className="text-[11px] text-gray-400">{d.summary?.diagnoses[0]}</p>
                </div>
                <CheckCircle2 size={16} className="text-forest" />
              </div>
            ))}
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(3)} className="py-3 px-6 rounded-xl bg-forest text-white font-bold text-[13px]">Continue</button>
              <button type="button" onClick={skip} className="py-3 px-6 rounded-xl border border-brand-border text-[13px] font-bold">Skip</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center py-8">
            <CheckCircle2 size={48} className="text-forest mx-auto" />
            <h1 className="serif text-3xl text-slate">You&apos;re all set</h1>
            <p className="text-[14px] text-gray-400">Primary concern: {concern || 'General wellness'}</p>
            <button type="button" onClick={complete} className="py-3.5 px-8 rounded-2xl bg-forest text-white font-bold text-[14px]">
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
