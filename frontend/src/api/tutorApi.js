import api from "./axios";

// Get all tutors
export const getTutors = async () => {
  const { data } = await api.get("/tutors");
  return data;
};

// Get one tutor
export const getTutorById = async (id) => {
  const { data } = await api.get(`/tutors/${id}`);
  return data;
};

// Create tutor profile
export const createTutor = async (tutorData) => {
  const { data } = await api.post(
    "/tutors",
    tutorData
  );

  return data;
};