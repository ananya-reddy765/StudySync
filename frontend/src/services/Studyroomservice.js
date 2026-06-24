// src/services/studyRoomService.js
import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000" });

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Get all study rooms for the current user's groups
export const getMyStudyRooms = () =>
  API.get("/api/study-rooms").then((r) => r.data);

// Request a new study room (any group member)
export const requestStudyRoom = (groupId, roomName, description) =>
  API.post("/api/study-rooms/request", { groupId, roomName, description }).then((r) => r.data);

// Get pending requests for a group (admin only)
export const getPendingRequests = (groupId) =>
  API.get(`/api/study-rooms/requests/${groupId}`).then((r) => r.data);

// Approve a request (admin only)
export const approveRequest = (requestId) =>
  API.patch(`/api/study-rooms/requests/${requestId}/approve`).then((r) => r.data);

// Reject a request (admin only)
export const rejectRequest = (requestId) =>
  API.patch(`/api/study-rooms/requests/${requestId}/reject`).then((r) => r.data);

// Delete (deactivate) a study room (admin only)
export const deleteStudyRoom = (roomId) =>
  API.delete(`/api/study-rooms/${roomId}`).then((r) => r.data);