import api from "./axios";

export const requestTutorRole =
  async () => {
    const { data } =
      await api.post(
        "/tutor-request/request"
      );

    return data;
  };

export const getTutorRequests =
  async () => {
    const { data } =
      await api.get(
        "/admin/tutor-requests"
      );

    return data;
  };

export const approveTutor =
  async (id) => {
    const { data } =
      await api.put(
        `/admin/approve/${id}`
      );

    return data;
  };

export const rejectTutor =
  async (id) => {
    const { data } =
      await api.put(
        `/admin/reject/${id}`
      );

    return data;
  };