import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // Set to console.log to see the generated SQL queries
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database successfully");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  });

export default sequelize;
