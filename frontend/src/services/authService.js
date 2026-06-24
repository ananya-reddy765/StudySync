import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const authAPI = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (userData) => {
  const response = await authAPI.post(
    "/register",
    userData
  );

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await authAPI.post(
    "/login",
    userData
  );

  return response.data;
};

export const getProfile = async () => {
  const token =
    localStorage.getItem("token");

  const response = await authAPI.get(
    "/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};