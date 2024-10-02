import sequelize from "../config/database.js";
import Booking from "../models/booking.js";
import Movie from "../models/movie.js";
import Screening from "../models/screening.js";
import Theater from "../models/theater.js";
import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";

const validateSeat = (seat, seatLayout) => {
  // Check if seat is in the correct format (e.g., 'A1', 'B2', etc.)
  const seatRegex = /^[A-Z]\d+$/;
  if (!seatRegex.test(seat)) {
    throw new Error(
      "Invalid seat format. It should be a letter followed by a number (e.g., 'A1')"
    );
  }

  const row = seat.charCodeAt(0) - 65; // Convert A to 0, B to 1, etc.
  const col = parseInt(seat.slice(1)) - 1; // Convert seat number to 0-based index

  // Check if row is within the seat layout
  if (row < 0 || row >= seatLayout.length) {
    throw new Error("Invalid row");
  }

  const rowLength = seatLayout[row].filter((seat) => seat !== 0).length;

  // Check if column is within the row's length
  if (col < 0 || col >= rowLength) {
    throw new Error("Invalid seat number");
  }

  return true;
};

export const createBooking = asyncHandler(async (req, res) => {
  const { screeningId, seats } = req.body;
  const userId = req?.user?.id;

  // Validate input
  if (!screeningId || !seats || !Array.isArray(seats) || seats.length === 0) {
    res.status(400);
    throw new Error(
      "Please provide screeningId and a non-empty array of seats"
    );
  }

  // Check if screening exists and get associated theater
  const screening = await Screening.findByPk(screeningId, {
    include: [{ model: Theater, attributes: ["id", "seatLayout", "capacity"] }],
  });
  if (!screening) {
    res.status(404);
    throw new Error("Screening not found");
  }

  // Validate each seat
  for (const seat of seats) {
    try {
      validateSeat(seat, screening.Theater.seatLayout);
    } catch (error) {
      res.status(400);
      throw new Error(`Invalid seat ${seat}: ${error.message}`);
    }
  }

  // Check if user exists (if userId is provided)
  if (userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
  }

  // Check if any of the seats are already booked
  const existingBookings = await Booking.findAll({
    where: { screeningId },
    attributes: ["seats"],
  });

  const bookedSeats = existingBookings.flatMap((booking) => booking.seats);
  const requestedSeats = new Set(seats);

  const alreadyBookedSeats = bookedSeats.filter((seat) =>
    requestedSeats.has(seat)
  );

  if (alreadyBookedSeats.length > 0) {
    res.status(400);
    throw new Error(
      `The following seats are already booked: ${alreadyBookedSeats.join(", ")}`
    );
  }

  const booking = await Booking.create({
    userId: userId || null,
    screeningId,
    seats,
  });

  // Update the remainingPercentage of the screening
  const bookedSeatsCount = await Booking.findAll({
    where: { screeningId },
    attributes: [
      [
        sequelize.fn(
          "SUM",
          sequelize.fn("JSON_LENGTH", sequelize.col("seats"))
        ),
        "totalSeats",
      ],
    ],
    raw: true,
  });

  const totalBookedSeats = bookedSeatsCount[0].totalSeats || 0;
  const totalSeats = screening.Theater.capacity;
  const remainingPercentage = Math.max(
    0,
    Math.floor((1 - totalBookedSeats / totalSeats) * 100)
  );

  await screening.update({ remainingPercentage });

  const createdBooking = await Booking.findByPk(booking.id, {
    include: [
      { model: User, attributes: ["id", "email"] },
      {
        model: Screening,
        attributes: ["id", "startTime"],
        include: [
          { model: Movie, attributes: ["id", "title"] },
          { model: Theater, attributes: ["id", "name"] },
        ],
      },
    ],
  });

  res.status(201).json(createdBooking);
});
