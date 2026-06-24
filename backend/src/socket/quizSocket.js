const Score = require('../models/Score');
const Quiz = require('../models/Quiz.model');

// In-memory tracking of who is in which group room, for presence + live leaderboard pushes
const groupPresence = new Map(); // groupId -> Set of { socketId, userId, username }

function addPresence(groupId, entry) {
  if (!groupPresence.has(groupId)) groupPresence.set(groupId, new Map());
  groupPresence.get(groupId).set(entry.socketId, entry);
}

function removePresence(groupId, socketId) {
  const room = groupPresence.get(groupId);
  if (room) room.delete(socketId);
}

function presenceList(groupId) {
  const room = groupPresence.get(groupId);
  return room ? Array.from(room.values()) : [];
}

module.exports = function registerQuizSockets(io) {
  io.on('connection', (socket) => {
    socket.on('join_group', ({ groupId, userId, username }) => {
      socket.join(groupId);
      addPresence(groupId, { socketId: socket.id, userId, username });
      io.to(groupId).emit('presence_update', presenceList(groupId));
    });

    socket.on('leave_group', ({ groupId }) => {
      socket.leave(groupId);
      removePresence(groupId, socket.id);
      io.to(groupId).emit('presence_update', presenceList(groupId));
    });

    // Host starts a quiz session for the group; broadcasts so everyone can join in
    socket.on('start_quiz', async ({ groupId, quizId, hostId }) => {
      const quiz = await Quiz.findById(quizId).lean();
      if (!quiz) return socket.emit('error_message', { error: 'Quiz not found' });
      io.to(groupId).emit('quiz_started', { quizId, title: quiz.title, hostId, startedAt: Date.now() });
    });

    // A player submits their finished attempt; persist and push updated leaderboard
    socket.on('submit_score', async (payload) => {
      try {
        const { groupId, quizId, userId, username, score, correctCount, totalQuestions, timeTakenMs } = payload;
        await Score.create({ groupId, quizId, userId, username, score, correctCount, totalQuestions, timeTakenMs });

        const leaderboard = await Score.aggregate([
          { $match: { groupId, quizId } },
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

        io.to(groupId).emit('leaderboard_update', { quizId, leaderboard });
        socket.emit('score_submitted', { ok: true });
      } catch (err) {
        socket.emit('error_message', { error: err.message });
      }
    });

    socket.on('disconnect', () => {
      for (const groupId of groupPresence.keys()) {
        if (groupPresence.get(groupId).has(socket.id)) {
          removePresence(groupId, socket.id);
          io.to(groupId).emit('presence_update', presenceList(groupId));
        }
      }
    });
  });
};
