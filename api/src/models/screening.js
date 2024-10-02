import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Screening = sequelize.define(
  "Screening",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    movieId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    theaterId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    remainingPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
  },
  {
    tableName: "screenings",
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

export default Screening;
