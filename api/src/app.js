import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import sequelize from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import setupAssociations from "./models/associations.js";
import bookingRoutes from "./routes/bookings.js";
import cinemaRoutes from "./routes/cinemas.js";
import movieRoutes from "./routes/movies.js";
import screeningRoutes from "./routes/screenings.js";
import theaterRoutes from "./routes/theaters.js";
import userRoutes from "./routes/users.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/theaters", theaterRoutes);
app.use("/api/cinemas", cinemaRoutes);
app.use("/api/screenings", screeningRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Sync Sequelize models with the database
setupAssociations();
sequelize
  .sync({ alter: true }) // Use { force: true } to drop and recreate tables (be careful in production)
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
