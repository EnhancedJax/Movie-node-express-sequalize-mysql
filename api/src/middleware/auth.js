import jwt from "jsonwebtoken";
import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token has expired
    if (Date.now() >= decoded.exp * 1000) {
      res.status(401);
      throw new Error("Token has expired");
    }

    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401);
      throw new Error("Token has expired");
    } else {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
});
