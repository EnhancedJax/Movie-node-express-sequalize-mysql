import { api } from "./index";

export const getScreenings = (
  populate,
  theaterId,
  startOfWeek,
  page = 1,
  limit = 100
) => {
  return api.get("/screenings", {
    params: { page, limit, populate, theaterId, startOfWeek },
  });
};

export const getScreeningById = (id, populate) => {
  return api.get(`/screenings/${id}`, { params: { populate } });
};

export const createScreening = (screeningData) => {
  return api.post("/screenings", screeningData);
};

export const updateScreening = (id, screeningData) => {
  return api.put(`/screenings/${id}`, screeningData);
};

export const deleteScreening = (id) => {
  return api.delete(`/screenings/${id}`);
};

export default {
  getScreenings,
  getScreeningById,
  createScreening,
  updateScreening,
  deleteScreening,
};
