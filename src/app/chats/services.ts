import sequelize from "../../sequelize";
import AppError from "../utilities/appError";
import { StatusCodes } from "http-status-codes";
import * as chatAssociations from "./association";

const { User, Chat, ChatParticipant } = chatAssociations.default;

export const createUniqueChatBetweenTwoUsers = async (
  userId1: number,
  userId2: number
) => {
  const transaction = await sequelize.transaction();

  try {
    // Check if a chat between these two users already exists
    const existingChat = await Chat.findOne({
      include: [
        {
          model: User,
          where: {
            id: [userId1, userId2],
          },
        },
      ],
      group: ["chats.id"],
      having: sequelize.literal("COUNT(users.id) = 2"),
    });

    if (existingChat) {
      await transaction.rollback();
      return existingChat;
    }

    // Create a new chat
    const chat = await Chat.create({}, { transaction });

    // Add participants
    await ChatParticipant.bulkCreate(
      [
        { chatId: chat.dataValues.id, user_id: userId1 },
        { chatId: chat.dataValues.id, user_id: userId2 },
      ],
      { transaction }
    );

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
