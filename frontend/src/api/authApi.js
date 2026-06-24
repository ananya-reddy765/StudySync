import api from "./axios";

export const loginUser = (credentials) => {
  return api.post("/auth/login", credentials);
};

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const getProfile = () => {
  return api.get("/users/me");
};