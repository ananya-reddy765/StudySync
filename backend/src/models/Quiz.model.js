// backend/models/Quiz.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ["flashcard", "mcq"], required: true },
  // Flashcard fields
  front: { type: String },
  back: { type: String },
  // MCQ fields
  question: { type: String },
  options: [{ type: String }],
  correctIndex: { type: Number },
});

const attemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    timeTaken: { type: Number }, // seconds
  },
  { timestamps: true }
);

const quizSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    questions: [questionSchema],
    attempts: [attemptSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);