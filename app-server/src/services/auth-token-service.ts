require('dotenv').config()
import jwt from 'jsonwebtoken';
import { ApiError } from '../exceptions/api-error-exception';
import { AuthToken, authTokenModel } from '../models/user/auth-token-model';

type AuthTokenPersonalData = Pick<AuthToken, 'id'>
type AuthTokenTimestampsData = Pick<AuthToken, 'created_at' | 'updated_at'>
type AuthTokenRefData = Pick<AuthToken, 'user_id'>

type AuthTokenMainData = Omit<AuthToken, keyof AuthTokenPersonalData | keyof AuthTokenTimestampsData | keyof AuthTokenRefData>

export default {
  async createAuthToken(data: AuthTokenMainData) {
    const currentTime = Date.now()
    
    const authToken = await authTokenModel.create({
      ...data,
      updated_at: currentTime,
      created_at: currentTime,
    })
    
    if (!authToken) {
      throw ApiError.InternalServerError('Ошибка при создании сущности auth-token')
    }
    
    return authToken
  },
  
  generateTokens(data: object) {
    const refreshKey = process.env.JWT_REFRESH_KEY
    const accessKey = process.env.JWT_ACCESS_KEY
    
    if (!refreshKey || !accessKey) {
      throw ApiError.InternalServerError('Не удалось найти Access Token Key или Refresh Token Key')
    }
    
    const refreshToken = jwt.sign(JSON.parse(JSON.stringify(data)), refreshKey, { expiresIn: `${process.env.JWT_REFRESH_AGE}d` })
    const accessToken = jwt.sign(JSON.parse(JSON.stringify(data)), accessKey, { expiresIn: `${process.env.JWT_ACCESS_AGE}m` })
    
    return {
      access: accessToken,
      refresh: refreshToken
    }
  },
  
  validateAccessToken(token: string) {
    const accessKey = process.env.JWT_ACCESS_KEY
    
    if (!accessKey) {
      throw ApiError.InternalServerError('Не удалось найти Access Token Key')
    }
    
    return jwt.verify(token, accessKey)
  },
  
  validateRefreshToken(token: string) {
    const refreshKey = process.env.JWT_REFRESH_KEY
    
    if (!refreshKey) {
      throw ApiError.InternalServerError('Не удалось найти Refresh Token Key')
    }
    
    return jwt.verify(token, refreshKey)
  }
}