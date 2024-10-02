import express from "express";
import {
  createTheater,
  deleteTheater,
  getTheaterById,
  getTheaters,
  updateTheater,
} from "../controllers/theaterController.js";

const router = express.Router();

router.route("/").post(createTheater).get(getTheaters);

router
  .route("/:id")
  .get(getTheaterById)
  .put(updateTheater)
  .delete(deleteTheater);

export default router;
