import express from "express";
import { createBooking } from "../controllers/bookingController.js";
import { userId } from "../middleware/userId.js";

const router = express.Router();

router.route("/").post(userId, createBooking);

export default router;
