import { ApiError } from '../exceptions/api-error-exception';
import { Chat, chatModel } from '../models/chat/chat-model';

type ChatPersonalData = Pick<Chat, 'id'>
type ChatTimestampsData = Pick<Chat, 'created_at' | 'updated_at'>
export type ChatRefData = Pick<Chat, 'user_id' | 'model_id'>

export type ChatMainData = Omit<Chat, keyof ChatPersonalData | keyof ChatTimestampsData | keyof ChatRefData>

export default {
  async createChat(data: ChatMainData & ChatRefData) {
    const currentTime = Date.now();

    const chat = await chatModel.create({
      ...data,
      updated_at: currentTime,
      created_at: currentTime,
    })
    
    if (!chat) {
      throw ApiError.InternalServerError('Ошибка при создании чата')
    }
    
    return chat
  },
  
  async deleteChatById(id: ChatPersonalData['id']) {
    const chat = await chatModel.destroy({
      where: {id}
    })
    
    if (!chat) {
      throw ApiError.NotFoundError('Чат с указанным id не найден')
    }
    
    return chat
  },
  
  async updateChatById(id: ChatPersonalData['id'], data: Partial<ChatMainData & ChatTimestampsData & ChatRefData>) {
    const currentTime = Date.now();
    const result = await chatModel.update({
      ...data,
      updated_at: currentTime
    }, {
      where: { id },
    })
    
    if (!result[0]) {
      console.log('Чат с указанным id не найден')
    }
    
    return result[0]
  },
  
  async getChatById(id: ChatPersonalData['id']) {
    const chat = await chatModel.findOne({
      where: {id}
    })
    
    if (!chat) {
      throw ApiError.NotFoundError('Чат с указанным id не найден')
    }
    
    return chat
  },
  
  async getAllChatsByUser(id: ChatRefData['user_id']) {
    return await chatModel.findAll({
      where: {id}
    })
  },
  
  async getChatMessages(id: ChatPersonalData['id']) {
    const chat = await this.getChatById(id);
    
    const messages = await chat?.getMessages()
    
    if (!messages) {
      throw ApiError.NotFoundError('Ошибка при поиске сообщений чата')
    }
    
    return messages
  },
  
  async getChatJobs(id: ChatPersonalData['id']) {
    const chat = await this.getChatById(id);
    const jobs = await chat?.getJobs()
    
    if ( !jobs ) {
      throw ApiError.NotFoundError(`Ошибка при поиске запросов чата`)
    }
    
    return {
      items: jobs
    }
  }
}