import { Op } from "sequelize";
import Booking from "../models/booking.js";
import Movie from "../models/movie.js";
import Screening from "../models/screening.js";
import Theater from "../models/theater.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getScreenings = asyncHandler(async (req, res) => {
  const { populate, theaterId, startOfWeek } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;

  const options = {
    limit: limit,
    offset: startIndex,
    order: [["startTime", "ASC"]],
    attributes: [
      "id",
      "movieId",
      "theaterId",
      "startTime",
      "price",
      "remainingPercentage",
    ],
    where: {},
  };

  if (theaterId) {
    options.where.theaterId = theaterId;
  }

  if (startOfWeek) {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    options.where.startTime = {
      [Op.between]: [new Date(startOfWeek), endOfWeek],
    };
  }

  if (populate === "Movie" || populate === "Theater") {
    options.include = [];
    if (populate === "Movie") {
      options.include.push({ model: Movie, paranoid: false });
    }
    if (populate === "Theater") {
      options.include.push({ model: Theater, paranoid: false });
    }
  }

  const { count, rows: screenings } = await Screening.findAndCountAll(options);

  const totalPages = Math.ceil(count / limit);

  const formattedScreenings = screenings.map((screening) => {
    const screeningData = screening.toJSON();
    if (populate === "Movie" && screeningData.Movie) {
      screeningData.Movie = screeningData.Movie;
    } else {
      delete screeningData.Movie;
    }
    if (populate === "Theater" && screeningData.Theater) {
      screeningData.Theater = screeningData.Theater;
    } else {
      delete screeningData.Theater;
    }
    return screeningData;
  });

  res.json({
    items: formattedScreenings,
    currentPage: page,
    totalPages,
    totalItems: count,
    itemsPerPage: limit,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  });
});

export const getScreening = asyncHandler(async (req, res) => {
  const { populate } = req.query;
  const options = {
    attributes: [
      "id",
      "movieId",
      "theaterId",
      "startTime",
      "price",
      "remainingPercentage",
    ],
    include: [
      { model: Booking, attributes: ["seats"] },
      {
        model: Theater,
        attributes: ["name", "capacity", "screenDistance", "pictureURL"],
      },
    ],
  };

  if (populate === "Movie") {
    options.include.push({ model: Movie });
  }

  if (populate === "Theater") {
    options.include[1].attributes.push("seatLayout");
  }

  const screening = await Screening.findByPk(req.params.id, options);

  if (!screening) {
    res.status(404);
    throw new Error("Screening not found");
  }

  const screeningData = screening.toJSON();

  let markedSeatLayout = null;
  if (screeningData.Theater && screeningData.Theater.seatLayout) {
    const seatLayout = JSON.parse(
      JSON.stringify(screeningData.Theater.seatLayout)
    );
    const bookings = screeningData.Bookings;

    // Create a map to convert seat numbers to row and column indices
    const seatMap = new Map();
    for (let i = 0; i < seatLayout.length; i++) {
      let seatNumber = 1;
      for (let j = 0; j < seatLayout[i].length; j++) {
        if (seatLayout[i][j] !== 0) {
          seatMap.set(`${String.fromCharCode(65 + i)}${seatNumber}`, {
            row: i,
            col: j,
          });
          seatNumber++;
        }
      }
    }

    // Mark booked seats
    bookings.forEach((booking) => {
      booking.seats.forEach((seat) => {
        const seatPosition = seatMap.get(seat);
        if (seatPosition) {
          const { row, col } = seatPosition;
          seatLayout[row][col] = 3;
        }
      });
    });

    markedSeatLayout = seatLayout;
  }

  delete screeningData.Bookings;

  if (populate !== "Movie") {
    delete screeningData.Movie;
  }

  if (populate !== "Theater") {
    delete screeningData.Theater;
  } else if (screeningData.Theater) {
    delete screeningData.Theater.seatLayout;
  }

  // Add markedSeatLayout to the main response
  screeningData.markedSeatLayout = markedSeatLayout;

  res.json(screeningData);
});

export const createScreening = asyncHandler(async (req, res) => {
  const screeningData = Array.isArray(req.body) ? req.body : [req.body];

  const createdScreenings = [];

  for (const { movieId, theaterId, startTime, price } of screeningData) {
    // Validate input
    if (!movieId || !theaterId || !startTime || price === undefined) {
      res.status(400);
      throw new Error(
        "Please provide movieId, theaterId, startTime, and price for all screenings"
      );
    }

    // Check if movie and theater exist
    const movie = await Movie.findByPk(movieId);
    const theater = await Theater.findByPk(theaterId);

    if (!movie || !theater) {
      res.status(404);
      throw new Error(`Movie (${movieId}) or Theater (${theaterId}) not found`);
    }

    const screening = await Screening.create({
      movieId,
      theaterId,
      startTime,
      price,
    });
    createdScreenings.push(screening);
  }

  res
    .status(201)
    .json(Array.isArray(req.body) ? createdScreenings : createdScreenings[0]);
});

export const updateScreening = asyncHandler(async (req, res) => {
  const { movieId, theaterId, startTime, price } = req.body;
  const screening = await Screening.findByPk(req.params.id);

  if (!screening) {
    res.status(404);
    throw new Error("Screening not found");
  }

  // Check if movie and theater exist if they're being updated
  if (movieId) {
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      res.status(404);
      throw new Error("Movie not found");
    }
  }

  if (theaterId) {
    const theater = await Theater.findByPk(theaterId);
    if (!theater) {
      res.status(404);
      throw new Error("Theater not found");
    }
  }

  if (price !== undefined) {
    await screening.update({ price });
  }

  await screening.update({ movieId, theaterId, startTime });

  const updatedScreening = await Screening.findByPk(req.params.id, {
    attributes: [
      "id",
      "movieId",
      "theaterId",
      "startTime",
      "price",
      "remainingPercentage",
    ],
  });

  res.json(updatedScreening);
});

export const deleteScreening = asyncHandler(async (req, res) => {
  const screening = await Screening.findByPk(req.params.id);
  if (!screening) {
    res.status(404);
    throw new Error("Screening not found");
  }
  await screening.destroy();
  res.status(204).end();
});
