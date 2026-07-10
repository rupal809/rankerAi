const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
      },
    ],
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', ResumeSchema);
