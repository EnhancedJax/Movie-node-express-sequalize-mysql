import express from "express";
import {
  createMovie,
  deleteMovie,
  getMovie,
  getMovies,
  getMovieWithScreenings,
  updateMovie,
} from "../controllers/movieController.js";

const router = express.Router();

router.route("/").get(getMovies).post(createMovie);
router.route("/:id/screening").get(getMovieWithScreenings);
router.route("/:id").get(getMovie).put(updateMovie).delete(deleteMovie);

export default router;
