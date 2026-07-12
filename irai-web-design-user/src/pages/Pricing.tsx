import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PLANS } from '../userData';
import type { PlanId } from '../types';
import { cn } from '../lib/utils';

export default function Pricing() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const selectPlan = (planId: PlanId) => {
    updateUser({ planId, onboardingStep: 1 });
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        <p className="small-caps text-gray-400 mb-2">Choose your plan</p>
        <h1 className="serif text-4xl text-slate mb-2">Membership</h1>
        <p className="text-[14px] text-gray-400 mb-10">Select a tier to unlock sessions and AI personalization.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div key={plan.id} className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 flex flex-col">
              <div className="w-10 h-10 rounded-xl mb-4" style={{ backgroundColor: `${plan.color}22` }} />
              <h2 className="serif text-2xl text-slate">{plan.name}</h2>
              <p className="text-2xl font-bold text-slate mt-2">₹{plan.price.toLocaleString('en-IN')}<span className="text-[13px] font-normal text-gray-400">/mo</span></p>
              <ul className="mt-6 space-y-2 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-gray-500">
                    <Check size={14} className="text-forest shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => selectPlan(plan.id as PlanId)}
                className={cn('mt-6 py-3 rounded-xl font-bold text-[13px] transition-colors',
                  plan.id === 'balanced' ? 'bg-forest text-white hover:bg-[#3d5636]' : 'border border-brand-border hover:bg-brand-50')}>
                Select {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
