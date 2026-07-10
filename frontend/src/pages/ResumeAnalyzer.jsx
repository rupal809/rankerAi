import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  History, 
  Calendar,
  Briefcase,
  GraduationCap,
  Loader2,
  Cpu
} from 'lucide-react';

export const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [history, setHistory] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  
  // Simulated upload statuses
  const [uploadStatus, setUploadStatus] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await api.resume.getHistory();
      if (res.success) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        return toast.error('Only PDF files are supported.');
      }
      setFile(selectedFile);
      setResumeText(''); // Reset text input
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file && !resumeText.trim()) {
      return toast.error('Please upload a PDF or enter resume text.');
    }

    setIsUploading(true);
    const statuses = [
      'Extracting PDF contents...',
      'Structuring skills database...',
      'Contacting Groq AI engine...',
      'Calculating ATS score matches...',
      'Compiling career recommendations...'
    ];

    let statusIndex = 0;
    setUploadStatus(statuses[0]);
    const interval = setInterval(() => {
      statusIndex++;
      if (statusIndex < statuses.length) {
        setUploadStatus(statuses[statusIndex]);
      }
    }, 1200);

    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('resume', file);
        res = await api.resume.upload(formData);
      } else {
        res = await api.resume.uploadText({ resumeText, fileName: 'Manual Text Resume' });
      }

      if (res.success) {
        toast.success('Resume analyzed successfully!');
        setSelectedReport(res.data);
        fetchHistory(); // Refresh history
      } else {
        toast.error(res.message || 'Analysis failed.');
      }
    } catch (err) {
      toast.error(err.message || 'Error occurred during parsing.');
    } finally {
      clearInterval(interval);
      setIsUploading(false);
      setUploadStatus('');
      setFile(null);
      setResumeText('');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const res = await api.resume.delete(id);
      if (res.success) {
        toast.success('Report deleted successfully');
        if (selectedReport?._id === id) {
          setSelectedReport(null);
        }
        fetchHistory();
      }
    } catch (err) {
      toast.error('Failed to delete report');
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in-up pb-10">
      
      {/* Left side: Upload & History */}
      <div className="space-y-6">
        
        {/* Upload card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/40">
          <h2 className="font-bold text-slate-200 text-sm mb-4 flex items-center space-x-2">
            <Cpu size={16} className="text-primary-500" />
            <span>Analyze Resume</span>
          </h2>

          {isUploading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <Loader2 size={32} className="text-primary-500 animate-spin" />
              <p className="text-xs text-primary-400 font-semibold tracking-wider animate-pulse uppercase">
                {uploadStatus}
              </p>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-4">
              
              {/* Drag and Drop Zone */}
              <div className="border border-dashed border-slate-800 hover:border-slate-700/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-900/10 hover:bg-slate-900/30 relative group">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 rounded-full bg-primary-950 text-primary-500 group-hover:scale-105 transition-transform">
                    <Upload size={20} />
                  </div>
                  <span className="text-xs text-slate-300 font-semibold block">
                    {file ? file.name : 'Upload PDF Resume'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">PDF file formats up to 5MB</span>
                </div>
              </div>

              {/* Text Area Fallback */}
              {!file && (
                <div className="space-y-2">
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-800/50"></div>
                    <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or Paste Text</span>
                    <div className="flex-grow border-t border-slate-800/50"></div>
                  </div>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your plain text resume content here..."
                    rows={4}
                    className="w-full p-3.5 rounded-xl glass-input text-xs"
                  ></textarea>
                </div>
              )}

              <button
                type="submit"
                disabled={!file && !resumeText.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-violet text-slate-100 text-xs font-bold shadow-lg shadow-primary-500/25 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-primary-500/35 transition-all"
              >
                Start AI Analysis
              </button>
            </form>
          )}
        </div>

        {/* History List */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/40">
          <h2 className="font-bold text-slate-200 text-sm mb-4 flex items-center space-x-2">
            <History size={16} className="text-accent-violet" />
            <span>Analysis History</span>
          </h2>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {loadingHistory ? (
              <p className="text-xs text-slate-500 text-center py-6">Loading history...</p>
            ) : history.length > 0 ? (
              history.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelectedReport(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    selectedReport?._id === item._id
                      ? 'bg-slate-900/80 border-primary-500'
                      : 'bg-slate-900/20 border-slate-800 hover:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <FileText size={16} className={selectedReport?._id === item._id ? 'text-primary-500' : 'text-slate-400'} />
                    <div className="overflow-hidden">
                      <span className="font-semibold text-slate-200 text-xs truncate block">{item.fileName}</span>
                      <span className="text-[10px] text-slate-500 flex items-center space-x-1.5 mt-0.5">
                        <Calendar size={10} />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      item.atsScore >= 75 ? 'bg-green-500/10 text-green-400' :
                      item.atsScore >= 55 ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {item.atsScore}%
                    </span>
                    <button
                      onClick={(e) => handleDelete(item._id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800/60 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">No analysis history found.</p>
            )}
          </div>
        </div>

      </div>

      {/* Right side: Report display */}
      <div className="lg:col-span-2">
        {selectedReport ? (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800/40 space-y-6">
            
            {/* Report Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/40 pb-6 gap-4">
              <div>
                <span className="text-[10px] text-primary-500 font-bold uppercase tracking-wider">Analysis Report</span>
                <h2 className="text-xl font-bold text-slate-200 mt-1">{selectedReport.fileName}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Processed on {new Date(selectedReport.createdAt).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* ATS Gauge Card */}
              <div className="flex items-center space-x-4 bg-slate-900/40 border border-slate-850 p-3 rounded-2xl self-start md:self-auto">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  {/* Gauge SVG Circle */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                    <circle 
                      cx="28" 
                      cy="28" 
                      r="24" 
                      stroke={selectedReport.atsScore >= 75 ? '#10b981' : selectedReport.atsScore >= 55 ? '#f59e0b' : '#ef4444'} 
                      strokeWidth="4" 
                      fill="transparent" 
                      strokeDasharray="150"
                      strokeDashoffset={150 - (150 * selectedReport.atsScore) / 100}
                      className="progress-ring__circle"
                    />
                  </svg>
                  <span className="absolute text-sm font-extrabold text-slate-100">{selectedReport.atsScore}%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">ATS Score Rating</span>
                  <p className={`text-xs font-bold mt-0.5 ${
                    selectedReport.atsScore >= 75 ? 'text-green-400' :
                    selectedReport.atsScore >= 55 ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {selectedReport.atsScore >= 75 ? 'ATS-Optimized' :
                     selectedReport.atsScore >= 55 ? 'Needs Optimization' :
                     'High Formatting Risk'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-850 overflow-x-auto gap-2">
              {[
                { id: 'summary', label: 'Score & Feedback', icon: Sparkles },
                { id: 'skills', label: 'Skills & Experience', icon: Briefcase },
                { id: 'education', label: 'Education & Projects', icon: GraduationCap }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap -mb-[2px] ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-500'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab: Summary */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                
                {/* Strengths */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>Identified Strengths</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedReport.strengths?.map((str, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-green-500/5 border border-green-950/20 text-xs text-green-300">
                        {str}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weaknesses */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                    <AlertTriangle size={14} className="text-amber-500" />
                    <span>ATS Flags & Weaknesses</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedReport.weaknesses?.map((weak, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-red-500/5 border border-red-950/20 text-xs text-red-300">
                        {weak}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                    <Lightbulb size={14} className="text-primary-500" />
                    <span>Coach Recommendations</span>
                  </h3>
                  <div className="space-y-2">
                    {selectedReport.suggestions?.map((sug, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-850 text-xs text-slate-300 flex items-start space-x-2">
                        <span className="font-bold text-primary-500 mt-0.5">•</span>
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab: Skills & Experience */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                
                {/* Extracted Skills */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Extracted Core Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedReport.skills?.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-primary-900/30 border border-primary-800/30 text-primary-300 text-xs font-semibold tracking-wide">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Extracted Projects
                  </h3>
                  <div className="space-y-4">
                    {selectedReport.projects?.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-900/30 border border-slate-850 space-y-2">
                        <span className="font-bold text-slate-200 text-xs block">{proj.title}</span>
                        <p className="text-slate-400 text-xs leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {proj.technologies?.map((tech, tIdx) => (
                            <span key={tIdx} className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] text-slate-500 border border-slate-800">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab: Education & Projects */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                
                {/* Education */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Education details
                  </h3>
                  <div className="space-y-3">
                    {selectedReport.education?.map((edu, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-900/30 border border-slate-850 flex items-start justify-between">
                        <div>
                          <span className="font-bold text-slate-200 text-xs block">{edu.degree}</span>
                          <span className="text-[10px] text-slate-500 mt-1 block">{edu.institution}</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                          {edu.year}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        ) : (
          <div className="h-full min-h-[50vh] border border-dashed border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
            <Cpu size={36} className="text-slate-700 animate-pulse mb-3" />
            <h3 className="text-sm font-bold text-slate-400">No Report Selected</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
              Upload a resume on the left or select an existing report from your history to display its detailed parsing statistics.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
