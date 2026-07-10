import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  Award, 
  Cpu, 
  Trash2, 
  UserMinus, 
  UserCheck, 
  Clock, 
  Loader2 
} from 'lucide-react';

export const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningUserId, setActioningUserId] = useState('');

  const fetchAdminData = async () => {
    try {
      const statsRes = await api.admin.getStats();
      const usersRes = await api.admin.getUsers();

      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
    } catch (err) {
      toast.error('Failed to load administrative details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleToggle = async (id, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Are you sure you want to change this user role to ${nextRole}?`)) return;

    setActioningUserId(id);
    try {
      const res = await api.admin.updateRole(id, nextRole);
      if (res.success) {
        toast.success(`User role updated to ${nextRole}`);
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Role change failed.');
    } finally {
      setActioningUserId('');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('WARNING: Deleting this user will erase all their resumes, job matches, and interview evaluations. This cannot be undone. Proceed?')) return;

    setActioningUserId(id);
    try {
      const res = await api.admin.deleteUser(id);
      if (res.success) {
        toast.success('User and all related records deleted successfully.');
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'User deletion failed.');
    } finally {
      setActioningUserId('');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 size={32} className="text-primary-500 animate-spin" />
        <p className="mt-4 text-xs text-slate-400 animate-pulse">Consulting Secure Admin Databases...</p>
      </div>
    );
  }

  const globalStats = stats || {
    totalUsers: 0,
    totalResumes: 0,
    totalMatches: 0,
    totalInterviews: 0,
    totalAiRequests: 0,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 fade-in-up pb-10">
      
      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        
        <div className="glass-panel p-5 rounded-3xl border border-slate-800/40 text-center space-y-2">
          <Users size={20} className="text-blue-400 mx-auto" />
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Users</span>
          <span className="text-2xl font-extrabold text-slate-200">{globalStats.totalUsers}</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800/40 text-center space-y-2">
          <FileText size={20} className="text-indigo-400 mx-auto" />
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Resumes</span>
          <span className="text-2xl font-extrabold text-slate-200">{globalStats.totalResumes}</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800/40 text-center space-y-2">
          <Award size={20} className="text-pink-400 mx-auto" />
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Interviews Evaluated</span>
          <span className="text-2xl font-extrabold text-slate-200">{globalStats.totalInterviews}</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800/40 text-center space-y-2">
          <Cpu size={20} className="text-violet-400 mx-auto" />
          <span className="text-[10px] uppercase font-bold text-slate-500 block">AI Job Matches</span>
          <span className="text-2xl font-extrabold text-slate-200">{globalStats.totalMatches}</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800/40 text-center space-y-2 bg-gradient-to-br from-primary-950/20 to-transparent">
          <ShieldAlert size={20} className="text-primary-400 mx-auto" />
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Total AI Requests</span>
          <span className="text-2xl font-extrabold text-slate-200 text-glow">{globalStats.totalAiRequests}</span>
        </div>

      </div>

      {/* User Management Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800/40">
        <h3 className="font-bold text-slate-200 text-sm mb-6 flex items-center space-x-2">
          <Users size={16} className="text-primary-500" />
          <span>User Accounts Management</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800/50 pb-4 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4">Registration Date</th>
                <th className="py-3 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-slate-850 hover:bg-slate-900/10 transition-colors text-slate-300">
                  <td className="py-4 px-4 font-bold text-slate-200">{u.name}</td>
                  <td className="py-4 px-4 text-slate-400">{u.email}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      u.role === 'admin' ? 'bg-primary-900/60 border border-primary-700/30 text-primary-300' : 'bg-slate-900 border border-slate-800 text-slate-500'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-medium">
                    {new Date(u.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {actioningUserId === u._id ? (
                      <Loader2 size={14} className="animate-spin text-slate-500 ml-auto mr-4" />
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        {/* Promote / Demote */}
                        <button
                          onClick={() => handleRoleToggle(u._id, u.role)}
                          title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                          className={`p-1.5 rounded-lg border transition-all ${
                            u.role === 'admin' 
                              ? 'bg-slate-900 border-slate-800 text-amber-500 hover:bg-amber-950/20 hover:border-amber-900/20' 
                              : 'bg-slate-900 border-slate-800 text-primary-400 hover:bg-primary-950/20 hover:border-primary-900/20'
                          }`}
                        >
                          {u.role === 'admin' ? <UserMinus size={13} /> : <UserCheck size={13} />}
                        </button>
                        
                        {/* Delete User */}
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          title="Delete User & Data"
                          className="p-1.5 rounded-lg border bg-slate-900 border-slate-800 text-red-400/80 hover:bg-red-950/20 hover:border-red-900/20 transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
