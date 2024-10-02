import { api } from "./index";

export const createBooking = (bookingData) => {
  return api.post("/bookings", bookingData);
};

export default {
  createBooking,
};
