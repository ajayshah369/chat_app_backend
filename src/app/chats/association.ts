import { User } from "../users/models";
import { Chat, ChatParticipant } from "./models";

User.belongsToMany(Chat, { through: ChatParticipant });
Chat.belongsToMany(User, { through: ChatParticipant });

export default { User, Chat, ChatParticipant };
