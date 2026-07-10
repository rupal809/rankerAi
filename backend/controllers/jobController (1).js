const JobMatch = require('../models/JobMatch');
const Resume = require('../models/Resume');
const aiService = require('../services/aiService');

// @desc    Compare Resume vs Job Description
// @route   POST /api/job/match
// @access  Private
exports.matchJobDescription = async (req, res, next) => {
  try {
    const { resumeId, jobTitle, jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a job description to match.',
      });
    }

    let resume = null;

    if (resumeId) {
      resume = await Resume.findById(resumeId);
    } else {
      // Fallback to the latest resume uploaded by the user
      resume = await Resume.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    }

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: 'No resume found. Please upload a resume first.',
      });
    }

    // Call Groq AI to match resume text vs JD
    let matchResult;
    try {
      matchResult = await aiService.matchJobDescription(resume.resumeText, jobDescription);
    } catch (aiErr) {
      return res.status(500).json({
        success: false,
        message: `AI JD Matching failed: ${aiErr.message}`,
      });
    }

    // Save to Database
    const jobMatch = await JobMatch.create({
      userId: req.user.id,
      jobTitle: jobTitle || 'Target Position',
      jobDescription,
      matchScore: matchResult.matchScore,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      suggestions: matchResult.suggestions,
    });

    res.status(200).json({
      success: true,
      message: 'Job description matched successfully',
      data: jobMatch,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's job match history
// @route   GET /api/job/history
// @access  Private
exports.getJobMatchHistory = async (req, res, next) => {
  try {
    const matches = await JobMatch.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (err) {
    next(err);
  }
};
