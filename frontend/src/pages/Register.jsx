import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Brain, User, Mail, Lock, Shield, Loader2, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [adminSecret, setAdminSecret] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Please fill in all required fields');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }
    if (role === 'admin' && !adminSecret) {
      return toast.error('Admin Secret Key is required for Admin registration');
    }

    setIsSubmitting(true);
    const res = await register(name, email, password, role, adminSecret);
    setIsSubmitting(false);

    if (res.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(res.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-darkBg-900 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background Glow */}
      <div className="glow-orb bg-indigo-600 w-[500px] h-[500px] -top-20 -left-20"></div>
      <div className="glow-orb bg-purple-600 w-[500px] h-[500px] -bottom-20 -right-20"></div>

      <div className="w-full max-w-md z-10 my-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex items-center space-x-2.5 mb-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <Brain size={24} />
            </div>
            <span className="font-extrabold text-xl text-slate-100 tracking-wide">RankerAI</span>
          </Link>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Create your Recruiter Account</p>
        </div>

        {/* Glass Card Form */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800/60 shadow-glass">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>

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
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    role === 'user'
                      ? 'bg-primary-900/40 border-primary-500 text-slate-200'
                      : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    role === 'admin'
                      ? 'bg-primary-900/40 border-primary-500 text-slate-200'
                      : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  System Admin
                </button>
              </div>
            </div>

            {role === 'admin' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Admin Secret Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Shield size={16} />
                  </div>
                  <input
                    type="password"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    placeholder="Enter admin verification key"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-amber-400 font-mono"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                  Refer to the `ADMIN_SECRET_KEY` in backend .env to register as Admin.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-violet hover:from-primary-600 hover:to-accent-violet text-white font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-200 text-sm flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Form Switch */}
          <div className="mt-6 text-center border-t border-slate-800/40 pt-5">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
