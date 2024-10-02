import Cinema from "../models/cinema.js";
import Theater from "../models/theater.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCinemas = asyncHandler(async (req, res) => {
  const { populate } = req.query;
  const includeTheaters = populate === "Theaters";

  const options = {
    order: [["createdAt", "DESC"]],
  };

  if (includeTheaters) {
    options.include = [
      {
        model: Theater,
        attributes: ["id", "name", "capacity", "screenDistance", "seatLayout"],
      },
    ];
  }

  const cinemasRaw = await Cinema.findAll(options);

  const cinemas = cinemasRaw.map((cinema) => {
    const cinemaJSON = cinema.toJSON();
    const result = {
      ...cinemaJSON,
    };

    if (includeTheaters) {
      result.theaters = {
        items: cinemaJSON.Theaters,
        count: cinemaJSON.Theaters.length,
      };
      delete result.Theaters;
    }

    return result;
  });

  res.json({
    items: cinemas,
    count: cinemas.length,
  });
});

export const getCinema = asyncHandler(async (req, res) => {
  const cinema = await Cinema.findByPk(req.params.id);
  if (!cinema) {
    res.status(404);
    throw new Error("Cinema not found");
  }
  res.json(cinema);
});

export const createCinema = asyncHandler(async (req, res) => {
  const { name, location, lat, lng } = req.body;
  const cinema = await Cinema.create({ name, location, lat, lng });
  res.status(201).json(cinema);
});

export const updateCinema = asyncHandler(async (req, res) => {
  const { name, location, lat, lng } = req.body;
  const cinema = await Cinema.findByPk(req.params.id);
  if (!cinema) {
    res.status(404);
    throw new Error("Cinema not found");
  }
  await cinema.update({ name, location, lat, lng });
  res.json(cinema);
});

export const deleteCinema = asyncHandler(async (req, res) => {
  const cinema = await Cinema.findByPk(req.params.id);
  if (!cinema) {
    res.status(404);
    throw new Error("Cinema not found");
  }
  await cinema.destroy();
  res.status(204).end();
});
