import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Brain, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } else {
      toast.error(res.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-darkBg-900 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background Glow */}
      <div className="glow-orb bg-indigo-600 w-[500px] h-[500px] -top-20 -left-20"></div>
      <div className="glow-orb bg-purple-600 w-[500px] h-[500px] -bottom-20 -right-20"></div>

      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center space-x-2.5 mb-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <Brain size={24} />
            </div>
            <span className="font-extrabold text-xl text-slate-100 tracking-wide">RankerAI</span>
          </Link>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Sign in to your Recruiter Dashboard</p>
        </div>

        {/* Glass Card Form */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800/60 shadow-glass">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-violet hover:from-primary-600 hover:to-accent-violet text-white font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-200 text-sm flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Form Switch */}
          <div className="mt-8 text-center border-t border-slate-800/40 pt-6">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
