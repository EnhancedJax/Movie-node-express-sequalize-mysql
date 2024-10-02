import { api } from "./index";

export const getCinemas = (populate) => {
  return api.get("/cinemas", { params: { populate } });
};

export const getCinemaById = (id) => {
  return api.get(`/cinemas/${id}`);
};

export const createCinema = (cinemaData) => {
  return api.post("/cinemas", cinemaData);
};

export const updateCinema = (id, cinemaData) => {
  return api.put(`/cinemas/${id}`, cinemaData);
};

export const deleteCinema = (id) => {
  return api.delete(`/cinemas/${id}`);
};

export default {
  getCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema,
};
