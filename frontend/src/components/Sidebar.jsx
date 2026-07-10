import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Award, 
  Compass, 
  User, 
  ShieldAlert, 
  LogOut,
  Brain,
  Users
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/recruiter', label: 'Resume Screener', icon: Users },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/resume-analyzer', label: 'Resume Analyzer', icon: FileText },
    { to: '/jd-matcher', label: 'JD Matcher', icon: Briefcase },
    { to: '/career-coach', label: 'Career Roadmap', icon: Compass },
    { to: '/mock-interview', label: 'Mock Interview', icon: Award },
    { to: '/profile', label: 'My Profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ to: '/admin', label: 'Admin Dashboard', icon: ShieldAlert });
  }

  return (
    <aside className="w-64 bg-darkBg-800 border-r border-slate-800/80 min-h-screen flex flex-col justify-between sticky top-0 z-30">
      <div>
        {/* Brand logo */}
        <div className="p-6 border-b border-slate-800/50 flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet text-white shadow-lg shadow-primary-500/20">
            <Brain size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300 tracking-wide text-base">
              RankerAI
            </h1>
            <span className="text-xs text-primary-500 font-semibold tracking-wider uppercase block -mt-1">
              Resume Screener
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 mt-6 rounded-2xl bg-slate-900/40 border border-slate-800/30 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-accent-fuchsia flex items-center justify-center text-slate-100 font-bold border border-slate-800">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <h2 className="font-semibold text-sm text-slate-200 truncate">{user?.name}</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-900/60 border border-primary-700/30 text-primary-100 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="mt-8 px-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium text-sm border ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary-500/10 to-accent-violet/5 border-primary-500/30 text-primary-500 shadow-md shadow-primary-500/5' 
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 hover:border-slate-800/50'
                  }`
                }
              >
                <Icon size={18} className="transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-slate-800/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl border border-transparent text-red-400/80 hover:text-red-400 hover:bg-red-950/20 hover:border-red-900/20 transition-all duration-200 text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
