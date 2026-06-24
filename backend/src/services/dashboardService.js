import Group from "../models/Group.js";
import Quiz from "../models/Quiz.model.js";
import StudyRoom from "../models/StudyRoom.js";
import Note from "../models/Note.js";

const dashboardService = {
  async getDashboardData(userId) {
    try {
      // Groups where user is creator OR member
      const groupsJoined = await Group.countDocuments({
        $or: [
          { createdBy: userId },
          { members: userId },
        ],
      });

      // StudyRoom has no members array — only createdBy
      // So count rooms the user created
      const studyRoomsJoined = await StudyRoom.countDocuments({
        createdBy: userId,
      });

      const quizzes = await Quiz.find({ "attempts.user": userId });
      let questsCompleted = 0;
      quizzes.forEach((quiz) => {
        questsCompleted += quiz.attempts.filter(
          (a) => a.user.toString() === userId.toString()
        ).length;
      });

      const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });

      return {
        overview: { groupsJoined, questsCompleted, studyRoomsJoined },
        tasks: [],
        notes,
        aiPlan: [
          "Complete pending tasks",
          "Join a study room",
          "Practice quizzes",
        ],
        weeklyPerformance: [
          { day: "Mon", hours: 0 },
          { day: "Tue", hours: 0 },
          { day: "Wed", hours: 0 },
          { day: "Thu", hours: 0 },
          { day: "Fri", hours: 0 },
          { day: "Sat", hours: 0 },
          { day: "Sun", hours: 0 },
        ],
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default dashboardService;