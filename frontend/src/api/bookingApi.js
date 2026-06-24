import api from "./axios";

export const createBooking =
  async (data) => {
    const res =
      await api.post(
        "/bookings",
        data
      );

    return res.data;
  };