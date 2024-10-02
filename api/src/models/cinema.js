import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Cinema = sequelize.define(
  "Cinema",
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
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lat: {
      type: DataTypes.FLOAT,
    },
    lng: {
      type: DataTypes.FLOAT,
    },
  },
  {
    paranoid: true,
    tableName: "cinemas",
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

export default Cinema;
