import { api } from "./index";

export const getMovies = (page = 1, limit = 10, seeAll = false) => {
  return api.get("/movies", { params: { page, limit, seeAll } });
};

export const getMovieById = (id) => {
  return api.get(`/movies/${id}`);
};

export const createMovie = (movieData) => {
  return api.post("/movies", movieData);
};

export const updateMovie = (id, movieData) => {
  return api.put(`/movies/${id}`, movieData);
};

export const deleteMovie = (id) => {
  return api.delete(`/movies/${id}`);
};

export const getMovieWithScreenings = (id, daysFromNow) => {
  return api.get(`/movies/${id}/screening`, { params: { daysFromNow } });
};

export default {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieWithScreenings,
};
