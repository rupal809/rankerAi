const ScreeningRun = require('../models/ScreeningRun');
const { parsePDF } = require('../services/pdfService');

/**
 * @desc    Screen and rank multiple resumes against a job description
 * @route   POST /api/recruiter/screen
 * @access  Private (Recruiter/Admin)
 */
const screenResumes = async (req, res, next) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    
    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a job description for screening.',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one resume PDF.',
      });
    }

    const candidates = [];
    
    // Parse text from uploaded resumes using pdf-parse
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      try {
        const text = await parsePDF(file.buffer);
        
        // Format a human-readable name from the filename
        const readableName = file.originalname
          .replace(/\.[^/.]+$/, "")  // Remove extension
          .replace(/[_-]/g, " ")     // Replace underscores/dashes with spaces
          .trim();
          
        candidates.push({
          id: i.toString(),
          name: readableName,
          fileName: file.originalname,
          text: text
        });
      } catch (err) {
        console.error(`Error parsing file ${file.originalname}:`, err.message);
        // Continue with other files instead of crashing
      }
    }

    if (candidates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to extract text from any of the uploaded resumes.',
      });
    }

    // Call the Python NLP Flask microservice
    const pythonURL = process.env.PYTHON_NLP_URL || 'http://localhost:8000/rank';
    let rankedResults = [];
    
    try {
      const response = await fetch(pythonURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          candidates,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        rankedResults = result.rankedResults;
      } else {
        throw new Error(result.message || 'Python NLP server returned success=false');
      }
    } catch (err) {
      console.warn('Python NLP server connection failed. Using local fallback algorithm...', err.message);
      
      // Fallback local ranking algorithm in case Python service is not running
      rankedResults = candidates.map((cand, idx) => {
        const words = cand.text.toLowerCase();
        const jdWords = jobDescription.toLowerCase();
        
        // Simple mock matching logic for fallback
        const jdSkills = ['react', 'node', 'mongodb', 'express', 'docker', 'aws', 'kubernetes', 'typescript', 'python', 'sql', 'redux', 'tailwind'];
        const matched = [];
        const missing = [];
        
        jdSkills.forEach(skill => {
          if (jdWords.includes(skill)) {
            if (words.includes(skill)) {
              matched.push(skill.charAt(0).toUpperCase() + skill.slice(1));
            } else {
              missing.push(skill.charAt(0).toUpperCase() + skill.slice(1));
            }
          }
        });

        if (matched.length === 0 && missing.length === 0) {
          matched.push('Web Development');
        }

        const matchScore = Math.floor((matched.length / (matched.length + missing.length || 1)) * 45) + 50; // 50-95
        
        return {
          id: cand.id,
          name: cand.name,
          fileName: cand.fileName,
          matchScore: Math.min(matchScore, 100),
          matchedSkills: matched,
          missingSkills: missing,
          recommendation: matchScore >= 75 
            ? 'Recommended: Strong local skills matches found.' 
            : 'Moderate Match: Missing multiple core competencies.'
        };
      });
      
      // Sort descending
      rankedResults = rankedResults.sort((a, b) => b.matchScore - a.matchScore);
    }

    // Save this screening run in the database
    const screeningRun = await ScreeningRun.create({
      recruiterId: req.user._id,
      jobTitle: jobTitle || 'Screening Run',
      jobDescription: jobDescription,
      candidates: rankedResults
    });

    res.status(201).json({
      success: true,
      message: 'Resumes screened and ranked successfully.',
      data: screeningRun,
    });
    
  } catch (error) {
    console.error('Error in screenResumes controller:', error.message);
    res.status(500).json({
      success: false,
      message: `Screening failed: ${error.message}`,
    });
  }
};

/**
 * @desc    Get recruiter's past screening history
 * @route   GET /api/recruiter/history
 * @access  Private (Recruiter/Admin)
 */
const getScreeningHistory = async (req, res, next) => {
  try {
    const history = await ScreeningRun.find({ recruiterId: req.user._id })
      .select('-jobDescription') // Exclude heavy description for list view
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to retrieve history: ${error.message}`,
    });
  }
};

/**
 * @desc    Get specific screening run details
 * @route   GET /api/recruiter/run/:id
 * @access  Private (Recruiter/Admin)
 */
const getScreeningRunById = async (req, res, next) => {
  try {
    const run = await ScreeningRun.findById(req.params.id);
    
    if (!run) {
      return res.status(404).json({
        success: false,
        message: 'Screening run not found.',
      });
    }

    // Security check: Only allow the recruiter who created it (or admin)
    if (run.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this screening run.',
      });
    }

    res.status(200).json({
      success: true,
      data: run,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to retrieve run details: ${error.message}`,
    });
  }
};

module.exports = {
  screenResumes,
  getScreeningHistory,
  getScreeningRunById,
};
