import { User } from "../users/models";
import { Chat, ChatParticipant } from "./models";

User.belongsToMany(Chat, { through: ChatParticipant, foreignKey: "user_id" });
Chat.belongsToMany(User, { through: ChatParticipant, foreignKey: "chat_id" });

export default { User, Chat, ChatParticipant };
