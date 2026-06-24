const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// Submit a score (also done via socket, REST kept for non-realtime clients)
router.post('/', async (req, res) => {
  try {
    const { groupId, quizId, userId, username, score, correctCount, totalQuestions, timeTakenMs } = req.body;
    const saved = await Score.create({ groupId, quizId, userId, username, score, correctCount, totalQuestions, timeTakenMs });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Top scores for a group, optionally filtered by quiz
router.get('/group/:groupId', async (req, res) => {
  try {
    const filter = { groupId: req.params.groupId };
    if (req.query.quizId) filter.quizId = req.query.quizId;

    const leaderboard = await Score.aggregate([
      { $match: filter },
      { $sort: { score: -1, timeTakenMs: 1 } },
      {
        $group: {
          _id: '$userId',
          username: { $first: '$username' },
          bestScore: { $first: '$score' },
          attempts: { $sum: 1 }
        }
      },
      { $sort: { bestScore: -1 } },
      { $limit: 50 }
    ]);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
