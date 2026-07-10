const Resume = require('../models/Resume');
const pdfService = require('../services/pdfService');
const aiService = require('../services/aiService');

// @desc    Upload & Analyze PDF Resume
// @route   POST /api/resume/upload
// @access  Private
exports.uploadResume = async (req, res, next) => {
  try {
    let resumeText = '';
    let fileName = 'Text Input Resume';

    if (req.file) {
      fileName = req.file.originalname;
      // Parse PDF
      try {
        resumeText = await pdfService.parsePDF(req.file.buffer);
      } catch (pdfErr) {
        return res.status(400).json({
          success: false,
          message: `Could not parse PDF: ${pdfErr.message}`,
        });
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
      if (req.body.fileName) {
        fileName = req.body.fileName;
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file or provide resume text.',
      });
    }

    if (resumeText.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Resume text is empty or could not be extracted.',
      });
    }

    // Call Groq AI service to analyze resume
    let analysis;
    try {
      analysis = await aiService.analyzeResume(resumeText);
    } catch (aiErr) {
      return res.status(500).json({
        success: false,
        message: `AI Analysis failed: ${aiErr.message}`,
      });
    }

    // Save to Database
    const resume = await Resume.create({
      userId: req.user.id,
      fileName,
      resumeText,
      atsScore: analysis.atsScore,
      skills: analysis.skills,
      education: analysis.education,
      projects: analysis.projects,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions,
    });

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: resume,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's resume analysis history
// @route   GET /api/resume/history
// @access  Private
exports.getResumeHistory = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .select('-resumeText') // Omit raw text for lighter payload
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get specific resume analysis details
// @route   GET /api/resume/:id
// @access  Private
exports.getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume analysis report not found',
      });
    }

    // Check ownership (admins can read all)
    if (resume.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this analysis report',
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete resume analysis report
// @route   DELETE /api/resume/:id
// @access  Private
exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume report not found',
      });
    }

    // Check ownership
    if (resume.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this report',
      });
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Resume analysis report deleted successfully',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
