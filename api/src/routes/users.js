import express from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserEmail,
  updateUserPassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/update-email", protect, updateUserEmail);
router.put("/update-password", protect, updateUserPassword);

export default router;
