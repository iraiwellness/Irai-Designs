/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import {
  User as UserIcon,
  CreditCard,
  Shield,
  Settings,
  LogOut,
  FileText,
  ChevronRight,
  Sparkles,
  CalendarDays,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User, PLANS } from '../constants';
import { cn } from '../lib/utils';

export default function Profile({ user, onLogout }: { user: User | null, onLogout: () => void }) {
  if (!user) return null;
  const navigate = useNavigate();
  const plan = PLANS.find(p => p.id === user.planId);

  return (
    <div className="p-6 pb-24 bg-brand-50 min-h-full">
      {/* Profile Header */}
      <div className="mt-12 mb-10 flex flex-col items-center">
        <div className="relative">
          <div className="w-20 h-20 bg-white rounded-full border border-brand-border shadow-sm flex items-center justify-center overflow-hidden">
             <UserIcon size={32} className="text-slate/30" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-forest p-1 rounded-full border border-white text-white">
            <Sparkles size={10} />
          </div>
        </div>
        <h2 className="mt-4 serif text-2xl lowercase">{user.name}</h2>
        <p className="small-caps text-[8px] text-gray-400 mt-1">{user.email}</p>
        
        <div 
          className="mt-6 px-4 py-2 rounded-full border border-brand-border bg-white shadow-sm flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-forest" />
          <span className="small-caps text-[8px] text-forest">{plan?.name} Practice</span>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="space-y-6">
        {/* Session Calendar */}
        <button
          onClick={() => navigate('/sessions')}
          className="w-full bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden flex items-center justify-between px-6 py-5 transition-all hover:border-forest/30 active:scale-[0.98] group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f0f4ee] border border-forest/20 flex items-center justify-center text-forest transition-colors group-hover:bg-forest group-hover:text-white">
              <CalendarDays size={18} />
            </div>
            <div className="text-left">
              <span className="block small-caps text-[10px] text-slate">My Sessions</span>
              <span className="block small-caps text-[8px] text-gray-400 mt-0.5">Calendar & booking history</span>
            </div>
          </div>
          <ChevronRight size={14} className="text-gray-300 group-hover:text-forest transition-colors" />
        </button>

        <section className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
          <MenuButton icon={CreditCard} label="Enrollment & Billing" />
          <MenuButton icon={FileText} label="Health Vault" onClick={() => navigate('/health-vault')} />
          <MenuButton icon={Shield} label="Privacy" last />
        </section>

        <section className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden p-6">
           <h3 className="small-caps text-[8px] mb-4 px-2">Account Management</h3>
           <MenuButton icon={Settings} label="Global Preferences" className="px-2" />
           <button 
             onClick={onLogout}
             className="w-full mt-4 flex items-center justify-center gap-4 py-3 rounded-xl border border-red-100 text-red-400 small-caps text-[10px] transition-all hover:bg-red-50/30"
           >
             <LogOut size={16} />
             <span>Terminate Session</span>
           </button>
        </section>

        <p className="text-center small-caps text-[7px] text-gray-300 mt-8">
          IRAI Architectural Version 1.0.4
        </p>
      </div>
    </div>
  );
}

function MenuButton({ icon: Icon, label, last, className, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-6 py-5 transition-colors group",
        !last && "border-b border-brand-border",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-[#f5f7f2] border border-brand-border flex items-center justify-center text-forest transition-colors group-hover:bg-forest group-hover:text-white">
          <Icon size={16} />
        </div>
        <span className="small-caps text-[9px] text-slate">{label}</span>
      </div>
      <ChevronRight size={14} className="text-gray-300" />
    </button>
  );
}
