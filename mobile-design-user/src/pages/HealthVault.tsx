/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldAlert,
  Pill,
  FlaskConical,
  Sparkles,
  ChevronDown,
  ChevronUp,
  XCircle,
  Leaf,
  Ban,
  Stethoscope,
  ClipboardList,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeDocument, isDemoMode } from '../lib/gemini';
import { User, PLANS, HealthDocument, HealthSummary } from '../constants';
import { cn } from '../lib/utils';

const STORAGE_KEY = 'irai_health_docs';

function getPlanLimit(planId?: string): number {
  if (planId === 'transform') return Infinity;
  if (planId === 'balanced') return 10;
  return 2;
}

function loadDocs(): HealthDocument[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveDocs(docs: HealthDocument[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

function mergeSummaries(docs: HealthDocument[]): HealthSummary | null {
  const analyzed = docs.filter(d => d.status === 'done' && d.summary);
  if (!analyzed.length) return null;

  const merge = (arr: string[][]): string[] =>
    [...new Set(arr.flat().filter(Boolean))];

  return {
    diagnoses: merge(analyzed.map(d => d.summary!.diagnoses)),
    medications: Object.values(
      Object.fromEntries(
        analyzed.flatMap(d => d.summary!.medications).map(m => [m.name, m])
      )
    ),
    labValues: Object.values(
      Object.fromEntries(
        analyzed.flatMap(d => d.summary!.labValues).map(l => [l.test, l])
      )
    ),
    safePoses: merge(analyzed.map(d => d.summary!.safePoses)),
    avoidPoses: merge(analyzed.map(d => d.summary!.avoidPoses)),
    contraindications: merge(analyzed.map(d => d.summary!.contraindications)),
    imagingFindings:
      analyzed.findLast(d => d.summary!.imagingFindings)?.summary!
        .imagingFindings ?? '',
    recommendations: merge(analyzed.map(d => d.summary!.recommendations)),
    extractedAt: new Date().toISOString(),
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionCard({
  icon: Icon,
  title,
  children,
  accent,
  defaultOpen = true,
}: {
  icon: React.FC<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
  accent?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              accent ?? 'bg-[#f5f7f2] text-forest border border-brand-border'
            )}
          >
            <Icon size={15} />
          </div>
          <span className="small-caps text-[10px] text-slate">{title}</span>
        </div>
        {open ? (
          <ChevronUp size={14} className="text-gray-300" />
        ) : (
          <ChevronDown size={14} className="text-gray-300" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-brand-border">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PoseBadge({
  label,
  variant,
}: {
  label: string;
  variant: 'safe' | 'avoid';
  key?: string;
}) {
  return (
    <span
      className={cn(
        'text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border',
        variant === 'safe'
          ? 'text-forest bg-[#f0f4ee] border-forest/20'
          : 'text-red-500 bg-red-50 border-red-100'
      )}
    >
      {label}
    </span>
  );
}

function LabBadge({ status }: { status: 'normal' | 'low' | 'high' }) {
  const map = {
    normal: 'text-forest bg-[#f0f4ee] border-forest/20',
    low: 'text-[#4B7399] bg-[#eef3f9] border-[#4B7399]/20',
    high: 'text-terracotta bg-[#fdf3ec] border-terracotta/20',
  };
  return (
    <span
      className={cn(
        'text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border',
        map[status]
      )}
    >
      {status}
    </span>
  );
}

function DocCard({
  doc,
  onRemove,
}: {
  doc: HealthDocument;
  onRemove: (id: string) => void;
  key?: string;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="bg-white rounded-xl border border-brand-border flex items-center gap-3 px-4 py-3"
    >
      <div
        className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border',
          doc.status === 'processing'
            ? 'bg-[#f5f7f2] border-brand-border text-forest'
            : doc.status === 'done'
            ? 'bg-[#f0f4ee] border-forest/20 text-forest'
            : 'bg-red-50 border-red-100 text-red-400'
        )}
      >
        {doc.status === 'processing' ? (
          <Loader2 size={16} className="animate-spin" />
        ) : doc.status === 'done' ? (
          <CheckCircle2 size={16} />
        ) : (
          <XCircle size={16} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-slate uppercase tracking-tight truncate">
          {doc.name}
        </p>
        <p className="small-caps text-[7px] text-gray-400 mt-0.5">
          {doc.status === 'processing'
            ? 'Analysing with AI…'
            : doc.status === 'done'
            ? `Analysed · ${(doc.size / 1024).toFixed(0)} KB`
            : 'Analysis failed'}
        </p>
      </div>

      {doc.status !== 'processing' && (
        <button
          onClick={() => onRemove(doc.id)}
          className="text-gray-200 hover:text-red-300 transition-colors shrink-0"
        >
          <XCircle size={16} />
        </button>
      )}
    </motion.div>
  );
}

function HealthSummaryView({ summary }: { summary: HealthSummary }) {
  return (
    <div className="space-y-3">
      {/* Contraindication alert */}
      {summary.contraindications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#fdf3ec] border border-terracotta/30 rounded-2xl p-4 flex gap-3"
        >
          <ShieldAlert size={18} className="text-terracotta shrink-0 mt-0.5" />
          <div>
            <p className="small-caps text-[9px] text-terracotta mb-2">
              Contraindication Alerts
            </p>
            <ul className="space-y-1">
              {summary.contraindications.map((c, i) => (
                <li key={i} className="text-[11px] text-slate/80 font-medium flex gap-2">
                  <span className="text-terracotta mt-0.5">·</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Diagnoses */}
      {summary.diagnoses.length > 0 && (
        <SectionCard icon={Stethoscope} title="Diagnoses">
          <div className="space-y-2 mt-1">
            {summary.diagnoses.map((d, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-[12px] text-slate font-medium"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                {d}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Safe & Avoid Poses */}
      {(summary.safePoses.length > 0 || summary.avoidPoses.length > 0) && (
        <SectionCard icon={Leaf} title="Yoga Pose Guidance">
          {summary.safePoses.length > 0 && (
            <div className="mb-4">
              <p className="small-caps text-[8px] text-gray-400 mb-2">
                Safe Poses
              </p>
              <div className="flex flex-wrap gap-1.5">
                {summary.safePoses.map(p => (
                  <PoseBadge key={p} label={p} variant="safe" />
                ))}
              </div>
            </div>
          )}
          {summary.avoidPoses.length > 0 && (
            <div>
              <p className="small-caps text-[8px] text-gray-400 mb-2">
                Avoid
              </p>
              <div className="flex flex-wrap gap-1.5">
                {summary.avoidPoses.map(p => (
                  <PoseBadge key={p} label={p} variant="avoid" />
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Medications */}
      {summary.medications.length > 0 && (
        <SectionCard icon={Pill} title="Current Medications">
          <div className="space-y-3 mt-1">
            {summary.medications.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-brand-border last:border-0 pb-3 last:pb-0"
              >
                <p className="text-[12px] font-bold text-slate uppercase tracking-tight">
                  {m.name}
                </p>
                <p className="small-caps text-[8px] text-gray-400">{m.dosage}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Lab Values */}
      {summary.labValues.length > 0 && (
        <SectionCard icon={FlaskConical} title="Lab Values" defaultOpen={false}>
          <div className="space-y-3 mt-1">
            {summary.labValues.map((l, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-brand-border last:border-0 pb-3 last:pb-0"
              >
                <div>
                  <p className="text-[11px] font-bold text-slate uppercase tracking-tight">
                    {l.test}
                  </p>
                  <p className="small-caps text-[8px] text-gray-400 mt-0.5">
                    {l.value}
                  </p>
                </div>
                <LabBadge status={l.status} />
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Imaging Findings */}
      {summary.imagingFindings && (
        <SectionCard
          icon={FileText}
          title="Imaging Findings"
          defaultOpen={false}
        >
          <p className="text-[12px] text-gray-500 leading-relaxed italic font-medium mt-1">
            "{summary.imagingFindings}"
          </p>
        </SectionCard>
      )}

      {/* Recommendations */}
      {summary.recommendations.length > 0 && (
        <SectionCard
          icon={ClipboardList}
          title="Clinical Recommendations"
          defaultOpen={false}
        >
          <ul className="space-y-2 mt-1">
            {summary.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-gray-500 font-medium">
                <span className="text-forest mt-0.5 shrink-0">→</span>
                {r}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function HealthVault({ user }: { user: User | null }) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docs, setDocs] = useState<HealthDocument[]>(loadDocs);
  const plan = PLANS.find(p => p.id === user?.planId);
  const limit = getPlanLimit(user?.planId);
  const atLimit = docs.length >= limit;
  const summary = mergeSummaries(docs);
  const hasAnalyzed = docs.some(d => d.status === 'done');

  useEffect(() => {
    saveDocs(docs);
  }, [docs]);

  async function handleFiles(files: FileList | null) {
    if (!files || atLimit) return;
    const accepted = Array.from(files).slice(0, limit - docs.length);

    const newDocs: HealthDocument[] = accepted.map(f => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      uploadedAt: new Date().toISOString(),
      status: 'processing',
    }));

    setDocs(prev => [...prev, ...newDocs]);

    // Analyse each file
    for (let i = 0; i < accepted.length; i++) {
      const file = accepted[i];
      const id = newDocs[i].id;
      try {
        const extracted = await analyzeDocument(file);
        setDocs(prev =>
          prev.map(d =>
            d.id === id ? { ...d, status: 'done', summary: extracted } : d
          )
        );
      } catch {
        setDocs(prev =>
          prev.map(d => (d.id === id ? { ...d, status: 'error' } : d))
        );
      }
    }
  }

  function removeDoc(id: string) {
    setDocs(prev => prev.filter(d => d.id !== id));
  }

  return (
    <div className="min-h-full bg-brand-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-brand-border">
        <button
          onClick={() => navigate('/profile')}
          className="mb-4 w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-forest"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-start justify-between">
          <div>
            <p className="small-caps text-gray-400 mb-1">AI-Powered</p>
            <h2 className="serif text-3xl leading-none">Health Vault</h2>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="bg-[#f5f7f2] border border-brand-border px-3 py-1 rounded-full flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-forest" />
              <span className="small-caps text-[8px] text-forest">
                {plan?.name ?? 'Foundation'}
              </span>
            </div>
            {isDemoMode && (
              <div className="bg-[#fdf3ec] border border-terracotta/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles size={9} className="text-terracotta" />
                <span className="small-caps text-[7px] text-terracotta">
                  AI Demo
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Plan usage bar */}
        <div className="bg-white rounded-2xl border border-brand-border p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="small-caps text-[9px]">Documents Used</span>
            <span className="small-caps text-[9px] text-forest">
              {docs.length} / {limit === Infinity ? '∞' : limit}
            </span>
          </div>
          <div className="h-1.5 bg-[#f5f7f2] rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                atLimit ? 'bg-terracotta' : 'bg-forest'
              )}
              style={{
                width:
                  limit === Infinity
                    ? `${Math.min((docs.length / 10) * 100, 100)}%`
                    : `${(docs.length / limit) * 100}%`,
              }}
            />
          </div>
          {atLimit && limit !== Infinity && (
            <p className="text-[10px] text-terracotta font-medium">
              Limit reached.{' '}
              <button
                onClick={() => navigate('/pricing')}
                className="underline"
              >
                Upgrade plan
              </button>{' '}
              for more documents.
            </p>
          )}
        </div>

        {/* Upload zone */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
          <button
            disabled={atLimit}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 transition-all',
              atLimit
                ? 'border-gray-100 opacity-40 cursor-not-allowed'
                : 'border-brand-border hover:border-forest/40 active:scale-[0.98]'
            )}
          >
            <div className="w-12 h-12 bg-[#f5f7f2] rounded-full flex items-center justify-center text-forest border border-brand-border">
              <Upload size={22} />
            </div>
            <div className="text-center">
              <p className="font-bold text-slate text-[12px] uppercase tracking-tight">
                Upload Medical Reports
              </p>
              <p className="small-caps text-[8px] text-gray-300 mt-1">
                PDF, JPG, PNG · Analysed instantly by AI
              </p>
            </div>
          </button>
        </div>

        {/* Demo mode info */}
        {isDemoMode && docs.length === 0 && (
          <div className="bg-[#f5f7f2] border border-brand-border rounded-xl p-4 flex gap-3">
            <Info size={14} className="text-forest shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              No Gemini API key configured. Upload any document to see a{' '}
              <strong>demo analysis</strong> — add{' '}
              <code className="bg-white px-1 rounded text-[10px] border border-brand-border">
                VITE_GEMINI_API_KEY
              </code>{' '}
              to your <code className="bg-white px-1 rounded text-[10px] border border-brand-border">.env</code> for real extraction.
            </p>
          </div>
        )}

        {/* Document list */}
        <AnimatePresence>
          {docs.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <p className="small-caps text-[8px] px-1 text-gray-400">
                Uploaded ({docs.length})
              </p>
              <AnimatePresence>
                {docs.map(doc => (
                  <DocCard key={doc.id} doc={doc} onRemove={removeDoc} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Health Summary */}
        <AnimatePresence>
          {hasAnalyzed && summary && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Summary header */}
              <div className="flex items-center gap-2 px-1">
                <div className="flex-1 h-px bg-brand-border" />
                <div className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-forest" />
                  <span className="small-caps text-[8px] text-forest">
                    AI Health Summary
                  </span>
                </div>
                <div className="flex-1 h-px bg-brand-border" />
              </div>

              <HealthSummaryView summary={summary} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {docs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-[#f5f7f2] rounded-full flex items-center justify-center text-forest/30 border border-brand-border mx-auto mb-4">
              <FileText size={28} />
            </div>
            <p className="serif text-lg text-slate mb-1">No documents yet</p>
            <p className="small-caps text-[8px] text-gray-300 max-w-[200px] mx-auto leading-relaxed">
              Upload MRI reports, prescriptions, blood tests — AI extracts the
              key information for your care team
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
