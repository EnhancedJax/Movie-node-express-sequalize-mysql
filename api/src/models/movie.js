import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Movie = sequelize.define(
  "Movie",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    releaseDate: {
      type: DataTypes.DATEONLY,
    },
    posterURL: {
      type: DataTypes.STRING(255),
    },
    splashURL: {
      type: DataTypes.STRING(255),
    },
  },
  {
    paranoid: true,
    tableName: "movies",
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

export default Movie;
