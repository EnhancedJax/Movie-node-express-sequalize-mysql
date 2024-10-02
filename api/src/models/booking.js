import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Screening from "./screening.js";
import User from "./user.js";

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
    screeningId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Screening,
        key: "id",
      },
    },
    seats: {
      type: DataTypes.JSON,
    },
    isViewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

Booking.belongsTo(User, { foreignKey: "userId" });
Booking.belongsTo(Screening, { foreignKey: "screeningId" });

export default Booking;
