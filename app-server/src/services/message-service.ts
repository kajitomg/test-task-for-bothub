import { streams } from '../controllers/chat-controller';
import { ApiError } from '../exceptions/api-error-exception';
import { Message, messageModel } from '../models/message/message-model';
import chatService from './chat-service';

type MessagePersonalData = Pick<Message, 'id'>
type MessageTimestampsData = Pick<Message, 'created_at' | 'updated_at'>
type MessageRefData = Pick<Message, 'chat_id' | 'user_id'>

type MessageMainData = Omit<Message, keyof MessagePersonalData | keyof MessageTimestampsData | keyof MessageRefData>

export default {
  async createMessage(data: Partial<MessageMainData> & Partial<MessageRefData> & Pick<MessageRefData, 'chat_id'>) {
    const currentTime = Date.now();

    const message = await messageModel.create({
      ...data,
      updated_at: currentTime,
      created_at: currentTime,
    })
    
    if (!message) {
      throw ApiError.InternalServerError('Ошибка при создании сообщения')
    }
    
    if (data.chat_id) {
      streams.get(data.chat_id)?.emit('MESSAGE_CREATE', message)
    }
    
    return message
  },
  async createUserMessage(data: Partial<Omit<MessageMainData, 'role'>> & MessageRefData) {
    return await this.createMessage({
      role: 'user',
      ...data,
    })
  },
  async createAssistantMessage(data: Partial<Omit<MessageMainData, 'role'>> & Pick<MessageRefData, 'chat_id'>) {
    return await this.createMessage({
      role: 'assistant',
      ...data,
    })
  },
  async getMessageById(id: MessagePersonalData['id'], options?: { scope?: Partial<'withJob' | 'light'> }) {
    const message = await messageModel.scope(options?.scope).findByPk(id)
    
    if (!message) {
      throw ApiError.InternalServerError('Ошибка при получении сообщения')
    }
    
    return message
  },
  async updateMessageById(id: MessagePersonalData['id'], data: Omit<MessageMainData, 'role'>, options?: { scope?: Partial<'withJob' | 'light'> }) {
    const currentTime = Date.now();
    const message = await this.getMessageById(id, { scope: options?.scope })
    
    await message.update({
      ...data,
      updated_at: currentTime
    })
    
    if (message.chat_id) {
      streams.get(message.chat_id)?.emit('MESSAGE_UPDATE', message)
    }
    
    if (!message) {
      throw ApiError.InternalServerError('Ошибка при обновлении сообщения')
    }
    
    return message
  },
  async getAllMessagesByChatId(id: number, options?: { scope?: Partial<'withJob' | 'light' | 'openaiMessage'> }) {
    const message = await messageModel.scope(options?.scope).findAll({
      where: {
        chat_id: id
      }
    })
    
    if (!message) {
      throw ApiError.InternalServerError('Ошибка при получении сообщения')
    }
    
    return message
  },
  async deleteMessageById(id: MessagePersonalData['id']) {
    const message = await messageModel.destroy({ where: { id } })
    
    if (!message) {
      throw ApiError.InternalServerError('Ошибка при удалении сообщения')
    }
    
    return message
  }
}