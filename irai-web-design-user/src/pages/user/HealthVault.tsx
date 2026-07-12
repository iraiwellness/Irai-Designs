import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Sparkles, FileText, ChevronLeft, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PLANS } from '../../userData';
import type { HealthDocument } from '../../userData';
import { analyzeDocument } from '../../lib/gemini';
import { cn } from '../../lib/utils';

const STORAGE_KEY = 'irai_health_docs';
const LIMITS: Record<string, number> = { foundation: 2, balanced: 10, transform: Infinity };

export default function HealthVault() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [docs, setDocs] = useState<HealthDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [viewSummary, setViewSummary] = useState<HealthDocument | null>(null);

  const plan = PLANS.find(p => p.id === user?.planId);
  const limit = LIMITS[user?.planId ?? 'foundation'] ?? 2;

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setDocs(JSON.parse(raw));
  }, []);

  const save = (next: HealthDocument[]) => {
    setDocs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || docs.length >= limit) return;
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
    save([...docs, doc]);
    setUploading(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <button type="button" onClick={() => navigate('/user/profile')}
        className="flex items-center gap-2 text-[13px] text-gray-400 hover:text-slate mb-6">
        <ChevronLeft size={16} /> Back to Profile
      </button>

      <p className="small-caps text-gray-400 mb-1">Health Vault</p>
      <h1 className="serif text-3xl text-slate mb-2">Medical Documents</h1>
      <p className="text-[13px] text-gray-400 mb-6">
        {docs.length}{limit === Infinity ? '' : ` / ${limit}`} documents · {plan?.name ?? 'Foundation'} plan
      </p>

      {docs.length >= limit && limit !== Infinity && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0" />
          <p className="text-[13px] text-amber-800">Document limit reached. <button type="button" onClick={() => navigate('/pricing')} className="font-bold underline">Upgrade plan</button></p>
        </div>
      )}

      <label className={cn('flex flex-col items-center justify-center border-2 border-dashed border-brand-border rounded-2xl p-8 mb-6 cursor-pointer hover:bg-brand-50 transition-colors',
        (uploading || docs.length >= limit) && 'opacity-50 pointer-events-none')}>
        <Upload size={24} className="text-gray-300 mb-2" />
        <span className="text-[13px] font-semibold text-slate">{uploading ? 'Analyzing with AI…' : 'Upload document'}</span>
        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} />
      </label>

      <div className="space-y-3">
        {docs.map(d => (
          <div key={d.id} className="bg-white rounded-2xl border border-brand-border p-5 flex items-center gap-4">
            <FileText size={20} className="text-[#4B7399]" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate truncate">{d.name}</p>
              <p className="text-[11px] text-gray-400">{new Date(d.uploadedAt).toLocaleDateString()}</p>
            </div>
            {d.summary && (
              <button type="button" onClick={() => setViewSummary(d)}
                className="px-3 py-1.5 rounded-lg bg-[#f0f4ee] text-forest text-[11px] font-bold flex items-center gap-1">
                <Sparkles size={12} /> AI Summary
              </button>
            )}
          </div>
        ))}
        {docs.length === 0 && <p className="text-center text-[13px] text-gray-400 py-8">No documents uploaded yet</p>}
      </div>

      {viewSummary?.summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setViewSummary(null)}>
          <div className="bg-white rounded-2xl border border-brand-border p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="serif text-xl text-slate mb-4">AI Health Summary</h3>
            <div className="space-y-4 text-[13px]">
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1">Diagnoses</p>
                <ul className="list-disc pl-4 text-gray-600">{viewSummary.summary.diagnoses.map(d => <li key={d}>{d}</li>)}</ul>
              </div>
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1">Safe poses</p>
                <p className="text-gray-600">{viewSummary.summary.safePoses.join(', ')}</p>
              </div>
              <div>
                <p className="small-caps text-[8px] text-gray-400 mb-1">Avoid</p>
                <p className="text-gray-600">{viewSummary.summary.avoidPoses.join(', ')}</p>
              </div>
            </div>
            <button type="button" onClick={() => setViewSummary(null)} className="mt-6 w-full py-2.5 rounded-xl border border-brand-border font-bold text-[13px]">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
