/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  CheckCircle2,
  Upload,
  Loader2,
  XCircle,
  ShieldAlert,
  Stethoscope,
  Leaf,
  Sparkles,
  FileText,
} from "lucide-react";
import { analyzeDocument } from "../lib/gemini";
import { HealthDocument, HealthSummary } from "../constants";
import { cn } from "../lib/utils";

const STORAGE_KEY = "irai_health_docs";

const CONDITION_LABELS: Record<string, string> = {
  "back-pain": "Back Pain",
  anxiety: "Anxiety",
  diabetes: "Diabetes",
  general: "General Wellness",
};

function saveDocs(docs: HealthDocument[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

// ── Compact AI summary shown inline after upload ───────────────────────────

function OnboardingSummary({ summary }: { summary: HealthSummary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      {summary.contraindications.length > 0 && (
        <div className="bg-[#fdf3ec] border border-terracotta/30 rounded-2xl p-4 flex gap-3">
          <ShieldAlert size={16} className="text-terracotta shrink-0 mt-0.5" />
          <div>
            <p className="small-caps text-[9px] text-terracotta mb-1.5">
              Contraindications Flagged
            </p>
            <ul className="space-y-1">
              {summary.contraindications.slice(0, 3).map((c, i) => (
                <li
                  key={i}
                  className="text-[11px] text-slate/80 font-medium flex gap-1.5"
                >
                  <span className="text-terracotta shrink-0">·</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {summary.diagnoses.length > 0 && (
        <div className="bg-white rounded-2xl border border-brand-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope size={13} className="text-forest" />
            <p className="small-caps text-[9px]">Conditions Detected</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {summary.diagnoses.map((d) => (
              <span
                key={d}
                className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#f5f7f2] border border-brand-border text-slate"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {(summary.safePoses.length > 0 || summary.avoidPoses.length > 0) && (
        <div className="bg-white rounded-2xl border border-brand-border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Leaf size={13} className="text-forest" />
            <p className="small-caps text-[9px]">Your Yoga Guidance</p>
          </div>
          {summary.safePoses.length > 0 && (
            <div>
              <p className="small-caps text-[7px] text-gray-400 mb-1.5">
                Safe Poses
              </p>
              <div className="flex flex-wrap gap-1.5">
                {summary.safePoses.slice(0, 4).map((p) => (
                  <span
                    key={p}
                    className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-forest bg-[#f0f4ee] border border-forest/20"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
          {summary.avoidPoses.length > 0 && (
            <div>
              <p className="small-caps text-[7px] text-gray-400 mb-1.5">
                Avoid
              </p>
              <div className="flex flex-wrap gap-1.5">
                {summary.avoidPoses.slice(0, 4).map((p) => (
                  <span
                    key={p}
                    className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-red-500 bg-red-50 border border-red-100"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 justify-center py-2">
        <CheckCircle2 size={13} className="text-forest" />
        <p className="small-caps text-[8px] text-forest">
          Saved to Health Vault · View full report in Profile
        </p>
      </div>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [healthData, setHealthData] = useState({
    condition: "",
    painLevel: 5,
    goals: "",
  });
  const [docs, setDocs] = useState<HealthDocument[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const isProcessing = docs.some((d) => d.status === "processing");
  const analyzedSummary =
    docs.find((d) => d.status === "done")?.summary ?? null;
  const doneDocs = docs.filter((d) => d.status === "done").length;

  const handleComplete = () => {
    onComplete();
    navigate("/dashboard");
  };

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const accepted = Array.from(files).slice(0, 2 - docs.length);
    if (!accepted.length) return;

    const newDocs: HealthDocument[] = accepted.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      uploadedAt: new Date().toISOString(),
      status: "processing",
    }));

    const merged = [...docs, ...newDocs];
    setDocs(merged);
    saveDocs(merged);

    for (let i = 0; i < accepted.length; i++) {
      const file = accepted[i];
      const id = newDocs[i].id;
      try {
        const summary = await analyzeDocument(file);
        setDocs((prev) => {
          const updated = prev.map((d) =>
            d.id === id ? { ...d, status: "done" as const, summary } : d,
          );
          saveDocs(updated);
          return updated;
        });
      } catch {
        setDocs((prev) => {
          const updated = prev.map((d) =>
            d.id === id ? { ...d, status: "error" as const } : d,
          );
          saveDocs(updated);
          return updated;
        });
      }
    }
  }

  function removeDoc(id: string) {
    setDocs((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      saveDocs(updated);
      return updated;
    });
  }

  const checklistItems = [
    { label: "Health profile created", done: true },
    {
      label: healthData.condition
        ? "Condition program assigned - " +
          CONDITION_LABELS[healthData.condition]
        : "Condition program assigned",
      done: true,
    },
    { label: "Medical documents analysed", done: !!analyzedSummary },
    { label: "Pose guidance generated", done: !!analyzedSummary },
    { label: "Therapist briefing ready", done: !!analyzedSummary },
  ];

  return (
    <div className="min-h-full p-8 bg-brand-50 flex flex-col">
      {/* Progress + title */}
      <div className="mt-8 mb-8">
        <div className="flex gap-1 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full bg-brand-border overflow-hidden"
            >
              <div
                className={cn(
                  "h-full bg-forest transition-all duration-700",
                  step >= s ? "w-full" : "w-0",
                )}
              />
            </div>
          ))}
        </div>
        <p className="small-caps mb-2">Step 0{step} / Onboarding</p>
        <h2 className="serif text-3xl leading-none">
          {step === 1 && "Health Profile"}
          {step === 2 && "Medical Documents"}
          {step === 3 && "All set!"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Step 1 ── */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <label className="small-caps">Physical Conditions</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "back-pain", label: "Back Pain" },
                  { id: "anxiety", label: "Anxiety" },
                  { id: "diabetes", label: "Diabetes" },
                  { id: "general", label: "General" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() =>
                      setHealthData({ ...healthData, condition: opt.id })
                    }
                    className={cn(
                      "py-2 px-4 rounded-lg text-[10px] font-bold uppercase transition-all border",
                      healthData.condition === opt.id
                        ? "bg-forest border-forest text-white"
                        : "bg-white border-brand-border text-gray-400",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="small-caps">Pain Level</label>
                <span className="text-[10px] font-bold text-forest">
                  {healthData.painLevel} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={healthData.painLevel}
                onChange={(e) =>
                  setHealthData({
                    ...healthData,
                    painLevel: parseInt(e.target.value),
                  })
                }
                className="w-full accent-forest h-1.5 bg-brand-border rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <label className="small-caps">Describe your goal</label>
              <textarea
                placeholder="Improving flexibility..."
                value={healthData.goals}
                onChange={(e) =>
                  setHealthData({ ...healthData, goals: e.target.value })
                }
                className="w-full bg-white border border-brand-border p-4 rounded-xl focus:outline-none focus:border-forest text-sm min-h-[100px] placeholder:text-gray-300"
              />
            </div>
          </motion.div>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <p className="text-[12px] text-gray-500 leading-relaxed font-medium -mt-2">
              Upload prescriptions, MRI reports, or blood tests. Our AI reads
              them instantly and builds your personalised care profile.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {docs.length === 0 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-brand-border bg-white rounded-2xl p-8 flex flex-col items-center gap-3 text-center transition-all hover:border-forest/40 active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-[#f5f7f2] rounded-full flex items-center justify-center text-forest border border-brand-border">
                  <Upload size={22} />
                </div>
                <div>
                  <p className="font-bold text-slate text-[12px] uppercase tracking-tight">
                    Tap to upload reports
                  </p>
                  <p className="small-caps text-[8px] text-gray-300 mt-1">
                    PDF, JPG, PNG · Analysed instantly by AI
                  </p>
                </div>
              </button>
            )}

            {docs.length > 0 && docs.length < 2 && !isProcessing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-brand-border text-forest small-caps text-[9px] transition-all hover:border-forest/40"
              >
                <Upload size={13} />
                Add another document
              </button>
            )}

            <AnimatePresence>
              {docs.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="bg-white rounded-xl border border-brand-border flex items-center gap-3 px-4 py-3"
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border",
                      doc.status === "processing"
                        ? "bg-[#f5f7f2] border-brand-border text-forest"
                        : doc.status === "done"
                          ? "bg-[#f0f4ee] border-forest/20 text-forest"
                          : "bg-red-50 border-red-100 text-red-400",
                    )}
                  >
                    {doc.status === "processing" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : doc.status === "done" ? (
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
                      {doc.status === "processing"
                        ? "Analysing with AI..."
                        : doc.status === "done"
                          ? "Analysis complete - " +
                            (doc.size / 1024).toFixed(0) +
                            " KB"
                          : "Analysis failed - try again"}
                    </p>
                  </div>
                  {doc.status !== "processing" && (
                    <button
                      onClick={() => removeDoc(doc.id)}
                      className="text-gray-200 hover:text-red-300 transition-colors shrink-0"
                    >
                      <XCircle size={16} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 justify-center py-1"
              >
                <Sparkles size={12} className="text-forest animate-pulse" />
                <p className="small-caps text-[8px] text-forest">
                  AI is reading your document...
                </p>
              </motion.div>
            )}

            <AnimatePresence>
              {analyzedSummary && !isProcessing && (
                <OnboardingSummary summary={analyzedSummary} />
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center pt-2 pb-4 space-y-5"
          >
            {/* Check icon with single pulse */}
            <div className="relative flex items-center justify-center mt-4 mb-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0.4 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeOut" }}
                className="absolute w-16 h-16 bg-forest/30 rounded-full"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                className="w-16 h-16 bg-forest text-white rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-forest/20"
              >
                <CheckCircle2 size={32} />
              </motion.div>
            </div>

            {/* Heading */}
            <div>
              <p className="small-caps text-[9px] text-gray-400 mb-1">
                All set!
              </p>
              <h3 className="serif text-3xl leading-none mb-2">
                Welcome to IRAI
              </h3>
              <p className="text-[12px] text-gray-400 leading-relaxed max-w-[260px] mx-auto">
                {analyzedSummary
                  ? "Your care profile is live. Your therapist has been briefed and will personalise your first session."
                  : "Your wellness profile is ready. Your personalised dashboard is live."}
              </p>
            </div>

            {/* Stat tiles */}
            {(healthData.condition || analyzedSummary) && (
              <div
                className={cn(
                  "w-full grid gap-2",
                  analyzedSummary ? "grid-cols-3" : "grid-cols-2",
                )}
              >
                <div className="bg-white border border-brand-border rounded-2xl p-3 flex flex-col items-center gap-1.5">
                  <div className="w-7 h-7 bg-[#f5f7f2] rounded-lg flex items-center justify-center text-forest border border-brand-border">
                    <Stethoscope size={13} />
                  </div>
                  <p className="text-[10px] font-bold text-slate uppercase tracking-tight leading-none text-center">
                    {healthData.condition
                      ? CONDITION_LABELS[healthData.condition]
                      : "General"}
                  </p>
                  <p className="small-caps text-[7px] text-gray-400">
                    Condition
                  </p>
                </div>

                {analyzedSummary ? (
                  <>
                    <div className="bg-white border border-brand-border rounded-2xl p-3 flex flex-col items-center gap-1.5">
                      <div className="w-7 h-7 bg-[#f5f7f2] rounded-lg flex items-center justify-center text-forest border border-brand-border">
                        <FileText size={13} />
                      </div>
                      <p className="text-[10px] font-bold text-slate uppercase tracking-tight leading-none">
                        {doneDocs}
                      </p>
                      <p className="small-caps text-[7px] text-gray-400">
                        {doneDocs === 1 ? "Doc Read" : "Docs Read"}
                      </p>
                    </div>
                    <div className="bg-white border border-brand-border rounded-2xl p-3 flex flex-col items-center gap-1.5">
                      <div className="w-7 h-7 bg-[#f5f7f2] rounded-lg flex items-center justify-center text-forest border border-brand-border">
                        <Leaf size={13} />
                      </div>
                      <p className="text-[10px] font-bold text-slate uppercase tracking-tight leading-none">
                        {analyzedSummary.safePoses.length}
                      </p>
                      <p className="small-caps text-[7px] text-gray-400">
                        Safe Poses
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-white border border-brand-border rounded-2xl p-3 flex flex-col items-center gap-1.5">
                    <div className="w-7 h-7 bg-[#f5f7f2] rounded-lg flex items-center justify-center text-forest border border-brand-border">
                      <Sparkles size={13} />
                    </div>
                    <p className="text-[10px] font-bold text-slate uppercase tracking-tight leading-none">
                      Live
                    </p>
                    <p className="small-caps text-[7px] text-gray-400">
                      AI Ready
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Contraindication note */}
            {analyzedSummary &&
              analyzedSummary.contraindications.length > 0 && (
                <div className="w-full flex items-center gap-2.5 bg-[#fdf3ec] border border-terracotta/25 rounded-xl px-4 py-3">
                  <ShieldAlert size={14} className="text-terracotta shrink-0" />
                  <p className="small-caps text-[8px] text-terracotta leading-relaxed">
                    {analyzedSummary.contraindications.length} contraindications
                    flagged - your therapist has been briefed
                  </p>
                </div>
              )}
          </motion.div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-8 flex gap-3 pb-8">
        {step < 3 ? (
          <>
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 2 && isProcessing}
              className="flex-[3] bg-forest text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-forest/20 disabled:opacity-40 disabled:shadow-none transition-all text-sm"
            >
              {step === 2 && isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Analysing...
                </>
              ) : (
                <>
                  Continue <ChevronRight size={18} />
                </>
              )}
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 bg-white border border-forest text-forest py-4 rounded-xl font-bold flex justify-center items-center text-sm"
            >
              Skip
            </button>
          </>
        ) : (
          <button
            onClick={handleComplete}
            className="w-full bg-forest text-white py-4 rounded-xl font-bold flex justify-center items-center shadow-lg shadow-forest/20 text-sm"
          >
            Start Practice
          </button>
        )}
      </div>
    </div>
  );
}
