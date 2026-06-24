// src/api/quizApi.js
import api from "./axios";

// ── Quiz CRUD ──────────────────────────────────────────────
export const createQuiz = (groupId, data) =>
  api.post(`/groups/${groupId}/quizzes`, data);

export const getGroupQuizzes = (groupId) =>
  api.get(`/groups/${groupId}/quizzes`);

export const getQuizById = (quizId) =>
  api.get(`/quizzes/${quizId}`);

export const updateQuiz = (quizId, data) =>
  api.put(`/quizzes/${quizId}`, data);

export const deleteQuiz = (quizId) =>
  api.delete(`/quizzes/${quizId}`);

// ── Attempt / Score ────────────────────────────────────────
export const submitQuizAttempt = (quizId, answers) =>
  api.post(`/quizzes/${quizId}/attempt`, { answers });

export const getQuizLeaderboard = (quizId) =>
  api.get(`/quizzes/${quizId}/leaderboard`);

export const getGroupLeaderboard = (groupId) =>
  api.get(`/groups/${groupId}/leaderboard`);