import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  BookOpen, 
  Map, 
  ShieldCheck, 
  Plus, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';

export const CareerCoach = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState(0);

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        const res = await api.dashboard.getData();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        toast.error('Failed to load career roadmap.');
      } finally {
        setLoading(false);
      }
    };
    fetchCoachData();
  }, []);

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary-500/20 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-400 text-sm animate-pulse">Consulting AI Career Advisor...</p>
      </div>
    );
  }

  const recommendations = data?.careerRecommendations;

  return (
    <div className="max-w-7xl mx-auto space-y-8 fade-in-up pb-10">
      
      {!recommendations ? (
        <div className="border border-dashed border-slate-800 rounded-3xl p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center">
          <FileText size={40} className="text-slate-700 animate-pulse mb-3" />
          <h2 className="text-base font-bold text-slate-300">No Career Suggestions Available</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            AI recommendations are based on your parsed skills, education, and projects. Please upload your first resume to unlock personalized career paths and roadmaps.
          </p>
          <Link
            to="/resume-analyzer"
            className="mt-6 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-slate-100 text-xs font-semibold shadow-lg flex items-center space-x-1.5 transition-all"
          >
            <Plus size={14} />
            <span>Upload Resume</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel: Recommended Roles */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800/40">
              <h2 className="font-bold text-slate-200 text-sm mb-6 flex items-center space-x-2">
                <Compass size={16} className="text-primary-500" />
                <span>Suggested Career Paths</span>
              </h2>

              <div className="space-y-4">
                {recommendations.roles?.map((role, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-850 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-xs truncate block">{role.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400">
                        {role.suitability}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{role.description}</p>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block mb-1.5">Skills to acquire</span>
                      <div className="flex flex-wrap gap-1">
                        {role.skillsToAcquire?.map((skill, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded-md bg-slate-900 text-[9px] text-slate-400 border border-slate-800 font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center/Right Panel: Roadmap & Courses */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Visual Roadmap Card */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800/40">
              <h2 className="font-bold text-slate-200 text-sm mb-6 flex items-center space-x-2">
                <Map size={16} className="text-accent-violet" />
                <span>Multi-Phase Career Roadmap</span>
              </h2>

              <div className="space-y-3">
                {recommendations.roadmap?.map((phase, idx) => (
                  <div key={idx} className="border border-slate-850 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedPhase(expandedPhase === idx ? -1 : idx)}
                      className="w-full p-4 bg-slate-900/20 flex items-center justify-between text-left transition-colors hover:bg-slate-900/40"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-primary-950 border border-primary-800 text-[10px] font-bold text-primary-400 flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-200">{phase.phase}</span>
                      </div>
                      {expandedPhase === idx ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    
                    {expandedPhase === idx && (
                      <div className="p-4 bg-slate-900/40 border-t border-slate-850 space-y-3">
                        {phase.milestones?.map((milestone, mIdx) => (
                          <div key={mIdx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                            <span className="text-primary-500 mt-0.5">•</span>
                            <p className="leading-relaxed">{milestone}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Suggestions */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800/40">
              <h2 className="font-bold text-slate-200 text-sm mb-6 flex items-center space-x-2">
                <BookOpen size={16} className="text-accent-fuchsia" />
                <span>Curated Learning Recommendations</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.learningRecommendations?.map((rec, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/30 border border-slate-850 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block border-b border-slate-800/50 pb-2">{rec.topic}</span>
                      <div className="space-y-2 mt-3">
                        {rec.resources?.map((res, rIdx) => (
                          <div key={rIdx} className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="font-medium truncate max-w-[150px]">{res.name}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500">
                              {res.platform}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
