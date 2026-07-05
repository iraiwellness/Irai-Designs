import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth, type Role } from '../context/AuthContext';
import { cn } from '../lib/utils';

const CONFIG = {
  admin: {
    label:       'Admin Access',
    placeholder: 'admin@irai.com',
    gradient:    'from-[#1b2e18] to-[#263d23]',
    buttonBg:    'bg-forest',
  },
  practitioner: {
    label:       'Practitioner Access',
    placeholder: 'dr.sarah@irai.com',
    gradient:    'from-[#2d1f10] to-[#3d2b18]',
    buttonBg:    'bg-[#c4713a]',
  },
} as const;

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const role = (params.get('role') ?? 'admin') as Role;
  const { isAuthenticated, user, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const cfg = CONFIG[role] ?? CONFIG.admin;

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin' : '/practitioner', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(role, email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate(role === 'admin' ? '/admin' : '/practitioner', { replace: true });
      }, 700);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className={cn('w-[45%] shrink-0 bg-gradient-to-br relative overflow-hidden flex flex-col', cfg.gradient)}>
        <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-white/[0.04]" />
        <div className="absolute bottom-0 left-10 w-32 h-32 rounded-full bg-white/[0.03] blur-2xl" />

        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white/80 text-[13px] transition-colors z-10"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex-1 flex flex-col items-center justify-center px-12 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[22px] bg-white/[0.08] border border-white/10 mb-5">
            <span className="font-serif text-2xl text-white/90 font-semibold">ir</span>
          </div>
          <p className="font-serif text-[36px] text-white leading-none mb-2">IRAI</p>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-semibold mb-6">
            Wellness Platform
          </p>
          <h2 className="font-serif text-[28px] text-white text-center leading-tight">{cfg.label}</h2>
          <p className="text-[12px] text-white/35 mt-2 font-medium">Sign in to continue</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-cream px-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-white border border-brand-border rounded-full text-[10px] uppercase tracking-[0.15em] text-gray-500 font-bold mb-4">
              {role === 'admin' ? 'Admin' : 'Practitioner'}
            </span>
            <h2 className="serif text-3xl text-slate">Welcome back</h2>
            <p className="text-[13px] text-gray-400 mt-1">Enter your credentials to sign in.</p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 gap-4"
              >
                <div className="w-16 h-16 bg-[#f0f4ee] rounded-full flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-forest" />
                </div>
                <div className="text-center">
                  <p className="font-serif text-2xl text-slate">Welcome back</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-semibold">
                    Redirecting…
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1.5">
                    Email address
                  </p>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={cfg.placeholder}
                    className="w-full bg-brand-50 border border-brand-border rounded-xl py-3.5 px-4 text-[13px] text-slate placeholder:text-gray-300 outline-none focus:border-forest/40 transition-colors"
                  />
                </div>

                <div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1.5">
                    Password
                  </p>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-brand-50 border border-brand-border rounded-xl py-3.5 px-4 pr-11 text-[13px] text-slate placeholder:text-gray-300 outline-none focus:border-forest/40 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300"
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-[11px] text-terracotta font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    'w-full py-4 rounded-xl text-white font-bold text-[13px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2',
                    cfg.buttonBg,
                  )}
                >
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Signing in…</>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <p className="text-center text-[9px] text-gray-300 font-medium pt-1">
                  Prototype mode — any credentials accepted
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
