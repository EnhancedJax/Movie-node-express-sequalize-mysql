import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Theater = sequelize.define(
  "Theater",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
    },
    screenDistance: {
      type: DataTypes.INTEGER,
    },
    seatLayout: {
      type: DataTypes.JSON,
    },
    cinemaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "cinemas",
        key: "id",
      },
    },
    pictureURL: {
      type: DataTypes.STRING(255),
    },
  },
  {
    paranoid: true,
    tableName: "theaters",
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

export default Theater;
