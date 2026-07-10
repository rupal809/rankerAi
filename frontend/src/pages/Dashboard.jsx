import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  FileText, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  Compass, 
  Activity, 
  Calendar,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.dashboard.getData();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary-500/20 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-400 text-sm animate-pulse">Gathering your metrics...</p>
      </div>
    );
  }

  const summary = data?.summary || {
    totalResumes: 0,
    totalJobMatches: 0,
    totalInterviews: 0,
    latestAtsScore: 0,
    avgAtsScore: 0,
    avgMatchScore: 0,
    avgInterviewScore: 0
  };

  const chartData = data?.charts?.atsProgress || [];
  const activities = data?.recentActivities || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 fade-in-up pb-10">
      
      {/* Top Banner (If no resumes) */}
      {summary.totalResumes === 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-primary-500/20 via-accent-violet/10 to-transparent border border-primary-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-primary-500 text-slate-100 shadow-lg shadow-primary-500/20">
              <Sparkles size={24} className="animate-bounce" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-200">Welcome to Smart CareerSphere AI!</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Get started by uploading your resume in PDF format. We will parse it, give you an ATS rating, extract your skills, and unlock mock interviews and career suggestions!
              </p>
            </div>
          </div>
          <Link
            to="/resume-analyzer"
            className="px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-slate-100 font-semibold shadow-lg text-xs flex items-center space-x-1.5 transition-all self-stretch md:self-auto justify-center"
          >
            <Plus size={15} />
            <span>Upload Resume</span>
          </Link>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={80} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resumes Analyzed</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <FileText size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-sans text-slate-100">{summary.totalResumes}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 flex items-center space-x-1">
            <span>Latest ATS: </span>
            <span className="text-blue-400 font-semibold">{summary.latestAtsScore || 0}/100</span>
          </p>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={80} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average ATS Score</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-primary-400">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-sans text-slate-100">{summary.avgAtsScore}%</span>
          </div>
          <div className="mt-2 w-full bg-slate-900/80 rounded-full h-1.5 overflow-hidden border border-slate-850">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${summary.avgAtsScore}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Briefcase size={80} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">JD Match Rate</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-accent-violet">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-sans text-slate-100">{summary.avgMatchScore}%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 flex items-center space-x-1">
            <span>Runs: </span>
            <span className="text-accent-violet font-semibold">{summary.totalJobMatches} comparisons</span>
          </p>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Award size={80} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mock Interviews</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-accent-fuchsia">
              <Award size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-sans text-slate-100">{summary.totalInterviews}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 flex items-center space-x-1">
            <span>Average Score: </span>
            <span className="text-accent-fuchsia font-semibold">{summary.avgInterviewScore || 0}/10 Rating</span>
          </p>
        </div>
      </div>

      {/* Main Section: Chart & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ATS Score Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-200 text-sm">ATS Progress Tracking</h3>
              <p className="text-[10px] text-slate-500">Monitor ATS formatting optimizations across uploads</p>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-slate-900/50 border border-slate-800/50 text-[10px] text-slate-400 font-semibold">
              <Activity size={12} className="text-primary-500" />
              <span>Score History</span>
            </div>
          </div>

          <div className="w-full h-64 mt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      color: '#f8fafc'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    name="ATS Score" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    dot={{ fill: '#6366f1', r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-6 text-center">
                <AlertCircle size={24} className="text-slate-600 mb-2" />
                <span className="text-xs text-slate-400">No score history available.</span>
                <p className="text-[10px] text-slate-500 mt-1">Upload multiple versions of your resume to track changes.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Tools Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/40">
          <h3 className="font-bold text-slate-200 text-sm mb-6">Quick Tools</h3>
          
          <div className="space-y-4">
            <Link 
              to="/resume-analyzer"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40 hover:bg-slate-900/80 hover:border-slate-700/60 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <FileText size={16} />
                </div>
                <div>
                  <span className="font-semibold text-slate-200 text-xs block">Analyze Resume</span>
                  <span className="text-[10px] text-slate-500">Calculate ATS compatibility</span>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
            </Link>

            <Link 
              to="/jd-matcher"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40 hover:bg-slate-900/80 hover:border-slate-700/60 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-accent-violet">
                  <Briefcase size={16} />
                </div>
                <div>
                  <span className="font-semibold text-slate-200 text-xs block">Job Description Match</span>
                  <span className="text-[10px] text-slate-500">Find matching & missing skills</span>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
            </Link>

            <Link 
              to="/career-coach"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40 hover:bg-slate-900/80 hover:border-slate-700/60 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-orange-400">
                  <Compass size={16} />
                </div>
                <div>
                  <span className="font-semibold text-slate-200 text-xs block">Career Roadmap</span>
                  <span className="text-[10px] text-slate-500">Learning path recommendations</span>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
            </Link>

            <Link 
              to="/mock-interview"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40 hover:bg-slate-900/80 hover:border-slate-700/60 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-pink-500/10 text-accent-fuchsia">
                  <Award size={16} />
                </div>
                <div>
                  <span className="font-semibold text-slate-200 text-xs block">Simulate Interview</span>
                  <span className="text-[10px] text-slate-500">10 customized mock questions</span>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activities List */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800/40">
        <h3 className="font-bold text-slate-200 text-sm mb-6">Recent Reports & Activities</h3>

        <div className="overflow-x-auto">
          {activities.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800/50 pb-4 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Activity Title</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Evaluation Rating</th>
                  <th className="py-3 px-4">Analyzed On</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act) => (
                  <tr key={act.id} className="border-b border-slate-850 hover:bg-slate-900/20 transition-colors text-slate-300">
                    <td className="py-4 px-4 font-semibold flex items-center space-x-3">
                      <span className={`p-1.5 rounded-lg text-slate-100 ${
                        act.type === 'resume' ? 'bg-blue-600/20 text-blue-400' :
                        act.type === 'match' ? 'bg-violet-600/20 text-accent-violet' :
                        'bg-pink-600/20 text-accent-fuchsia'
                      }`}>
                        {act.type === 'resume' ? <FileText size={14} /> :
                         act.type === 'match' ? <Briefcase size={14} /> :
                         <Award size={14} />
                        }
                      </span>
                      <span>{act.title}</span>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-400">{act.subtitle}</td>
                    <td className="py-4 px-4 font-bold text-slate-200">{act.score}</td>
                    <td className="py-4 px-4 text-slate-500 font-medium">
                      {new Date(act.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={
                          act.type === 'resume' ? `/resume-analyzer` :
                          act.type === 'match' ? `/jd-matcher` :
                          `/mock-interview`
                        }
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700/60 hover:text-slate-100 font-semibold text-[10px] tracking-wider transition-colors inline-block"
                      >
                        View Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-500 font-medium">
              No recent activity. Get started by utilizing our tools above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
