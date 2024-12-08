import { ApiError } from '../exceptions/api-error-exception';
import { Ai, aiModel } from '../models/ai/ai-model';

type AiPersonalData = Pick<Ai, 'id'>
type AiTimestampsData = Pick<Ai, 'created_at' | 'updated_at'>
export type AiRefData = Pick<Ai, 'created_by'>

export type AiMainData = Omit<Ai, keyof AiPersonalData | keyof AiTimestampsData | keyof AiRefData>

export default {
  async createAi(data: Partial<AiMainData> & Pick<AiMainData, 'name'>  & AiRefData) {
    const currentTime = Date.now()
    
    const ai = await aiModel.create({
      ...data,
      updated_at: currentTime,
      created_at: currentTime,
    })
    
    if (!ai) {
      throw ApiError.InternalServerError('Ошибка при создании модели ai')
    }
    
    return ai
  },
  async getAiById(id: AiPersonalData['id']) {
    const ai = await aiModel.findOne({
      where: { id }
    })
    
    if (!ai) {
      throw ApiError.InternalServerError('Ошибка при поиске модели ai')
    }
    
    return ai
  },
  async getAllAis(data?: AiRefData) {
    const options = data ? { where: data } : {}
    
    const ais = await aiModel.findAll(options)
    
    if (!ais) {
      throw ApiError.InternalServerError('Ошибка при поиске моделей ai')
    }
    
    return ais
  },
}