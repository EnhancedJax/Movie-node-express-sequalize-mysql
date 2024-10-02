import { api } from "./index";

export const getTheaters = () => {
  return api.get("/theaters");
};

export const getTheaterById = (id) => {
  return api.get(`/theaters/${id}`);
};

export const createTheater = (theaterData) => {
  return api.post("/theaters", theaterData);
};

export const updateTheater = (id, theaterData) => {
  return api.put(`/theaters/${id}`, theaterData);
};

export const deleteTheater = (id) => {
  return api.delete(`/theaters/${id}`);
};

export default {
  getTheaters,
  getTheaterById,
  createTheater,
  updateTheater,
  deleteTheater,
};
