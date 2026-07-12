import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { MOCK_SIGNUP_RESPONSE } from '../mockData';
import { cn } from '../lib/utils';

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const role = params.get('role') ?? 'practitioner';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 8) {
      setError(password.length < 8 ? 'Password must be at least 8 characters.' : 'Please fill required fields.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-[45%] shrink-0 bg-gradient-to-br from-[#2d1f10] to-[#3d2b18] relative overflow-hidden flex flex-col">
        <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-white/[0.04]" />
        <button type="button" onClick={() => navigate('/login?role=practitioner')}
          className="absolute top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white/80 text-[13px] transition-colors z-10">
          <ArrowLeft size={16} /> Back to sign in
        </button>
        <div className="flex-1 flex flex-col items-center justify-center px-12 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[22px] bg-white/[0.08] border border-white/10 mb-5">
            <span className="font-serif text-2xl text-white/90 font-semibold">ir</span>
          </div>
          <h2 className="font-serif text-[28px] text-white leading-tight">Join as Practitioner</h2>
          <p className="text-[12px] text-white/35 mt-2 font-medium max-w-xs">
            Create your practitioner account. Your profile will be pending until verified.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-cream px-12 overflow-y-auto py-10">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-[420px]">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-white border border-brand-border rounded-full text-[10px] uppercase tracking-[0.15em] text-gray-500 font-bold mb-4">
              {role}
            </span>
            <h2 className="serif text-3xl text-slate">Create account</h2>
            <p className="text-[13px] text-gray-400 mt-1">Sign up to start your practitioner workspace.</p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="flex flex-col items-center py-8 gap-3">
                  <div className="w-16 h-16 bg-[#fdf8ee] rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-amber-600" />
                  </div>
                  <p className="font-serif text-2xl text-slate">Account created</p>
                  <p className="text-[13px] text-gray-500 text-center">201 Created · JWT tokens issued</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                  <Clock size={18} className="text-amber-600 shrink-0" />
                  <div>
                    <p className="text-[13px] font-bold text-amber-800">Verification pending</p>
                    <p className="text-[12px] text-amber-700 mt-1 leading-relaxed">
                      Your practitioner_profile status is <strong>pending</strong>. You won&apos;t appear on public listings until an admin verifies you.
                    </p>
                  </div>
                </div>
                <pre className="bg-brand-50 border border-brand-border rounded-xl p-3 text-[10px] font-mono text-slate overflow-auto max-h-40">
                  {JSON.stringify(MOCK_SIGNUP_RESPONSE, null, 2)}
                </pre>
                <button type="button" onClick={() => navigate('/login?role=practitioner')}
                  className="w-full py-4 rounded-xl bg-[#c4713a] text-white font-bold text-[13px]">
                  Continue to Sign In
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name" value={firstName} onChange={setFirstName} />
                  <Field label="Last name" value={lastName} onChange={setLastName} />
                </div>
                <Field label="Email" value={email} onChange={setEmail} type="email" required />
                <div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1.5">Password (min 8)</p>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-brand-50 border border-brand-border rounded-xl py-3.5 px-4 pr-11 text-[13px] outline-none focus:border-forest/40" />
                    <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <input type="hidden" name="role" value={role} />
                {error && <p className="text-[11px] text-terracotta font-medium">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#c4713a] text-white font-bold text-[13px] flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Creating…</> : 'Create Practitioner Account'}
                </button>
                <p className="text-center text-[12px] text-gray-400">
                  Already have an account?{' '}
                  <button type="button" onClick={() => navigate('/login?role=practitioner')} className="text-forest font-bold hover:underline">
                    Sign in
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <p className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1.5">{label}</p>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        className="w-full bg-brand-50 border border-brand-border rounded-xl py-3.5 px-4 text-[13px] outline-none focus:border-forest/40" />
    </div>
  );
}
