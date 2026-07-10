const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    questions: [
      {
        questionText: { type: String, required: true },
        type: {
          type: String,
          enum: ['Technical', 'HR', 'Behavioral', 'Project Based'],
          required: true,
        },
      },
    ],
    answers: [
      {
        questionText: { type: String, required: true },
        answerText: { type: String, required: true },
        score: { type: Number, default: 0 },
        feedback: { type: String, default: '' },
      },
    ],
    overallScore: {
      type: Number,
      default: 0,
    },
    evaluation: {
      technical: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
      confidence: { type: Number, default: 0 },
    },
    feedback: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Interview', InterviewSchema);
