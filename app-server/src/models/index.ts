import transaction from './transaction';
import user from './user';
import chat from './chat';
import message from './message';
import job from './job';
import ai from './ai';

user.userModel.hasMany(chat.chatModel, { as: 'Chats', foreignKey: 'user_id'})

user.userModel.hasMany(ai.aiModel, { as: 'Models', foreignKey: 'created_by'})

ai.aiModel.hasMany(chat.chatModel, { foreignKey: 'model_id'})

chat.chatModel.hasMany(message.messageModel, { as: 'Messages',  foreignKey: 'chat_id'})

chat.chatModel.hasMany(job.jobModel, { as: 'Jobs',  foreignKey: 'chat_id'})

message.messageModel.hasOne(job.jobModel, { as: 'job',  foreignKey: 'message_id'})

user.userModel.hasMany(transaction.transactionModel, { as: 'transaction',  foreignKey: 'user_id'})

user.walletModel.hasMany(transaction.transactionModel, { as: 'transaction',  foreignKey: 'wallet_id'})

export default {
  user,
  chat,
  message,
  ai,
  job
}