const Resume = require('../models/Resume');
const JobMatch = require('../models/JobMatch');
const Interview = require('../models/Interview');
const aiService = require('../services/aiService');

// @desc    Get dashboard analytics cards and charts data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Fetch counts
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
    const jobMatches = await JobMatch.find({ userId }).sort({ createdAt: -1 });
    const interviews = await Interview.find({ userId, status: 'completed' }).sort({ createdAt: -1 });

    const totalResumes = resumes.length;
    const totalJobMatches = jobMatches.length;
    const totalInterviews = interviews.length;

    // 2. Calculate averages
    let avgAtsScore = 0;
    let latestAtsScore = 0;
    if (totalResumes > 0) {
      const sumAts = resumes.reduce((acc, curr) => acc + curr.atsScore, 0);
      avgAtsScore = Math.round(sumAts / totalResumes);
      latestAtsScore = resumes[0].atsScore;
    }

    let avgMatchScore = 0;
    if (totalJobMatches > 0) {
      const sumMatch = jobMatches.reduce((acc, curr) => acc + curr.matchScore, 0);
      avgMatchScore = Math.round(sumMatch / totalJobMatches);
    }

    let avgInterviewScore = 0;
    if (totalInterviews > 0) {
      const sumInterview = interviews.reduce((acc, curr) => acc + curr.overallScore, 0);
      avgInterviewScore = parseFloat((sumInterview / totalInterviews).toFixed(1));
    }

    // 3. Compile timeline data for Recharts (past 5 resumes for tracking progression)
    const atsProgress = resumes
      .slice(0, 5)
      .reverse()
      .map(r => ({
        name: r.fileName.length > 15 ? r.fileName.substring(0, 12) + '...' : r.fileName,
        score: r.atsScore,
        date: new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      }));

    // Compile recent activities list
    const recentActivities = [];

    resumes.slice(0, 3).forEach(r => {
      recentActivities.push({
        id: r._id,
        type: 'resume',
        title: 'Resume Analyzed',
        subtitle: r.fileName,
        score: `${r.atsScore} ATS`,
        date: r.createdAt
      });
    });

    jobMatches.slice(0, 3).forEach(jm => {
      recentActivities.push({
        id: jm._id,
        type: 'match',
        title: 'Job Match Analysis',
        subtitle: jm.jobTitle,
        score: `${jm.matchScore}% Match`,
        date: jm.createdAt
      });
    });

    interviews.slice(0, 3).forEach(i => {
      recentActivities.push({
        id: i._id,
        type: 'interview',
        title: 'Mock Interview Evaluated',
        subtitle: i.jobTitle,
        score: `${i.overallScore}/10 Rating`,
        date: i.createdAt
      });
    });

    // Sort all activities by date descending
    recentActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 4. Career Recommendations (Based on latest resume if exists)
    let careerRecommendations = null;
    if (totalResumes > 0) {
      const latestResume = resumes[0];
      try {
        careerRecommendations = await aiService.suggestCareerPaths(
          latestResume.resumeText,
          latestResume.skills,
          latestResume.education
        );
      } catch (err) {
        console.error('Error fetching career recommendations for dashboard:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalResumes,
          totalJobMatches,
          totalInterviews,
          latestAtsScore,
          avgAtsScore,
          avgMatchScore,
          avgInterviewScore
        },
        charts: {
          atsProgress
        },
        recentActivities: recentActivities.slice(0, 5),
        careerRecommendations
      }
    });
  } catch (err) {
    next(err);
  }
};
