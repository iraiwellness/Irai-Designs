/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { PLANS } from '../constants';
import { cn } from '../lib/utils';

export default function Pricing({ onSelectPlan }: { onSelectPlan: (id: string) => void }) {
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    onSelectPlan(id);
    navigate('/onboarding');
  };

  return (
    <div className="min-h-full p-6 pb-12 bg-brand-50 overflow-y-auto">
      <div className="mt-8 mb-10 text-center">
        <h2 className="serif text-3xl mb-2">Select your path</h2>
        <p className="small-caps">Step 01 / Registration</p>
      </div>

      <div className="flex flex-col gap-6">
        {PLANS.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "p-6 rounded-2xl bg-white border border-brand-border shadow-sm transition-all relative overflow-hidden",
              plan.id === 'transform' ? "ring-1 ring-forest bg-forest/[0.03]" : ""
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate uppercase tracking-tight">{plan.name}</h3>
                <div className="mt-1 flex items-baseline">
                  <span className="text-xl font-bold text-forest">₹{plan.price.toLocaleString()}</span>
                  <span className="text-gray-400 text-[10px] uppercase font-bold ml-1">/ Month</span>
                </div>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex gap-3 text-[12px] text-gray-500 leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0 mt-1.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelect(plan.id)}
              className={cn(
                "w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all text-sm",
                plan.id === 'transform' 
                  ? "bg-forest text-white shadow-lg shadow-forest/20" 
                  : "bg-white border border-forest text-forest hover:bg-forest/5"
              )}
            >
              Secure Checkout
              <ArrowRight size={16} />
            </button>
          </motion.div>
        ))}
      </div>
      
      <p className="mt-8 text-center text-xs text-gray-400 max-w-xs mx-auto">
        Plans include GST. No hidden charges. Subscription can be upgraded or cancelled at any time.
      </p>
    </div>
  );
}
