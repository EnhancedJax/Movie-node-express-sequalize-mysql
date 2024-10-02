import express from "express";
import {
  createCinema,
  deleteCinema,
  getCinema,
  getCinemas,
  updateCinema,
} from "../controllers/cinemaController.js";

const router = express.Router();

router.route("/").get(getCinemas).post(createCinema);

router.route("/:id").get(getCinema).put(updateCinema).delete(deleteCinema);

export default router;
