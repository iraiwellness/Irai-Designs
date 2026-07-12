import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth, userHomePath } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import { useEffect } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) navigate(userHomePath(user), { replace: true });
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-[48%] bg-gradient-to-br from-[#263d23] to-[#192b16] relative overflow-hidden flex-col justify-center px-16">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/[0.04] rounded-full" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/[0.03] rounded-full blur-2xl" />
        <div className="relative z-10 max-w-md flex flex-col items-center lg:items-start text-center lg:text-left">
          <BrandLogo size="md" className="mb-8 lg:!mx-0" />
          <p className="small-caps text-white/40 mb-4">Holistic Wellness</p>
          <h1 className="serif text-5xl text-white leading-tight mb-6">
            Yoga, therapy &amp; care — personalised for you
          </h1>
          <p className="text-[15px] text-white/50 leading-relaxed">
            Book 1-on-1 sessions, join group classes, track wellness insights, and manage your health documents in one place.
          </p>
          <div className="flex items-center gap-2 mt-8 text-[13px] text-white/40">
            <Sparkles size={16} className="text-amber-400" />
            AI-powered recommendations from your health profile
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full flex flex-col items-center lg:items-start text-center lg:text-left">
          <BrandLogo size="lg" variant="on-light" className="mb-6 lg:!mx-0" />
          <h2 className="serif text-4xl text-slate mb-3">Welcome to IRAI</h2>
          <p className="text-[14px] text-gray-400 mb-8 leading-relaxed">
            Your member portal for booking sessions, tracking progress, and managing your wellness journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={() => navigate('/signup')}
              className="flex-1 py-3.5 rounded-2xl bg-forest text-white font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#3d5636] transition-colors">
              Get Started <ArrowRight size={16} />
            </button>
            <button type="button" onClick={() => navigate('/login')}
              className="flex-1 py-3.5 rounded-2xl border border-brand-border text-slate font-bold text-[14px] hover:bg-brand-50 transition-colors">
              Sign In
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
