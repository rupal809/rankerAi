import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg-900 flex flex-col items-center justify-center">
        {/* Animated glowing spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary-500/20 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-accent-violet animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-400 font-medium tracking-wide animate-pulse">
          Loading Career Coach...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
