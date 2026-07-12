import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GuestRoute } from '../components/ProtectedRoute';
import BrandLogo from '../components/BrandLogo';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('priya@example.com');
  const [password, setPassword] = useState('password');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  return (
    <GuestRoute>
      <LoginForm
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        showPass={showPass} setShowPass={setShowPass}
        loading={loading} setLoading={setLoading}
        success={success} setSuccess={setSuccess}
        error={error} setError={setError}
        login={login} navigate={navigate}
      />
    </GuestRoute>
  );
}

function LoginForm({ email, setEmail, password, setPassword, showPass, setShowPass, loading, setLoading, success, setSuccess, error, setError, login, navigate }: {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPass: boolean; setShowPass: (v: boolean) => void;
  loading: boolean; setLoading: (v: boolean) => void;
  success: boolean; setSuccess: (v: boolean) => void;
  error: string; setError: (v: string) => void;
  login: ReturnType<typeof useAuth>['login'];
  navigate: ReturnType<typeof useNavigate>;
}) {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Please fill in both fields.'); return; }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setSuccess(true);
      setTimeout(() => navigate('/pricing'), 600);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-[42%] bg-gradient-to-br from-[#1a2f4a] to-[#4B7399] relative overflow-hidden items-center justify-center px-12">
        <div className="relative z-10 text-white max-w-sm flex flex-col items-center text-center">
          <BrandLogo size="md" className="mb-6" />
          <p className="small-caps text-white/40 mb-3">Member Access</p>
          <h1 className="serif text-4xl leading-tight mb-4">Sign in to your wellness portal</h1>
          <p className="text-[14px] text-white/50">Access sessions, insights, and your health vault.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <button type="button" onClick={() => navigate('/')} className="flex items-center gap-2 text-[13px] text-gray-400 hover:text-slate mb-8">
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="serif text-3xl text-slate mb-1">Sign In</h2>
          <p className="text-[13px] text-gray-400 mb-8">Patient account · prototype accepts any credentials</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="small-caps text-[8px] text-gray-400 mb-1 block">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                className="w-full bg-white border border-brand-border rounded-xl py-3 px-4 text-[14px] outline-none focus:border-forest/30" />
            </div>
            <div>
              <label className="small-caps text-[8px] text-gray-400 mb-1 block">Password</label>
              <div className="relative">
                <input value={password} onChange={e => setPassword(e.target.value)} type={showPass ? 'text' : 'password'}
                  className="w-full bg-white border border-brand-border rounded-xl py-3 px-4 pr-11 text-[14px] outline-none focus:border-forest/30" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-[13px] text-terracotta">{error}</p>}
            {success && (
              <p className="text-[13px] text-forest flex items-center gap-2"><CheckCircle2 size={16} /> Signed in</p>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#4B7399] text-white font-bold text-[14px] flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Sign In'}
            </button>
          </form>
          <p className="text-[13px] text-gray-400 mt-6 text-center">
            New here? <Link to="/signup" className="text-forest font-semibold hover:underline">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
