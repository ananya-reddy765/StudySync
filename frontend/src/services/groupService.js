import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Groups ────────────────────────────────────────────────────────────────────

export const getGroups = async () => {
  const { data } = await API.get("/groups");
  return data;
};

export const getGroupById = async (id) => {
  const { data } = await API.get(`/groups/${id}`);
  return data;
};

export const createGroup = async ({ name, description, category }) => {
  const { data } = await API.post("/groups", { name, description, category });
  return data;
};

export const joinGroup = async (inviteCode) => {
  const { data } = await API.post(`/groups/join/${inviteCode}`);
  return data;
};

// ── Resources ─────────────────────────────────────────────────────────────────

export const getResources = async (groupId) => {
  const { data } = await API.get(`/groups/${groupId}/resources`);
  return data;
};

export const uploadResource = async (groupId, formData) => {
  const { data } = await API.post(`/groups/${groupId}/resources`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteResource = async (groupId, resourceId) => {
  const { data } = await API.delete(`/groups/${groupId}/resources/${resourceId}`);
  return data;
};