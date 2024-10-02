import { Op } from "sequelize";
import Cinema from "../models/cinema.js";
import Movie from "../models/movie.js";
import Screening from "../models/screening.js";
import Theater from "../models/theater.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
  const startIndex = (page - 1) * limit;
  const seeAll = req.query.seeAll === "true";

  const { count, rows: movies } = await Movie.findAndCountAll({
    limit: limit,
    offset: startIndex,
    paranoid: !seeAll,
    order: [["createdAt", "DESC"]], // Optional: Order by creation date, newest first
  });

  const totalPages = Math.ceil(count / limit);

  res.json({
    items: movies,
    currentPage: page,
    totalPages,
    totalItems: count,
    itemsPerPage: limit,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  });
});

export const getMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByPk(req.params.id);
  if (!movie) {
    res.status(404).json({ message: "Movie not found" });
  } else {
    res.json(movie);
  }
});

export const createMovie = asyncHandler(async (req, res) => {
  const { title, description, duration, releaseDate } = req.body;
  const movie = await Movie.create({
    title,
    description,
    duration,
    releaseDate,
  });
  res.status(201).json(movie);
});

export const updateMovie = asyncHandler(async (req, res) => {
  const { title, description, duration, releaseDate } = req.body;
  const movie = await Movie.findByPk(req.params.id);
  if (!movie) {
    res.status(404).json({ message: "Movie not found" });
  } else {
    await movie.update({ title, description, duration, releaseDate });
    res.json(movie);
  }
});
export const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByPk(req.params.id);
  if (!movie) {
    res.status(404).json({ message: "Movie not found" });
  } else {
    await movie.destroy();
    res.status(200).json({ message: "Movie deleted successfully" });
  }
});

export const getMovieWithScreenings = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { daysFromNow } = req.query;

  if (daysFromNow === undefined || !/^\d+$/.test(daysFromNow)) {
    res.status(400);
    throw new Error(
      "Invalid daysFromNow parameter. Please provide a non-negative integer."
    );
  }

  const movie = await Movie.findByPk(id);

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + parseInt(daysFromNow));

  const screenings = await Screening.findAll({
    where: {
      movieId: id,
      startTime: {
        [Op.gte]: now,
        [Op.lt]: endDate,
      },
    },
    include: [
      {
        model: Theater,
        attributes: ["name"],
        include: [
          {
            model: Cinema,
            attributes: ["id", "name", "location", "lat", "lng"],
          },
        ],
      },
    ],
  });

  const cinemaMap = new Map();

  screenings.forEach((screening) => {
    const cinema = screening.Theater.Cinema;
    if (!cinemaMap.has(cinema.id)) {
      cinemaMap.set(cinema.id, {
        id: cinema.id,
        name: cinema.name,
        location: cinema.location,
        lat: cinema.lat,
        lng: cinema.lng,
        screenings: {
          count: 0,
          items: [],
        },
      });
    }

    const cinemaData = cinemaMap.get(cinema.id);
    cinemaData.screenings.count++;
    cinemaData.screenings.items.push({
      id: screening.id,
      startTime: screening.startTime,
      price: screening.price,
      remainingPercentage: screening.remainingPercentage,
      Theater: {
        name: screening.Theater.name,
      },
    });
  });

  const result = {
    id: movie.id,
    title: movie.title,
    description: movie.description,
    duration: movie.duration,
    releaseDate: movie.releaseDate,
    cinemas: {
      count: cinemaMap.size,
      items: Array.from(cinemaMap.values()),
    },
  };

  res.json(result);
});
