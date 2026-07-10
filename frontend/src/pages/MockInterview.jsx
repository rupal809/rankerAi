import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { 
  Award, 
  FileText, 
  ChevronRight, 
  Loader2, 
  CheckCircle, 
  MessageSquareCode, 
  RefreshCw,
  TrendingUp,
  History,
  AlertTriangle,
  Send,
  Calendar,
  Volume2,
  Mic,
  MicOff
} from 'lucide-react';

export const MockInterview = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [interviewHistory, setInterviewHistory] = useState([]);
  
  // App States
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [currentStep, setCurrentStep] = useState('setup'); // 'setup', 'simulator', 'evaluating', 'results'
  const [session, setSession] = useState(null); // stores active interview data
  
  // Simulator states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // [{questionText, answerText}]
  const [currentAnswer, setCurrentAnswer] = useState('');

  // Voice Assistant States
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setCurrentAnswer(prev => prev ? prev + ' ' + transcript : transcript);
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        setIsListening(false);
        if (e.error === 'not-allowed') {
          toast.error('Microphone access denied. Please allow microphone permissions.');
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  // Speak Question using SpeechSynthesis
  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en-'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech is not supported in this browser.');
    }
  };

  // Automatically speak question when it changes in simulator
  useEffect(() => {
    if (currentStep === 'simulator' && session && session.questions[currentQuestionIndex]) {
      speakQuestion(session.questions[currentQuestionIndex].questionText);
    }
    // Stop listening when question changes
    if (isListening && recognition) {
      recognition.stop();
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestionIndex, currentStep, session]);

  const toggleListening = () => {
    if (!recognition) {
      return toast.error('Speech-to-text is not supported in this browser. Try Chrome.');
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const fetchData = async () => {
    try {
      const resumeRes = await api.resume.getHistory();
      if (resumeRes.success) {
        setResumes(resumeRes.data);
        if (resumeRes.data.length > 0) {
          setSelectedResumeId(resumeRes.data[0]._id);
        }
      }

      const historyRes = await api.interview.getHistory();
      if (historyRes.success) {
        setInterviewHistory(historyRes.data);
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

  const handleStartInterview = async (e) => {
    e.preventDefault();
    if (!selectedResumeId) {
      return toast.error('Please select a resume version first.');
    }
    if (!jobTitle) {
      return toast.error('Please provide a target job title.');
    }

    setCurrentStep('evaluating'); // Use evaluating page state for generation loader
    try {
      const res = await api.interview.start({
        resumeId: selectedResumeId,
        jobTitle,
        jobDescription,
      });

      if (res.success) {
        toast.success('Interview questions generated!');
        setSession(res.data);
        setAnswers([]);
        setCurrentQuestionIndex(0);
        setCurrentAnswer('');
        setCurrentStep('simulator');
      }
    } catch (err) {
      toast.error('Failed to generate interview questions.');
      setCurrentStep('setup');
    }
  };

  const handleNextQuestion = () => {
    if (!currentAnswer.trim()) {
      return toast.error('Please type an answer to continue.');
    }

    const currentQuestion = session.questions[currentQuestionIndex];
    const updatedAnswers = [
      ...answers,
      {
        questionText: currentQuestion.questionText,
        answerText: currentAnswer,
      }
    ];

    setAnswers(updatedAnswers);
    setCurrentAnswer('');

    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question completed, trigger evaluation
      evaluateSession(updatedAnswers);
    }
  };

  const evaluateSession = async (finalAnswers) => {
    setCurrentStep('evaluating');
    try {
      const res = await api.interview.evaluate({
        interviewId: session._id,
        answers: finalAnswers,
      });

      if (res.success) {
        toast.success('Interview evaluated!');
        setSession(res.data);
        setCurrentStep('results');
        
        // Refresh history
        const historyRes = await api.interview.getHistory();
        if (historyRes.success) {
          setInterviewHistory(historyRes.data);
        }
      }
    } catch (err) {
      toast.error('Failed to evaluate interview responses.');
      setCurrentStep('simulator');
    }
  };

  const loadPastInterview = async (id) => {
    setLoadingInitial(true);
    try {
      const res = await api.interview.getById(id);
      if (res.success) {
        setSession(res.data);
        setCurrentStep('results');
      }
    } catch (err) {
      toast.error('Could not load interview report.');
    } finally {
      setLoadingInitial(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in-up pb-10">
      
      {/* Left panel: Session History list (Visible in Setup & Results) */}
      {(currentStep === 'setup' || currentStep === 'results') && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800/40">
            <h2 className="font-bold text-slate-200 text-sm mb-4 flex items-center space-x-2">
              <History size={16} className="text-accent-violet" />
              <span>Interview History</span>
            </h2>

            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {loadingInitial ? (
                <p className="text-xs text-slate-500 text-center py-4">Loading history...</p>
              ) : interviewHistory.length > 0 ? (
                interviewHistory.map(item => (
                  <div
                    key={item._id}
                    onClick={() => loadPastInterview(item._id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      session?._id === item._id && currentStep === 'results'
                        ? 'bg-slate-900/80 border-primary-500'
                        : 'bg-slate-900/20 border-slate-800 hover:border-slate-700/60'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <span className="font-semibold text-slate-200 text-xs truncate block">{item.jobTitle}</span>
                      <span className="text-[10px] text-slate-500 flex items-center space-x-1.5 mt-1">
                        <Calendar size={10} />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-primary-900/40 text-primary-300">
                      {item.overallScore}/10
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">No interview sessions recorded.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Panel: Setup, Simulator, or Results */}
      <div className={currentStep === 'simulator' || currentStep === 'evaluating' ? 'lg:col-span-3' : 'lg:col-span-2'}>
        
        {/* State: SETUP */}
        {currentStep === 'setup' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800/40 space-y-6">
            <div>
              <h2 className="font-bold text-slate-200 text-sm flex items-center space-x-2">
                <Award size={16} className="text-primary-500" />
                <span>Configure Mock Interview Session</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure your target role to generate 10 interview questions based on your resume.
              </p>
            </div>

            {resumes.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                <FileText size={32} className="text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Please upload a resume first to configure the interview questions.</p>
                <Link
                  to="/resume-analyzer"
                  className="mt-4 inline-block px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-slate-100 text-xs font-bold transition-all"
                >
                  Upload Resume
                </Link>
              </div>
            ) : (
              <form onSubmit={handleStartInterview} className="space-y-4">
                
                {/* Resume selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Select Resume Profile
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
                    Target Position / Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Junior Frontend Developer"
                    className="w-full p-3 rounded-xl glass-input text-xs"
                    required
                  />
                </div>

                {/* Optional Job Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Job Description / Context (Optional)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Copy and paste key requirements to align interview questions..."
                    rows={5}
                    className="w-full p-3.5 rounded-xl glass-input text-xs"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-violet hover:from-primary-600 hover:to-accent-violet text-slate-100 text-xs font-bold shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Generate AI Questions</span>
                  <ChevronRight size={14} />
                </button>
              </form>
            )}
          </div>
        )}

        {/* State: SIMULATOR */}
        {currentStep === 'simulator' && session && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800/40 space-y-6 max-w-3xl mx-auto">
            
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-4">
              <div>
                <span className="text-[10px] text-primary-500 font-bold uppercase tracking-wider">Interview Session</span>
                <h2 className="text-sm font-bold text-slate-200 mt-0.5">{session.jobTitle}</h2>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400">
                Question {currentQuestionIndex + 1} of {session.questions.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary-500 to-accent-violet h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / session.questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question Card */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <MessageSquareCode size={80} />
              </div>
              <div className="flex justify-between items-start z-10 relative">
                <span className="px-2 py-0.5 rounded bg-primary-900/50 border border-primary-700/30 text-primary-300 text-[9px] font-bold uppercase tracking-widest inline-block">
                  {session.questions[currentQuestionIndex].type}
                </span>
                <button
                  type="button"
                  onClick={() => speakQuestion(session.questions[currentQuestionIndex].questionText)}
                  className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
                  title="Speak Question"
                >
                  <Volume2 size={13} />
                </button>
              </div>
              <p className="text-slate-100 text-sm font-semibold leading-relaxed">
                {session.questions[currentQuestionIndex].questionText}
              </p>
            </div>

            {/* Answer Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Type or Speak Your Answer
                </label>
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all ${
                    isListening
                      ? 'bg-red-950/20 border-red-500 text-red-400 pulse-glow'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff size={11} />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Mic size={11} />
                      <span>Start Speaking</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Formulate your response. Try to structure your thoughts clearly, describe architectures/examples, and highlight your experience..."
                rows={6}
                className="w-full p-4 rounded-xl glass-input text-xs leading-relaxed"
                required
              ></textarea>
            </div>

            {/* Controls */}
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-slate-100 text-xs font-bold shadow-lg shadow-primary-500/25 transition-all flex items-center space-x-1.5"
              >
                <span>
                  {currentQuestionIndex < session.questions.length - 1 ? 'Next Question' : 'Submit Interview'}
                </span>
                <Send size={13} />
              </button>
            </div>

          </div>
        )}

        {/* State: EVALUATING */}
        {currentStep === 'evaluating' && (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800/40 text-center flex flex-col items-center justify-center space-y-4 min-h-[40vh] max-w-2xl mx-auto">
            <Loader2 size={36} className="text-primary-500 animate-spin" />
            <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase animate-pulse">
              AI Coach is Evaluating...
            </h3>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              We are checking your answers for technical knowledge, communication clarity, problem-solving structuring, and confidence levels. This details-heavy process takes around 4 seconds.
            </p>
          </div>
        )}

        {/* State: RESULTS */}
        {currentStep === 'results' && session && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800/40 space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/40 pb-6 gap-4">
              <div>
                <span className="text-[10px] text-primary-500 font-bold uppercase tracking-wider">Evaluation Report</span>
                <h2 className="text-xl font-bold text-slate-200 mt-1">{session.jobTitle}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Completed on {new Date(session.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Overall Score Badge */}
              <div className="flex items-center space-x-4 bg-slate-900/40 border border-slate-850 p-3.5 rounded-2xl self-start md:self-auto">
                <span className="text-3xl font-extrabold font-sans text-primary-500 text-glow">
                  {session.overallScore}/10
                </span>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Overall Coach rating</span>
                  <span className="text-xs font-bold text-slate-300">
                    {session.overallScore >= 8 ? 'Excellent Performance' :
                     session.overallScore >= 6 ? 'Competent Answers' :
                     'Needs Refinement'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Horizontal Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Technical', val: session.evaluation?.technical || 0 },
                { label: 'Communication', val: session.evaluation?.communication || 0 },
                { label: 'Problem Solving', val: session.evaluation?.problemSolving || 0 },
                { label: 'Confidence', val: session.evaluation?.confidence || 0 },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-850 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">{item.label}</span>
                  <span className="text-lg font-extrabold text-slate-200">{item.val}/10</span>
                </div>
              ))}
            </div>

            {/* General Feedback Text */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-850">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <CheckCircle size={14} className="text-primary-500" />
                <span>Coach Summary Feedback</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {session.feedback}
              </p>
            </div>

            {/* Question Breakdown History */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question & Response Breakdown
              </h3>
              
              <div className="space-y-3">
                {session.answers?.map((ans, idx) => (
                  <div key={idx} className="border border-slate-850 rounded-2xl p-4 bg-slate-900/10 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">Q{idx + 1}</span>
                        <p className="text-xs text-slate-300 font-semibold leading-relaxed mt-0.5">{ans.questionText}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        ans.score >= 8 ? 'bg-green-500/10 text-green-400' :
                        ans.score >= 6 ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {ans.score}/10
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 border-l border-slate-800 pl-3 leading-relaxed">
                      <span className="font-semibold text-slate-500 block mb-0.5 text-[9px] uppercase tracking-wider">Your Answer</span>
                      {ans.answerText}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-850 text-[11px] text-primary-400/90 leading-relaxed">
                      <span className="font-semibold text-slate-500 block mb-0.5 text-[9px] uppercase tracking-wider">AI Coach Feedback</span>
                      {ans.feedback}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Restart button */}
            <div className="pt-4 border-t border-slate-850 flex justify-end">
              <button
                onClick={() => setCurrentStep('setup')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5"
              >
                <RefreshCw size={13} />
                <span>Simulate New Interview</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
