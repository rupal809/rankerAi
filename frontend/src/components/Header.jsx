import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Calendar } from 'lucide-react';

export const Header = ({ title }) => {
  const { user } = useAuth();
  
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="p-6 border-b border-slate-800/40 flex items-center justify-between sticky top-0 bg-darkBg-900/80 backdrop-blur-md z-20">
      <div>
        <h1 className="text-xl font-bold font-sans text-slate-100 flex items-center space-x-2">
          <span>{title}</span>
          <Sparkles size={16} className="text-primary-500 animate-pulse" />
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Welcome back, {user?.name}! Let's optimize your career path today.
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Date display */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800/60 text-xs font-semibold text-slate-300">
          <Calendar size={14} className="text-primary-500" />
          <span>{today}</span>
        </div>
      </div>
    </header>
  );
};
