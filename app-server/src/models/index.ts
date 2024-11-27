import user from './user';
import chat from './chat';
import message from './message';
import ai from './ai';

user.userModel.hasMany(chat.chatModel, { as: 'Chats', foreignKey: 'user_id'})

user.userModel.hasMany(ai.aiModel, { as: 'AIModels', foreignKey: 'created_by'})

ai.aiModel.hasMany(chat.chatModel, { foreignKey: 'model_id'})

chat.chatModel.hasMany(message.messageModel, { foreignKey: 'chat_id'})

export default {
  user,
  chat,
  message,
  ai,
}