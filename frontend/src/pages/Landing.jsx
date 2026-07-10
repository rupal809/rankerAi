import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Brain, 
  FileText, 
  Briefcase, 
  Award, 
  Compass, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Users
} from 'lucide-react';

export const Landing = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Smart Resume Screener',
      desc: 'Upload resumes in bulk, preprocess files using NLTK, and rank matching candidates dynamically using TF-IDF Cosine Similarity vectors.',
      icon: Users,
      color: 'from-violet-600 to-indigo-600',
    },
    {
      title: 'Resume ATS Analysis',
      desc: 'Calculate ATS scoring instantly, uncover critical keyword formatting gaps, and receive suggestions for improvement.',
      icon: FileText,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Job Description Matching',
      desc: 'Compare resumes side-by-side with job descriptions. Extract missing and matched skills in a clear comparison dashboard.',
      icon: Briefcase,
      color: 'from-violet-500 to-purple-500',
    },
    {
      title: 'AI Mock Interviews',
      desc: 'Simulate structured technical, project-based, HR, and behavioral interview questions tailored to your target job profile.',
      icon: Award,
      color: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <div className="min-h-screen bg-darkBg-900 text-slate-100 flex flex-col relative overflow-hidden select-none">
      {/* Glow Orbs */}
      <div className="glow-orb bg-indigo-600 w-[600px] h-[600px] -top-40 -left-40"></div>
      <div className="glow-orb bg-purple-600 w-[500px] h-[500px] bottom-0 right-0"></div>

      {/* Header */}
      <nav className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet text-white shadow-lg shadow-primary-500/20">
            <Brain size={24} />
          </div>
          <div>
            <h1 className="font-extrabold font-sans text-transparent bg-clip-text bg-gradient-to-r from-slate-50 to-slate-200 tracking-wide text-lg">
              RankerAI
            </h1>
            <span className="text-xs text-primary-500 font-bold uppercase tracking-widest block -mt-1">
              Resume Screener
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-violet text-white font-medium shadow-lg hover:shadow-primary-500/30 transition-all duration-200 text-sm flex items-center space-x-1.5"
            >
              <span>Dashboard</span>
              <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-violet text-white font-medium shadow-lg hover:shadow-primary-500/30 transition-all duration-200 text-sm flex items-center space-x-1.5"
              >
                <span>Get Started</span>
                <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 flex flex-col justify-center py-20 z-10 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary-950/60 border border-primary-800/40 text-primary-400 text-xs font-semibold mb-8 animate-pulse">
            <Zap size={13} />
            <span>Powering Next-Gen Job Placement</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold font-sans leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
            Smart Resume Screening & <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-accent-violet to-accent-fuchsia text-glow">
              Candidate Ranking Tool
            </span>
          </h1>

          <p className="mt-6 text-slate-400 md:text-lg max-w-2xl mx-auto leading-relaxed">
            Upload multiple candidate resumes in bulk, clean text via NLTK processing, and match them with Job Descriptions to calculate similarity percentages using Cosine Vector models.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-violet hover:from-primary-600 hover:to-accent-violet text-white font-semibold shadow-xl shadow-primary-500/20 transition-all duration-200 flex items-center justify-center space-x-2 text-base"
            >
              <span>Start Resume Screening</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:bg-slate-900 text-slate-300 font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-base"
            >
              <span>Try Mock Interview</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <section className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold font-sans">
              All-In-One Career Guidance Engine
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Explore our core modules driven by state-of-the-art Groq AI intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="glass-panel p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] border border-slate-800/40 relative group"
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white shadow-lg mb-6`}>
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-200 mb-3">{feat.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Analytics Sneak Peek */}
        <section className="mt-32 mb-20 p-8 rounded-3xl glass-panel border border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="p-2 w-fit rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold mb-4 flex items-center space-x-1.5">
              <ShieldCheck size={14} />
              <span>Production Ready Architecture</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-sans">
              Designed for Speed and Accuracy
            </h2>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Powered by Groq SDK Llama models and lightning-quick PDF text parsers, our engine yields detailed results in less than 3 seconds. Secure JWT authentication and database isolation guarantee your resume data is private and encrypted.
            </p>
          </div>
          <div className="flex gap-4 md:gap-8 flex-wrap justify-center">
            <div className="px-6 py-4 rounded-2xl bg-slate-900/60 border border-slate-800/50 text-center min-w-[120px]">
              <span className="text-2xl md:text-3xl font-bold font-sans text-primary-500 text-glow">98%</span>
              <p className="text-slate-500 text-[10px] uppercase font-semibold mt-1">Accuracy</p>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-slate-900/60 border border-slate-800/50 text-center min-w-[120px]">
              <span className="text-2xl md:text-3xl font-bold font-sans text-accent-violet text-glow">3s</span>
              <p className="text-slate-500 text-[10px] uppercase font-semibold mt-1">AI Latency</p>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-slate-900/60 border border-slate-800/50 text-center min-w-[120px]">
              <span className="text-2xl md:text-3xl font-bold font-sans text-accent-fuchsia text-glow">100%</span>
              <p className="text-slate-500 text-[10px] uppercase font-semibold mt-1">Secure</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800/40 text-center text-xs text-slate-500 z-10 relative">
        <p>&copy; {new Date().getFullYear()} Smart CareerSphere AI. Crafted for developer-grade career coaching.</p>
      </footer>
    </div>
  );
};
