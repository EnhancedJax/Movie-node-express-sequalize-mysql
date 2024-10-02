import Cinema from "./models/cinema.js";
import Movie from "./models/movie.js";
import Screening from "./models/screening.js";
import Theater from "./models/theater.js";

export default async function init() {
  console.log("Initializing database");

  // Create cinemas
  const cinemas = await Cinema.bulkCreate([
    { name: "Cinema 1", location: "Location 1" },
    { name: "Cinema 2", location: "Location 2" },
  ]);

  // Create theaters
  const theaters = await Theater.bulkCreate([
    {
      name: "Theater 1",
      cinemaId: 1,
      screenDistance: 10,
      seatLayout: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
    },
    {
      name: "Theater 2",
      cinemaId: 2,
      screenDistance: 15,
      seatLayout: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
    },
  ]);

  // Create movies
  const movies = await Movie.bulkCreate([
    { title: "Movie 1", description: "Description 1", duration: 120 },
    { title: "Movie 2", description: "Description 2", duration: 150 },
  ]);

  // Create screenings
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const screenings = await Screening.bulkCreate([
    {
      movieId: 1,
      theaterId: 1,
      startTime: tomorrow.toISOString().slice(0, 19).replace("T", " "),
      price: 100,
    },
    {
      movieId: 1,
      theaterId: 1,
      startTime: new Date(tomorrow.getTime() + 5.5 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      price: 100,
    },
    {
      movieId: 2,
      theaterId: 2,
      startTime: tomorrow.toISOString().slice(0, 19).replace("T", " "),
      price: 100,
    },
    {
      movieId: 2,
      theaterId: 2,
      startTime: new Date(tomorrow.getTime() + 5.5 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      price: 100,
    },
  ]);
}
