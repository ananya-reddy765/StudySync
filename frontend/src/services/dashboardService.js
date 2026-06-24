import api from "../api/axios";

export const getDashboardData = async () => {
  const { data } = await api.get("/dashboard");
  return data;
};

export const createNote = async (noteData) => {
  const { data } = await api.post("/notes", noteData);
  return data.data;
};

export const deleteNote = async (id) => {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
};