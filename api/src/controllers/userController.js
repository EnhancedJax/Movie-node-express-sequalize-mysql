import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Booking from "../models/booking.js";
import Movie from "../models/movie.js";
import Screening from "../models/screening.js";
import Theater from "../models/theater.js";
import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";

const passwordRegex = /^.{8,}$/;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const comparePassword = (password, passwordHash) => {
  return bcrypt.compareSync(password, passwordHash);
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

  if (user && comparePassword(password, user.passwordHash)) {
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
    include: [
      {
        model: Booking,
        where: { isViewed: false },
        required: false,
        include: [
          {
            model: Screening,
            include: [
              { model: Movie, paranoid: false },
              { model: Theater, paranoid: false },
            ],
          },
        ],
      },
    ],
  });

  if (user) {
    const bookings = user.Bookings || [];
    const formattedBookings = bookings.map((booking) => ({
      ...booking.toJSON(),
      Screening: booking.Screening
        ? {
            id: booking.Screening.id,
            startTime: booking.Screening.startTime,
            Movie: {
              id: booking.Screening.Movie.id,
              title: booking.Screening.Movie.title,
            },
            Theater: {
              id: booking.Screening.Theater.id,
              name: booking.Screening.Theater.name,
            },
          }
        : null,
    }));

    res.json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      bookings: {
        items: formattedBookings,
        count: formattedBookings.length,
      },
    });
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

  if (user && comparePassword(oldPassword, user.passwordHash)) {
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
