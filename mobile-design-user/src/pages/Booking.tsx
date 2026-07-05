/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Users, 
  Stethoscope, 
  Apple, 
  Brain, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

const THERAPISTS = [
  { id: '1', name: 'Dr. Sarah Smith', role: 'Yoga Therapist', rating: 4.9, bio: 'Specializes in chronic pain and spinal health.' },
  { id: '2', name: 'Dr. Michael Chen', role: 'Physiotherapist', rating: 4.8, bio: 'Advanced sports recovery and clinical mobility.' },
];

const SLOTS = ['08:00 AM', '09:30 AM', '11:00 AM', '02:00 PM', '04:30 PM', '06:00 PM'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function Booking() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'yoga';
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleBooking = () => {
    setStep(3);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2500);
  };

  return (
    <div className="min-h-full bg-brand-50 pb-24">
      {/* Custom App Bar */}
      <div className="bg-white px-6 py-8 border-b border-brand-border flex items-center gap-6 sticky top-0 z-20">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard')} className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-forest transition-colors hover:bg-[#f5f7f2]">
          <ChevronLeft size={18} />
        </button>
        <div>
          <p className="small-caps text-gray-400 mb-0.5">Scheduling</p>
          <h2 className="serif text-xl leading-none capitalize">Book {type}</h2>
        </div>
      </div>

      <div className="p-6">
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="px-2">
              <h3 className="serif text-2xl leading-none mb-1">Select Provider</h3>
              <p className="small-caps text-[8px]">Certified health professionals</p>
            </div>
            <div className="space-y-5">
              {THERAPISTS.map((t) => (
                <div 
                  key={t.id}
                  onClick={() => { setSelectedTherapist(t.id); setStep(2); }}
                  className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm active:scale-[0.98] transition-all hover:border-forest/20"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#f5f7f2] border border-brand-border rounded-xl flex items-center justify-center text-forest">
                      <Users size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate text-sm uppercase tracking-tight">{t.name}</h4>
                      <p className="small-caps text-[8px] text-gray-400 mt-0.5">{t.role}</p>
                    </div>
                    <div className="text-[10px] font-bold text-forest">
                      ★ {t.rating}
                    </div>
                  </div>
                  <p className="text-[12px] text-gray-500 leading-snug italic font-medium">"{t.bio}"</p>
                </div>
              ))}
            </div>
            
            <div className="bg-[#f5f7f2] p-4 rounded-xl border border-brand-border flex gap-3 text-slate text-[10px] leading-relaxed font-medium">
              <Info size={14} className="shrink-0 text-forest" />
              <p>Session rules: 45-min slots with 15-min therapeutic buffers.</p>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 mt-4">
            <section className="px-2">
              <h3 className="small-caps mb-4">Select Days</h3>
              <div className="flex justify-between gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    onClick={() => {
                      if (selectedDays.includes(day)) setSelectedDays(selectedDays.filter(d => d !== day));
                      else if (selectedDays.length < 3) setSelectedDays([...selectedDays, day]);
                    }}
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase transition-all",
                      selectedDays.includes(day) 
                        ? "bg-slate text-white shadow-lg shadow-slate/20" 
                        : "bg-white text-gray-400 border border-brand-border"
                    )}
                  >
                    {day[0]}
                  </button>
                ))}
              </div>
              <p className="small-caps text-[7px] text-center mt-3">Select 3 days for consistency</p>
            </section>

            <section className="px-2">
              <h3 className="small-caps mb-4">Select Time</h3>
              <div className="grid grid-cols-2 gap-3">
                {SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-[10px] uppercase transition-all border",
                      selectedSlot === slot 
                        ? "bg-forest border-forest text-white shadow-lg shadow-forest/10" 
                        : "bg-white border-brand-border text-gray-500"
                    )}
                  >
                    <Clock size={14} />
                    {slot}
                  </button>
                ))}
              </div>
            </section>

            <button
              disabled={!selectedSlot || selectedDays.length < 3}
              onClick={handleBooking}
              className="w-full bg-forest text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-xl shadow-forest/20 disabled:opacity-30 disabled:shadow-none transition-all text-sm mb-4"
            >
              Confirm Enrollment
              <CheckCircle2 size={18} />
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-forest text-white rounded-full flex items-center justify-center mb-8 shadow-2xl relative">
               <CheckCircle2 size={40} className="relative z-10" />
               <motion.div 
                 initial={{ scale: 1, opacity: 0.5 }}
                 animate={{ scale: 1.8, opacity: 0 }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 bg-forest rounded-full"
               />
            </div>
            <h3 className="serif text-3xl mb-2">Booking Locked</h3>
            <p className="text-gray-400 text-xs max-w-xs mx-auto mb-8 leading-relaxed">
              Your recurring practice with {THERAPISTS[0].name} is active.
            </p>
            <div className="small-caps text-[8px] bg-[#f5f7f2] border border-brand-border px-4 py-2 rounded-full inline-block">
               Identity Verified • End-to-End Encrypted
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
