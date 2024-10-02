import express from "express";
import {
  createScreening,
  deleteScreening,
  getScreening,
  getScreenings,
  updateScreening,
} from "../controllers/screeningController.js";

const router = express.Router();

router.route("/").get(getScreenings).post(createScreening);

router
  .route("/:id")
  .get(getScreening)
  .put(updateScreening)
  .delete(deleteScreening);

export default router;
