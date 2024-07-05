import sequelize from "../../sequelize";
import { DataTypes } from "sequelize";

import { User } from "../users/models";

export const Chat = sequelize.define(
  "chat",
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
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isGroupChat: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    paranoid: true,
  }
);

export const ChatParticipant = sequelize.define(
  "chat_participant",
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Chat,
        key: "id",
      },
    },
  },
  {
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "chat_id"],
      },
    ],
  }
);
