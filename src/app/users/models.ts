import sequelize from "../../sequelize";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { titleCase } from "../utilities/formatters";

export const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(val: string) {
        this.setDataValue("email", val.toLowerCase());
      },
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
      },
      set(val: string) {
        this.setDataValue("full_name", titleCase(val));
      },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(val: string) {
        this.setDataValue("password", bcrypt.hash(val, 12));
      },
    },
  },
  {
    paranoid: true,
  }
);
