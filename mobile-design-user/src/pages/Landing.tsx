/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 text-center bg-white text-slate overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className="w-24 h-24 mb-10 mx-auto relative bg-cream rounded-full border border-forest/10 p-4 flex items-center justify-center shadow-lg">
           <img 
             src="/irai_logo.png" 
             className="w-full h-full object-contain" 
             alt="IRAI Logo" 
             onError={(e) => {
               // Fallback if the file isn't at the root
               (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200&auto=format&fit=crop";
             }}
           />
           <div className="absolute -top-1 -right-1 bg-forest p-1.5 rounded-full shadow-md">
             <Sparkles size={12} className="text-white" />
           </div>
        </div>
        
        <h1 className="serif text-8xl mb-4 tracking-tighter leading-none text-forest">
          IRAI
        </h1>
        <p className="small-caps mb-12 max-w-xs mx-auto text-gray-400">
          Intelligent • Restorative • Integrated
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/auth')}
          className="bg-forest text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-3 mx-auto shadow-2xl shadow-forest/20 transition-all hover:scale-[1.02]"
        >
          Begin Journey
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>

      {/* Subtle Geometric Overlays */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute -top-20 -left-20 w-96 h-96 border border-forest rounded-full" />
        <div className="absolute bottom-20 right-20 w-80 h-80 border-2 border-forest rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-forest rounded-full opacity-50" />
      </div>
      
      <div className="mt-20">
        <p className="small-caps text-[8px] animate-pulse">Connection Secured</p>
      </div>
    </div>
  );
}
