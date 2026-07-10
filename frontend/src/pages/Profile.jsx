import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  FileText, 
  Briefcase, 
  Award, 
  Cpu, 
  Trash2,
  Clock
} from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState({ resumes: [], matches: [], interviews: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const resumeRes = await api.resume.getHistory();
      const matchRes = await api.job.getHistory();
      const interviewRes = await api.interview.getHistory();

      setHistory({
        resumes: resumeRes.success ? resumeRes.data : [],
        matches: matchRes.success ? matchRes.data : [],
        interviews: interviewRes.success ? interviewRes.data : []
      });
    } catch (err) {
      toast.error('Failed to load user logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteResume = async (id) => {
    if (!confirm('Are you sure you want to delete this resume report?')) return;
    try {
      const res = await api.resume.delete(id);
      if (res.success) {
        toast.success('Resume deleted');
        fetchData();
      }
    } catch (err) {
      toast.error('Could not delete resume');
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in-up pb-10">
      
      {/* Profile Info Card */}
      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/40 space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500 to-accent-fuchsia flex items-center justify-center text-slate-100 font-bold text-3xl border-2 border-slate-850 shadow-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="font-extrabold text-slate-200 text-base mt-4">{user?.name}</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 mt-1.5 rounded-full bg-primary-900/60 border border-primary-700/30 text-primary-300 capitalize">
              {user?.role} Profile
            </span>
          </div>

          <div className="border-t border-slate-850 pt-4 space-y-3.5">
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <Mail size={15} className="text-slate-500" />
              <span>{user?.email}</span>
            </div>
            
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <Shield size={15} className="text-slate-500" />
              <span className="capitalize">{user?.role} Access Levels</span>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <Calendar size={15} className="text-slate-500" />
              <span>Joined on {new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Stats card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/40">
          <h3 className="font-bold text-slate-200 text-xs mb-4">Account Analytics</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-850 text-center space-y-1">
              <FileText size={15} className="text-blue-400 mx-auto" />
              <span className="text-sm font-bold text-slate-200 block">{history.resumes.length}</span>
              <span className="text-[8px] text-slate-500 uppercase font-semibold">Resumes</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-850 text-center space-y-1">
              <Briefcase size={15} className="text-accent-violet mx-auto" />
              <span className="text-sm font-bold text-slate-200 block">{history.matches.length}</span>
              <span className="text-[8px] text-slate-500 uppercase font-semibold">Matches</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-850 text-center space-y-1">
              <Award size={15} className="text-accent-fuchsia mx-auto" />
              <span className="text-sm font-bold text-slate-200 block">{history.interviews.length}</span>
              <span className="text-[8px] text-slate-500 uppercase font-semibold">Interviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* History logs column */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Resumes history */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/40">
          <h3 className="font-bold text-slate-200 text-sm mb-4 flex items-center space-x-2">
            <FileText size={16} className="text-blue-400" />
            <span>Uploaded Resume Documents</span>
          </h3>

          <div className="space-y-3">
            {loading ? (
              <p className="text-xs text-slate-500 py-4 text-center">Loading resumes...</p>
            ) : history.resumes.length > 0 ? (
              history.resumes.map(item => (
                <div key={item._id} className="p-3.5 rounded-2xl bg-slate-900/20 border border-slate-850 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText size={16} className="text-slate-500" />
                    <div>
                      <span className="font-semibold text-slate-300 text-xs block">{item.fileName}</span>
                      <span className="text-[10px] text-slate-500 flex items-center space-x-1.5 mt-0.5">
                        <Clock size={10} />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                      ATS: {item.atsScore}%
                    </span>
                    <button
                      onClick={() => handleDeleteResume(item._id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No resume documents parsed.</p>
            )}
          </div>
        </div>

        {/* Matches history */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/40">
          <h3 className="font-bold text-slate-200 text-sm mb-4 flex items-center space-x-2">
            <Briefcase size={16} className="text-accent-violet" />
            <span>Job Description Matches</span>
          </h3>

          <div className="space-y-3">
            {loading ? (
              <p className="text-xs text-slate-500 py-4 text-center">Loading comparisons...</p>
            ) : history.matches.length > 0 ? (
              history.matches.map(item => (
                <div key={item._id} className="p-3.5 rounded-2xl bg-slate-900/20 border border-slate-850 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Briefcase size={16} className="text-slate-500" />
                    <div>
                      <span className="font-semibold text-slate-300 text-xs block">{item.jobTitle}</span>
                      <span className="text-[10px] text-slate-500 flex items-center space-x-1.5 mt-0.5">
                        <Clock size={10} />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                    {item.matchScore}% Match
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No job descriptions matched.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
