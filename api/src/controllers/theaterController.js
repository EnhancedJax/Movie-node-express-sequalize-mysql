import Theater from "../models/theater.js";
import asyncHandler from "../utils/asyncHandler.js";

const validateSeatLayout = (seatLayout) => {
  if (!Array.isArray(seatLayout) || seatLayout.length === 0) {
    throw new Error("Seat layout must be a non-empty array of arrays");
  }

  const rowLength = seatLayout[0].length;
  let capacity = 0;
  let disabledSeats = 0;

  for (const row of seatLayout) {
    if (!Array.isArray(row) || row.length !== rowLength) {
      throw new Error("All rows in seat layout must have the same length");
    }

    for (const seat of row) {
      if (![0, 1, 2].includes(seat)) {
        throw new Error("Seat values must be 0, 1, or 2");
      }
      if (seat !== 0) capacity++;
      if (seat === 2) disabledSeats++;
    }
  }

  return { capacity, disabledSeats };
};

export const createTheater = asyncHandler(async (req, res) => {
  const { name, cinemaId, screenDistance, seatLayout } = req.body;

  if (!name || !cinemaId || !screenDistance || !seatLayout) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const { capacity, disabledSeats } = validateSeatLayout(seatLayout);

  const theater = await Theater.create({
    name,
    cinemaId,
    capacity,
    screenDistance,
    seatLayout,
  });

  res.status(201).json({
    ...theater.toJSON(),
    disabledSeats,
  });
});

export const getTheaters = asyncHandler(async (req, res) => {
  const { cinemaId } = req.query;

  let theaters;
  if (cinemaId) {
    theaters = await Theater.findAll({ where: { cinemaId } });
  } else {
    theaters = await Theater.findAll();
  }

  res.json(theaters);
});

export const getTheaterById = asyncHandler(async (req, res) => {
  const theater = await Theater.findByPk(req.params.id);
  if (theater) {
    const { capacity, disabledSeats } = validateSeatLayout(theater.seatLayout);
    res.json({
      ...theater.toJSON(),
      capacity,
      disabledSeats,
    });
  } else {
    res.status(404);
    throw new Error("Theater not found");
  }
});

export const updateTheater = asyncHandler(async (req, res) => {
  const theater = await Theater.findByPk(req.params.id);

  if (!theater) {
    res.status(404);
    throw new Error("Theater not found");
  }

  const { name, cinemaId, screenDistance, seatLayout } = req.body;

  if (seatLayout) {
    const { capacity, disabledSeats } = validateSeatLayout(seatLayout);
    theater.capacity = capacity;
    theater.seatLayout = seatLayout;
  }

  if (name) theater.name = name;
  if (cinemaId) theater.cinemaId = cinemaId;
  if (screenDistance) theater.screenDistance = screenDistance;

  await theater.save();

  const updatedTheater = await Theater.findByPk(req.params.id);
  const { capacity, disabledSeats } = validateSeatLayout(
    updatedTheater.seatLayout
  );

  res.json({
    ...updatedTheater.toJSON(),
    capacity,
    disabledSeats,
  });
});

export const deleteTheater = asyncHandler(async (req, res) => {
  const theater = await Theater.findByPk(req.params.id);

  if (!theater) {
    res.status(404);
    throw new Error("Theater not found");
  }

  await theater.destroy();
  res.json({ message: "Theater removed" });
});
