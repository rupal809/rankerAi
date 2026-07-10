const mongoose = require('mongoose');

const ScreeningRunSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
      default: 'Job Role',
    },
    jobDescription: {
      type: String,
      required: true,
    },
    candidates: [
      {
        name: { type: String, required: true },
        fileName: { type: String, required: true },
        matchScore: { type: Number, required: true },
        matchedSkills: { type: [String], default: [] },
        missingSkills: { type: [String], default: [] },
        recommendation: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ScreeningRun', ScreeningRunSchema);
