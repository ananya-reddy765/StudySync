const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema(
  {
    groupId: { type: String, required: true, index: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    score: { type: Number, required: true },
    correctCount: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    timeTakenMs: { type: Number, default: 0 }
  },
  { timestamps: true }
);

ScoreSchema.index({ groupId: 1, score: -1 });

module.exports = mongoose.model('Score', ScoreSchema);
