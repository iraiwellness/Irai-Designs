import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GuestRoute } from '../components/ProtectedRoute';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signup(email, password, name);
    setLoading(false);
    navigate('/pricing');
  };

  return (
    <GuestRoute>
      <div className="min-h-screen flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <button type="button" onClick={() => navigate('/')} className="flex items-center gap-2 text-[13px] text-gray-400 hover:text-slate mb-8">
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="serif text-3xl text-slate mb-1">Create Account</h2>
          <p className="text-[13px] text-gray-400 mb-8">Create your member account to get started.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="small-caps text-[8px] text-gray-400 mb-1 block">Full name</label>
              <input value={name} onChange={e => setName(e.target.value)} required
                className="w-full bg-white border border-brand-border rounded-xl py-3 px-4 text-[14px] outline-none focus:border-forest/30" />
            </div>
            <div>
              <label className="small-caps text-[8px] text-gray-400 mb-1 block">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
                className="w-full bg-white border border-brand-border rounded-xl py-3 px-4 text-[14px] outline-none focus:border-forest/30" />
            </div>
            <div>
              <label className="small-caps text-[8px] text-gray-400 mb-1 block">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" required
                className="w-full bg-white border border-brand-border rounded-xl py-3 px-4 text-[14px] outline-none focus:border-forest/30" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-forest text-white font-bold text-[14px] flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create Account'}
            </button>
          </form>
          <p className="text-[13px] text-gray-400 mt-6 text-center">
            Already have an account? <Link to="/login" className="text-forest font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </GuestRoute>
  );
}
