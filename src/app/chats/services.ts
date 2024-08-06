import sequelize from "../../sequelize";
import AppError from "../utilities/appError";
import { StatusCodes } from "http-status-codes";
import * as chatAssociations from "./association";
import { Op, QueryTypes } from "sequelize";

const { User, Chat, ChatParticipant } = chatAssociations.default;

const queryToGetUniqueChatBetweenTwoUsers = `
  SELECT chats.uuid, chats.title, users."name", users.email
  FROM chat_participants cp1
  JOIN chat_participants cp2 ON cp1.chat_id = cp2.chat_id
  JOIN chats ON chats.id = cp1.chat_id AND chats.id = cp2.chat_id
  JOIN users ON users.id = cp2.user_id
  WHERE cp1.user_id = :userId1 AND cp2.user_id = :userId2
  AND chats.id IN (
      SELECT chat_id
      FROM chat_participants
      GROUP BY chat_id
      HAVING COUNT(user_id) = 2
  ) AND chats."isGroupChat" = FALSE;
`;

const createUniqueChatBetweenTwoUsers = async (
  userId1: number,
  userId2: number
) => {
  const transaction = await sequelize.transaction();

  try {
    // Check if a chat between these two users already exists
    const existingChat = (
      await sequelize.query(queryToGetUniqueChatBetweenTwoUsers, {
        replacements: { userId1, userId2 },
        type: QueryTypes.SELECT,
      })
    )[0];

    if (existingChat) {
      await transaction.rollback();
      return existingChat;
    }

    // Create a new chat
    const newChat = await Chat.create({}, { transaction });

    // Add participants
    await ChatParticipant.bulkCreate(
      [
        { chat_id: newChat.dataValues.id, user_id: userId1 },
        { chat_id: newChat.dataValues.id, user_id: userId2 },
      ],
      { transaction }
    );

    const chat = (
      await sequelize.query(queryToGetUniqueChatBetweenTwoUsers, {
        replacements: { userId1, userId2 },
        type: QueryTypes.SELECT,
      })
    )[0];

    await transaction.commit();
    return chat;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const searchNewChatService = async (email: string) => {
  const user = await User.findOne({
    attributes: { exclude: ["id", "password"] },
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("User not found!", StatusCodes.BAD_REQUEST);
  }

  return user;
};

export const getOrCreateChatService = async (userUuids: [string, string]) => {
  const users = await User.findAll({
    attributes: ["id", "uuid"],
    where: {
      uuid: {
        [Op.in]: userUuids,
      },
    },
  });

  const userId1: number = users[0].dataValues.id;
  const userId2: number = users[1].dataValues.id;

  const data = await createUniqueChatBetweenTwoUsers(userId1, userId2);

  return data;
};
