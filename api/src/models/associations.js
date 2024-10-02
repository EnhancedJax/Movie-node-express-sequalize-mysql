import Booking from "./booking.js";
import Cinema from "./cinema.js";
import Movie from "./movie.js";
import Screening from "./screening.js";
import Theater from "./theater.js";
import User from "./user.js";

const setupAssociations = () => {
  Movie.hasMany(Screening, { foreignKey: "movieId" });
  Screening.belongsTo(Movie, { foreignKey: "movieId" });

  Theater.hasMany(Screening, { foreignKey: "theaterId" });
  Screening.belongsTo(Theater, { foreignKey: "theaterId" });

  User.hasMany(Booking, { foreignKey: "userId" });
  Booking.belongsTo(User, { foreignKey: "userId" });

  Screening.hasMany(Booking, { foreignKey: "screeningId" });
  Booking.belongsTo(Screening, { foreignKey: "screeningId" });

  Cinema.hasMany(Theater, { foreignKey: "cinemaId" });
  Theater.belongsTo(Cinema, { foreignKey: "cinemaId" });
};

export default setupAssociations;
