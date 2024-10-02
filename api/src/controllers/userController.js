import jwt from "jsonwebtoken";
import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";

const passwordRegex = /^.{8,}$/;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if all required fields are provided
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide all required fields: email, and password");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  // Validate password format
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error(
      "Please provide a valid password with at least 8 characters."
    );
  }

  // Check if user already exists
  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create new user
  const user = await User.create({
    email,
    passwordHash: password,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  const user = await User.findOne({ where: { email } });

  if (user && (await user.comparePassword(password))) {
    res.json({
      id: user.id,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// req.user is set by the protect middleware
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["passwordHash"] },
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const updateUserEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide a new email address");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  const user = await User.findByPk(req.user.id);

  if (user) {
    // Check if the new email is already in use
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists && emailExists.id !== user.id) {
      res.status(400);
      throw new Error("Email address is already in use");
    }

    user.email = email;
    const updatedUser = await user.save();

    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      token: generateToken(updatedUser.id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const updateUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Please provide both old and new passwords");
  }

  // Validate new password format
  if (!passwordRegex.test(newPassword)) {
    res.status(400);
    throw new Error(
      "Please provide a valid new password with at least 8 characters."
    );
  }

  const user = await User.findByPk(req.user.id);

  if (user && (await user.comparePassword(oldPassword))) {
    // Use the beforeCreate hook indirectly by updating the passwordHash
    user.passwordHash = newPassword;
    await user.save();

    res.json({
      message: "Password updated successfully",
    });
  } else {
    res.status(401);
    throw new Error("Invalid old password");
  }
});
