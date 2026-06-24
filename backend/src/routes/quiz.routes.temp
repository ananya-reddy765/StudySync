// backend/src/routes/quiz.routes.js

import express from "express";
import Quiz from "../models/Quiz.model.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   CREATE QUIZ
   POST /api/groups/:groupId/quizzes
===================================================== */
router.post("/groups/:groupId/quizzes", protect, async (req, res) => {
  try {
    console.log("Quiz Create Body:", req.body);
    console.log("User:", req.user);

    const { title, description, questions } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Quiz title is required",
      });
    }

    const quiz = await Quiz.create({
      group: req.params.groupId,
      createdBy: req.user._id,
      title,
      description,
      questions: questions || [],
    });

    const populatedQuiz = await Quiz.findById(quiz._id)
      .populate("createdBy", "name avatar");

    res.status(201).json(populatedQuiz);
  } catch (error) {
    console.error("Create Quiz Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =====================================================
   GET ALL QUIZZES OF A GROUP
===================================================== */
router.get("/groups/:groupId/quizzes", protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      group: req.params.groupId,
    })
      .populate("createdBy", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =====================================================
   GET SINGLE QUIZ
===================================================== */
router.get("/quizzes/:quizId", protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId)
      .populate("createdBy", "name avatar");

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =====================================================
   UPDATE QUIZ
===================================================== */
router.put("/quizzes/:quizId", protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const { title, description, questions } = req.body;

    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.questions = questions || quiz.questions;

    await quiz.save();

    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =====================================================
   DELETE QUIZ
===================================================== */
router.delete("/quizzes/:quizId", protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =====================================================
   SUBMIT QUIZ ATTEMPT
===================================================== */
router.post("/quizzes/:quizId/attempt", protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    const { answers } = req.body;

    const score = Array.isArray(answers)
      ? answers.filter((a) => a.isCorrect).length
      : 0;

    const total = quiz.questions.length;

    quiz.attempts.push({
      user: req.user._id,
      score,
      total,
    });

    await quiz.save();

    res.status(200).json({
      score,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =====================================================
   QUIZ LEADERBOARD
===================================================== */
router.get("/quizzes/:quizId/leaderboard", protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId)
      .populate("attempts.user", "name avatar");

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    const userBest = {};

    for (const attempt of quiz.attempts) {
      const uid = attempt.user._id.toString();

      if (
        !userBest[uid] ||
        attempt.score > userBest[uid].score
      ) {
        userBest[uid] = {
          userId: uid,
          name: attempt.user.name,
          avatar: attempt.user.avatar,
          score: attempt.score,
          total: attempt.total,
        };
      }
    }

    const leaderboard = Object.values(userBest).sort(
      (a, b) => b.score - a.score
    );

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =====================================================
   GROUP LEADERBOARD
===================================================== */
router.get("/groups/:groupId/leaderboard", protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      group: req.params.groupId,
    }).populate("attempts.user", "name avatar");

    const userStats = {};

    quizzes.forEach((quiz) => {
      quiz.attempts.forEach((attempt) => {
        const uid = attempt.user._id.toString();

        if (!userStats[uid]) {
          userStats[uid] = {
            userId: uid,
            name: attempt.user.name,
            avatar: attempt.user.avatar,
            totalScore: 0,
            quizzesTaken: 0,
          };
        }

        userStats[uid].totalScore += attempt.score;
        userStats[uid].quizzesTaken += 1;
      });
    });

    const leaderboard = Object.values(userStats).sort(
      (a, b) => b.totalScore - a.totalScore
    );

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;