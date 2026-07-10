const User = require('../models/User');
const Resume = require('../models/Resume');
const JobMatch = require('../models/JobMatch');
const Interview = require('../models/Interview');

// @desc    Get global statistics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResumes = await Resume.countDocuments();
    const totalMatches = await JobMatch.countDocuments();
    const totalInterviews = await Interview.countDocuments({ status: 'completed' });
    
    // AI request count is the sum of all analyses, match comparisons, and evaluations
    const totalAiRequests = totalResumes + totalMatches + totalInterviews;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalResumes,
        totalMatches,
        totalInterviews,
        totalAiRequests,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid role (user or admin)',
      });
    }

    // Prevent demoting yourself
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot modify your own role.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user account and all their records (cascading delete)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    // Prevent deleting yourself
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Cascade delete user data
    await Resume.deleteMany({ userId: req.params.id });
    await JobMatch.deleteMany({ userId: req.params.id });
    await Interview.deleteMany({ userId: req.params.id });
    
    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User and all related records deleted successfully.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
