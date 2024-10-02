import express from "express";
import { createBooking } from "../controllers/bookingController.js";

const router = express.Router();

router.route("/").post(createBooking);

export default router;
