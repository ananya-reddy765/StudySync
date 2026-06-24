import api from "../api/axios";

// Dashboard Data
export const getDashboardData = async () => {
  try {
    const response = await api.get("/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      overview: {
        groupsJoined: 0,
        questsCompleted: 0,
        studyRoomsJoined: 0,
      },
      tasks: [],
      notes: [],
      aiPlan: [],
      calendarEvents: [],
      weeklyPerformance: [],
    };
  }
};

// Notes
export const createNote = async (noteData) => {
  try {
    const response = await api.post("/notes", noteData);
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export const deleteNote = async (id) => {
  try {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};