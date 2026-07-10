import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  ChevronRight, 
  Loader2, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Plus, 
  History 
} from 'lucide-react';

export const JDMatcher = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const fetchData = async () => {
    try {
      const resumeRes = await api.resume.getHistory();
      if (resumeRes.success) {
        setResumes(resumeRes.data);
        if (resumeRes.data.length > 0) {
          setSelectedResumeId(resumeRes.data[0]._id);
        }
      }

      const matchHistoryRes = await api.job.getHistory();
      if (matchHistoryRes.success) {
        setHistory(matchHistoryRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!selectedResumeId) {
      return toast.error('Please select a resume to match');
    }
    if (!jobDescription.trim()) {
      return toast.error('Please enter a job description');
    }

    setIsLoading(true);
    try {
      const res = await api.job.match({
        resumeId: selectedResumeId,
        jobTitle: jobTitle || 'Target Position',
        jobDescription,
      });

      if (res.success) {
        toast.success('Comparison complete!');
        setMatchResult(res.data);
        
        // Refresh history
        const matchHistoryRes = await api.job.getHistory();
        if (matchHistoryRes.success) {
          setHistory(matchHistoryRes.data);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Matching process failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in-up pb-10">
      
      {/* Left Column: Form & History */}
      <div className="space-y-6">
        
        {/* Form Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/40">
          <h2 className="font-bold text-slate-200 text-sm mb-4 flex items-center space-x-2">
            <Briefcase size={16} className="text-primary-500" />
            <span>Job Description Matcher</span>
          </h2>

          {loadingInitial ? (
            <div className="py-6 flex justify-center">
              <Loader2 size={24} className="text-primary-500 animate-spin" />
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl p-4">
              <FileText size={24} className="text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No resumes found. Please upload a resume before matching against jobs.</p>
              <Link
                to="/resume-analyzer"
                className="mt-3 inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-slate-100 text-[10px] font-bold tracking-wide transition-all"
              >
                <Plus size={10} />
                <span>Upload Now</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleMatch} className="space-y-4">
              
              {/* Resume Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Select Resume Version
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full p-3 rounded-xl glass-input text-xs"
                  required
                >
                  {resumes.map(r => (
                    <option key={r._id} value={r._id} className="bg-darkBg-800 text-slate-200">
                      {r.fileName} ({r.atsScore}% ATS)
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Target Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior MERN Stack Developer"
                  className="w-full p-3 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              {/* Job Description Text Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Paste Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Copy and paste the target job description or requirements here..."
                  rows={8}
                  className="w-full p-3.5 rounded-xl glass-input text-xs"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-violet text-slate-100 text-xs font-bold shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-primary-500/25 transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Analyzing matching factors...</span>
                  </>
                ) : (
                  <>
                    <span>Compare Resume vs JD</span>
                    <ChevronRight size={14} />
                  </>
                )}
              </button>

            </form>
          )}
        </div>

        {/* Match History Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/40">
          <h2 className="font-bold text-slate-200 text-sm mb-4 flex items-center space-x-2">
            <History size={16} className="text-accent-violet" />
            <span>Match History</span>
          </h2>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {loadingInitial ? (
              <p className="text-xs text-slate-500 text-center py-4">Loading history...</p>
            ) : history.length > 0 ? (
              history.map(item => (
                <div
                  key={item._id}
                  onClick={() => setMatchResult(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    matchResult?._id === item._id
                      ? 'bg-slate-900/80 border-primary-500'
                      : 'bg-slate-900/20 border-slate-800 hover:border-slate-700/60'
                  }`}
                >
                  <div className="overflow-hidden">
                    <span className="font-semibold text-slate-200 text-xs truncate block">{item.jobTitle}</span>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    item.matchScore >= 80 ? 'bg-green-500/10 text-green-400' :
                    item.matchScore >= 60 ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {item.matchScore}% Match
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No matching history found.</p>
            )}
          </div>
        </div>

      </div>

      {/* Right Column: Comparison results */}
      <div className="lg:col-span-2">
        {matchResult ? (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800/40 space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/40 pb-6 gap-4">
              <div>
                <span className="text-[10px] text-primary-500 font-bold uppercase tracking-wider">JD Match Analysis</span>
                <h2 className="text-xl font-bold text-slate-200 mt-1">{matchResult.jobTitle}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compared on {new Date(matchResult.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Match Dial Card */}
              <div className="flex items-center space-x-4 bg-slate-900/40 border border-slate-850 p-3 rounded-2xl self-start md:self-auto">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                    <circle 
                      cx="28" 
                      cy="28" 
                      r="24" 
                      stroke={matchResult.matchScore >= 80 ? '#10b981' : matchResult.matchScore >= 60 ? '#f59e0b' : '#ef4444'} 
                      strokeWidth="4" 
                      fill="transparent" 
                      strokeDasharray="150"
                      strokeDashoffset={150 - (150 * matchResult.matchScore) / 100}
                      className="progress-ring__circle"
                    />
                  </svg>
                  <span className="absolute text-sm font-extrabold text-slate-100">{matchResult.matchScore}%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Resume Match Score</span>
                  <p className={`text-xs font-bold mt-0.5 ${
                    matchResult.matchScore >= 80 ? 'text-green-400' :
                    matchResult.matchScore >= 60 ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {matchResult.matchScore >= 80 ? 'High Compatibility' :
                     matchResult.matchScore >= 60 ? 'Moderate Fit' :
                     'Skills Discrepancy'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Grid for Matched vs Missing Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Matched Skills */}
              <div className="p-4 rounded-2xl bg-green-500/5 border border-green-950/20">
                <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <CheckCircle2 size={15} />
                  <span>Matched Keywords ({matchResult.matchedSkills?.length || 0})</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {matchResult.matchedSkills?.length > 0 ? (
                    matchResult.matchedSkills.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-green-950/40 text-green-300 text-[10px] font-bold border border-green-900/30">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-500">No matching keywords detected.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-950/20">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <XCircle size={15} />
                  <span>Missing Keywords ({matchResult.missingSkills?.length || 0})</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {matchResult.missingSkills?.length > 0 ? (
                    matchResult.missingSkills.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-red-950/40 text-red-300 text-[10px] font-bold border border-red-900/30">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-500">Perfect keyword matching! No skills missing.</span>
                  )}
                </div>
              </div>

            </div>

            {/* Suggestions panel */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-850">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Lightbulb size={15} className="text-primary-500" />
                <span>Coach Optimization Advice</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {matchResult.suggestions}
              </p>
            </div>

          </div>
        ) : (
          <div className="h-full min-h-[50vh] border border-dashed border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
            <TrendingUp size={36} className="text-slate-700 animate-pulse mb-3" />
            <h3 className="text-sm font-bold text-slate-400">Match Report Empty</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
              Select a resume version, paste the target job description requirements, and click "Compare Resume vs JD" to run calculations.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
