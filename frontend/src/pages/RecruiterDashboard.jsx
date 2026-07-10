import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  Briefcase, 
  UploadCloud, 
  Trash2, 
  Loader2, 
  Award, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  History, 
  ChevronRight, 
  Search, 
  Maximize2,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export const RecruiterDashboard = () => {
  // Setup States
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  
  // App States
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('setup'); // 'setup', 'results', 'history-detail'
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  // Results States
  const [activeRun, setActiveRun] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Screening History on mount
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.recruiter.getHistory();
      if (res.success) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error('Error fetching screening history:', err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Only allow PDFs
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== selectedFiles.length) {
      toast.error('Only PDF files are allowed!');
    }
    
    // Add to existing list, ensuring unique file names
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      pdfFiles.forEach(file => {
        if (!newFiles.some(f => f.name === file.name)) {
          newFiles.push(file);
        }
      });
      return newFiles;
    });
    
    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleScreenSubmit = async (e) => {
    e.preventDefault();
    
    if (!jobTitle.trim()) {
      return toast.error('Please enter a target Job Title.');
    }
    if (!jobDescription.trim()) {
      return toast.error('Please provide the Job Description.');
    }
    if (files.length === 0) {
      return toast.error('Please upload at least one candidate resume.');
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('jobTitle', jobTitle);
    formData.append('jobDescription', jobDescription);
    
    files.forEach(file => {
      formData.append('resumes', file);
    });

    try {
      const res = await api.recruiter.screen(formData);
      if (res.success) {
        toast.success('Resume screening completed!');
        setActiveRun(res.data);
        setActiveView('results');
        
        // Reset form
        setJobTitle('');
        setJobDescription('');
        setFiles([]);
        
        // Refresh history list
        fetchHistory();
      }
    } catch (err) {
      toast.error(err.message || 'Screening failed. Please make sure Flask backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const viewPastRun = async (runId) => {
    setIsLoading(true);
    try {
      const res = await api.recruiter.getById(runId);
      if (res.success) {
        setActiveRun(res.data);
        setActiveView('history-detail');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load past screening data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper colors for Recharts bar chart
  const getBarColor = (score) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#6366F1'; // Violet
    if (score >= 40) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  // Filter candidates based on search
  const filteredCandidates = activeRun
    ? activeRun.candidates.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.matchedSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* HEADER WIDGET */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800/40">
        <div>
          <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
            Smart Resume Screener & Candidate Ranking
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            IBM AI Batch Project – Parse bulk resumes using NLTK processing and TF-IDF Cosine Similarity.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {activeView !== 'setup' && (
            <button 
              onClick={() => {
                setActiveRun(null);
                setActiveView('setup');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-slate-100 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 rounded-xl transition duration-200"
            >
              Screen New Batch
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* VIEW 1: SETUP FORM (Recruiter input) */}
        {activeView === 'setup' && (
          <>
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800/40 space-y-6">
                <h2 className="text-sm font-bold text-slate-300 flex items-center space-x-2">
                  <Briefcase size={16} className="text-accent-violet" />
                  <span>Configure Screening Job</span>
                </h2>

                <form onSubmit={handleScreenSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Target Job Title</label>
                    <input 
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/80 transition duration-200 placeholder-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Job Description (Paste requirements)</label>
                    <textarea 
                      rows={6}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the key job description, required skills, and qualifications here..."
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/80 transition duration-200 placeholder-slate-600 resize-none font-sans"
                    />
                  </div>

                  {/* Resumes Drag & Drop Uploader */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Upload Candidate Resumes (PDFs)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/20 hover:bg-slate-950/40 transition duration-200"
                    >
                      <UploadCloud size={32} className="mx-auto text-slate-600 mb-2" />
                      <p className="text-xs text-slate-400 font-medium">Click to upload multiple PDF Resumes</p>
                      <p className="text-[10px] text-slate-500 mt-1">Accepts multiple PDF files (Max 15 resumes at once)</p>
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept=".pdf"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* List of uploaded files */}
                  {files.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-400">Resumes Selected ({files.length})</p>
                      <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                        {files.map((file, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between bg-slate-900/40 border border-slate-850/30 rounded-xl px-4 py-2"
                          >
                            <span className="text-[11px] text-slate-300 truncate max-w-xs">{file.name}</span>
                            <button 
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="text-slate-500 hover:text-red-400 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-slate-100 font-semibold text-xs rounded-xl shadow-lg shadow-indigo-650/10 hover:shadow-indigo-500/20 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>NLTK & TF-IDF Vectorization processing...</span>
                      </>
                    ) : (
                      <>
                        <Users size={16} />
                        <span>Screen and Rank Resumes</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar Column: Screening Runs History */}
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800/40 space-y-4">
                <h2 className="text-sm font-bold text-slate-300 flex items-center space-x-2">
                  <History size={16} className="text-accent-violet" />
                  <span>Screening Run History</span>
                </h2>

                {loadingHistory ? (
                  <div className="flex justify-center py-6">
                    <Loader2 size={24} className="animate-spin text-slate-600" />
                  </div>
                ) : history.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-4">No past screening runs found.</p>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {history.map((run) => (
                      <div 
                        key={run._id}
                        onClick={() => viewPastRun(run._id)}
                        className="p-3 bg-slate-900/30 hover:bg-slate-900/70 border border-slate-850/50 hover:border-slate-800 rounded-2xl cursor-pointer transition group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xs font-bold text-slate-300 group-hover:text-violet-400 transition truncate max-w-[170px]">
                              {run.jobTitle}
                            </h3>
                            <p className="text-[10px] text-slate-500 mt-1">
                              {run.candidates ? run.candidates.length : 0} Candidates Screened
                            </p>
                          </div>
                          <ChevronRight size={14} className="text-slate-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition" />
                        </div>
                        <div className="flex justify-between items-center mt-2 border-t border-slate-900/40 pt-2">
                          <span className="text-[9px] text-slate-600">
                            {new Date(run.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-500">
                            Avg: {Math.round(run.candidates.reduce((acc, curr) => acc + curr.matchScore, 0) / (run.candidates.length || 1))}% Match
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: RESULTS SCREEN (Leaderboard, charts, Details) */}
        {(activeView === 'results' || activeView === 'history-detail') && activeRun && (
          <div className="lg:col-span-3 space-y-6">
            
            {/* Visual Analytics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Summary Stats Card */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800/40 space-y-4 flex flex-col justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Run Details</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-500">Job Title:</span>
                    <p className="text-sm font-bold text-slate-200 mt-0.5">{activeRun.jobTitle}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Candidates Screened:</span>
                    <p className="text-xl font-bold text-accent-violet mt-0.5">{activeRun.candidates.length}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Best Match:</span>
                    <p className="text-xl font-bold text-emerald-500 mt-0.5">
                      {activeRun.candidates[0] ? activeRun.candidates[0].matchScore : 0}%
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-600 border-t border-slate-900/60 pt-2">
                  Screened on: {new Date(activeRun.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Chart Card */}
              <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800/40 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Match Similarity Comparison</h3>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={activeRun.candidates.slice(0, 8)}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748B" fontSize={9} />
                      <YAxis domain={[0, 100]} stroke="#64748B" fontSize={9} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          color: '#f8fafc',
                          fontSize: '11px'
                        }}
                      />
                      <Bar dataKey="matchScore" barSize={35} radius={[8, 8, 0, 0]}>
                        {activeRun.candidates.slice(0, 8).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getBarColor(entry.matchScore)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Leaderboard Table Container */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800/40 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-sm font-bold text-slate-300 flex items-center space-x-2">
                  <Award size={16} className="text-emerald-500" />
                  <span>Screening Match Leaderboard</span>
                </h2>
                
                {/* Search Bar inside table */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidate or skill..."
                    className="bg-slate-950/40 border border-slate-850 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/40 w-full sm:w-60 placeholder-slate-650"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Match Score</th>
                      <th className="py-3 px-4 hidden md:table-cell">Matched Skills</th>
                      <th className="py-3 px-4 hidden lg:table-cell">Missing Gaps</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-500 text-xs">
                          No candidates match the search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredCandidates.map((cand, index) => {
                        const originalRank = activeRun.candidates.findIndex(c => c.fileName === cand.fileName) + 1;
                        return (
                          <tr 
                            key={cand._id || index}
                            className="border-b border-slate-850/50 hover:bg-slate-900/20 transition duration-150 text-xs"
                          >
                            <td className="py-3.5 px-4 font-bold">
                              {originalRank === 1 ? (
                                <span className="bg-yellow-550/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-md">1st</span>
                              ) : originalRank === 2 ? (
                                <span className="bg-slate-400/10 text-slate-300 border border-slate-400/25 px-2 py-0.5 rounded-md">2nd</span>
                              ) : originalRank === 3 ? (
                                <span className="bg-orange-550/25 text-orange-400 border border-orange-550/30 px-2 py-0.5 rounded-md">3rd</span>
                              ) : (
                                <span className="text-slate-500 pl-2">{originalRank}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-slate-200">{cand.name}</p>
                              <span className="text-[10px] text-slate-500">{cand.fileName}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center space-x-2">
                                <span className={`font-bold ${
                                  cand.matchScore >= 80 ? 'text-emerald-500' :
                                  cand.matchScore >= 60 ? 'text-indigo-400' :
                                  cand.matchScore >= 40 ? 'text-amber-500' : 'text-red-500'
                                }`}>
                                  {cand.matchScore}%
                                </span>
                                <div className="w-16 bg-slate-850 h-1.5 rounded-full overflow-hidden hidden sm:block">
                                  <div 
                                    className="h-full rounded-full" 
                                    style={{ 
                                      width: `${cand.matchScore}%`,
                                      backgroundColor: getBarColor(cand.matchScore) 
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 hidden md:table-cell max-w-xs">
                              <div className="flex flex-wrap gap-1">
                                {cand.matchedSkills.slice(0, 3).map((skill, sIdx) => (
                                  <span key={sIdx} className="bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[9px]">
                                    {skill}
                                  </span>
                                ))}
                                {cand.matchedSkills.length > 3 && (
                                  <span className="text-[9px] text-slate-500 px-1.5 py-0.5">
                                    +{cand.matchedSkills.length - 3} more
                                  </span>
                                )}
                                {cand.matchedSkills.length === 0 && (
                                  <span className="text-[9px] text-slate-600">None detected</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 hidden lg:table-cell max-w-xs">
                              <div className="flex flex-wrap gap-1">
                                {cand.missingSkills.slice(0, 3).map((skill, sIdx) => (
                                  <span key={sIdx} className="bg-red-950/20 text-red-400 border border-red-500/10 px-1.5 py-0.5 rounded text-[9px]">
                                    {skill}
                                  </span>
                                ))}
                                {cand.missingSkills.length > 3 && (
                                  <span className="text-[9px] text-slate-500 px-1.5 py-0.5">
                                    +{cand.missingSkills.length - 3} more
                                  </span>
                                )}
                                {cand.missingSkills.length === 0 && (
                                  <span className="text-[9px] text-emerald-500">None</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button 
                                onClick={() => setSelectedCandidate(cand)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-lg hover:text-indigo-400 transition"
                              >
                                <Maximize2 size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CANDIDATE DETAILS POPUP MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-800 max-h-[85vh] overflow-y-auto shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-850">
              <div>
                <h2 className="text-base font-bold text-slate-200">{selectedCandidate.name}</h2>
                <p className="text-[10px] text-slate-500 mt-0.5">{selectedCandidate.fileName}</p>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 bg-slate-850 hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-100 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Score Metric Card */}
              <div className="flex items-center justify-between bg-slate-900/30 border border-slate-850/60 p-4 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${
                    selectedCandidate.matchScore >= 80 ? 'bg-emerald-950/20 text-emerald-400' :
                    selectedCandidate.matchScore >= 60 ? 'bg-indigo-950/20 text-indigo-400' : 'bg-amber-950/20 text-amber-500'
                  }`}>
                    <Award size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">TF-IDF Similarity Rank Score</span>
                    <p className="text-lg font-bold text-slate-200">{selectedCandidate.matchScore}% Match</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {selectedCandidate.matchScore >= 80 ? (
                    <CheckCircle size={14} className="text-emerald-500" />
                  ) : selectedCandidate.matchScore >= 60 ? (
                    <CheckCircle size={14} className="text-indigo-500" />
                  ) : (
                    <AlertCircle size={14} className="text-amber-500" />
                  )}
                  <span className="text-[10px] font-semibold text-slate-300">
                    {selectedCandidate.matchScore >= 80 ? 'Highly Suitable' : selectedCandidate.matchScore >= 60 ? 'Good Potential' : 'Review Manually'}
                  </span>
                </div>
              </div>

              {/* Recommendation Box */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation & Recommendation</h4>
                <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-2xl text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedCandidate.recommendation}
                </div>
              </div>

              {/* Skills Matrix columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Matched Skills */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center space-x-2">
                    <CheckCircle size={14} />
                    <span>Matched Skills ({selectedCandidate.matchedSkills.length})</span>
                  </h4>
                  <div className="p-4 bg-slate-900/20 border border-slate-850 rounded-2xl min-h-[100px]">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidate.matchedSkills.length === 0 ? (
                        <p className="text-[10px] text-slate-600">No overlapping core skills identified in Job Description.</p>
                      ) : (
                        selectedCandidate.matchedSkills.map((skill, idx) => (
                          <span key={idx} className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-red-400 flex items-center space-x-2">
                    <XCircle size={14} />
                    <span>Missing Skill Gaps ({selectedCandidate.missingSkills.length})</span>
                  </h4>
                  <div className="p-4 bg-slate-900/20 border border-slate-850 rounded-2xl min-h-[100px]">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidate.missingSkills.length === 0 ? (
                        <p className="text-[10px] text-emerald-500 font-semibold">Perfect Match! No missing skill gaps detected.</p>
                      ) : (
                        selectedCandidate.missingSkills.map((skill, idx) => (
                          <span key={idx} className="bg-red-950/20 text-red-400 border border-red-500/10 px-2 py-0.5 rounded text-[10px]">
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
