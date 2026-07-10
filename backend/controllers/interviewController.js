const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const aiService = require('../services/aiService');

// @desc    Generate 10 interview questions based on resume & job details
// @route   POST /api/interview/start
// @access  Private
exports.startInterview = async (req, res, next) => {
  try {
    const { resumeId, jobTitle, jobDescription } = req.body;

    if (!jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a target job title.',
      });
    }

    let resume = null;
    if (resumeId) {
      resume = await Resume.findById(resumeId);
    } else {
      resume = await Resume.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    }

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume first to start the interview session.',
      });
    }

    const jdText = jobDescription || `Position for a ${jobTitle} requiring standard industry skills.`;

    // Call Groq AI to generate questions
    let result;
    try {
      result = await aiService.generateMockInterview(resume.resumeText, jobTitle, jdText);
    } catch (aiErr) {
      return res.status(500).json({
        success: false,
        message: `AI Interview generation failed: ${aiErr.message}`,
      });
    }

    // Save initial interview record to database
    const interview = await Interview.create({
      userId: req.user.id,
      jobTitle,
      questions: result.questions,
      answers: [],
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Interview session started and questions generated.',
      data: interview,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit answers & evaluate interview performance
// @route   POST /api/interview/evaluate
// @access  Private
exports.evaluateInterview = async (req, res, next) => {
  try {
    const { interviewId, answers } = req.body; // answers is array of { questionText, answerText }

    if (!interviewId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide interviewId and an array of answers.',
      });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.',
      });
    }

    if (interview.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to evaluate this session.',
      });
    }

    // Call Groq AI to evaluate answers
    let evaluationResult;
    try {
      evaluationResult = await aiService.evaluateInterview(answers);
    } catch (aiErr) {
      return res.status(500).json({
        success: false,
        message: `AI Evaluation failed: ${aiErr.message}`,
      });
    }

    // Update interview record
    interview.answers = evaluationResult.answers;
    interview.overallScore = evaluationResult.overall;
    interview.evaluation = {
      technical: evaluationResult.technical,
      communication: evaluationResult.communication,
      problemSolving: evaluationResult.problemSolving,
      confidence: evaluationResult.confidence,
    };
    interview.feedback = evaluationResult.feedback;
    interview.status = 'completed';

    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Interview evaluated successfully.',
      data: interview,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's mock interview history
// @route   GET /api/interview/history
// @access  Private
exports.getInterviewHistory = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id })
      .select('-answers -questions') // Return lightweight metadata
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get details of a specific interview evaluation
// @route   GET /api/interview/:id
// @access  Private
exports.getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.',
      });
    }

    if (interview.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this evaluation report.',
      });
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (err) {
    next(err);
  }
};
