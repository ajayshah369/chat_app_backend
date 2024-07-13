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
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: RegExp(/^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,2}$/),
      },
      set(val: string) {
        this.setDataValue("name", titleCase(val));
      },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    paranoid: true,
  }
);

User.addHook("beforeCreate", async (user, options) => {
  user.dataValues.password = await bcrypt.hash(user.dataValues.password, 12);
});

User.addHook("beforeUpdate", async (user, options) => {
  if (user.dataValues.password) {
    user.dataValues.password = await bcrypt.hash(user.dataValues.password, 12);
  }
});
