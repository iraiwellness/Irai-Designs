/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { User as UserType } from '../constants';

export default function Auth({ onLogin }: { onLogin: (user: UserType) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const mockUser: UserType = {
      id: Math.random().toString(36).substr(2, 9),
      email: email || 'user@example.com',
      name: name || (isLogin ? 'User' : 'New User'),
      onboarded: false
    };
    onLogin(mockUser);
    navigate('/pricing');
  };

  return (
    <div className="min-h-full flex flex-col p-8 bg-brand-50">
      <div className="mt-12 mb-12">
        <p className="small-caps mb-2">Step 00 / Authentication</p>
        <h2 className="serif text-4xl mb-2">
          {isLogin ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-xs text-gray-500 uppercase font-bold tracking-tight">
          {isLogin ? 'Login to continue your wellness journey' : 'Start your transformation today'}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {!isLogin && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-brand-border p-4 pl-12 rounded-xl focus:outline-none focus:border-forest text-sm placeholder:text-gray-300"
            />
          </div>
        )}
        
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-brand-border p-4 pl-12 rounded-xl focus:outline-none focus:border-forest text-sm placeholder:text-gray-300"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            type="text"
            placeholder="Password"
            className="w-full bg-white border border-brand-border p-4 pl-12 rounded-xl focus:outline-none focus:border-forest text-sm placeholder:text-gray-300"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-4 bg-forest text-white p-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-forest/90 transition-all shadow-lg shadow-forest/10"
        >
          {isLogin ? 'Login' : 'Sign Up'}
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-brand-600 font-medium hover:underline"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
      
      <div className="mt-auto pt-12">
        <div className="flex items-center gap-4 text-gray-400 text-sm">
          <div className="h-px flex-1 bg-gray-200" />
          <span>Or login with</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <div className="flex gap-4 mt-6">
          <button className="flex-1 bg-white border border-brand-200 p-3 rounded-xl flex justify-center items-center shadow-sm">
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          </button>
          <button className="flex-1 bg-white border border-brand-200 p-3 rounded-xl flex justify-center items-center shadow-sm">
            <img src="https://www.apple.com/favicon.ico" className="w-5 h-5" alt="Apple" />
          </button>
        </div>
      </div>
    </div>
  );
}
