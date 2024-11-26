import bcrypt from 'bcrypt';
import { UserDTO } from '../dto/user-dto';
import { ApiError } from '../exceptions/api-error-exception';
import { User, userModel } from '../models/user/user-model';
import authTokenService from './auth-token-service';

type UserPersonalData = Pick<User, 'id'>
type UserTimestampsData = Pick<User, 'created_at' | 'updated_at'>
type UserRefData = Pick<User, 'role_id'>

export type UserMainData = Omit<User, keyof UserPersonalData | keyof UserTimestampsData | keyof UserRefData>
export type UserAuthData = Pick<UserMainData, 'username' | 'password'>

export default {
  
  async createUser(data: UserAuthData & Partial<UserMainData>) {
    const currentTime = Date.now()

    const user = await userModel.create({
      ...data,
      created_at: currentTime,
      updated_at: currentTime,
    })
    
    if (!user) {
      throw ApiError.InternalServerError('Ошибка при создании пользователя')
    }
    const userDTO = new UserDTO(user)
    
    const tokens = authTokenService.generateTokens(userDTO)
    const authToken = await authTokenService.createAuthToken({
      refresh: tokens.refresh
    })
    await user.setAuthToken(authToken)
    
    return {
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
      user
    }
  },
  
  async getUser(data: Partial<UserPersonalData | UserMainData>, options?: { scopes?: Array<string> }) {
    const user = userModel.scope(options?.scopes).findOne({
      where: {
        ...data
      }
    })
    
    if (!user) {
      return null
    }
    
    return user
  },
  
  async getUserById(id: number, options?: { scopes?: Array<string> }) {
    const user = this.getUser({ id }, options)
    
    if (!user) {
      console.log(`Пользователь с id ${id} не найден`)
      return null
    }
    
    return user
  },
  
  async signin(data: UserAuthData) {
    const user = await this.getUser({
      username: data.username
    })
    if (!user) {
      throw ApiError.BadRequestError(`Неверный username пользователя`)
    }
    
    const isPassEquals = await bcrypt.compare(data?.password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequestError(`Неверный пароль`)
    }
    const userDTO = new UserDTO(user)
    
    const tokens = authTokenService.generateTokens(userDTO)
    const authToken = await user.getAuthToken()
    
    await authToken.update({
      refresh: tokens.refresh
    })
    
    await authToken.save()
    
    return {
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
      item: user
    }
  },
  
  async signup(data: UserAuthData) {
    const { password, ...otherData } = data
    const candidate = await this.getUser({
      username: data.username
    })
    
    if (candidate) {
      throw ApiError.BadRequestError(`Пользователь с username ${data.username} уже существует`)
    }
    
    const hashedPassword = await bcrypt.hash(data?.password, 5)
    const userData = await this.createUser({
      password: hashedPassword,
      ...otherData
    })
    
    return {
      accessToken: userData.accessToken,
      refreshToken: userData.refreshToken,
      item: userData.user
    }
  },
  
  async refreshAuth(refreshToken: string) {
    const userData = authTokenService.validateRefreshToken(refreshToken) as UserDTO
    if (!userData) {
      throw ApiError.ForbiddenError()
    }
    
    const user = await this.getUserById(userData.id)
    if ( !user ) {
      throw ApiError.NotFoundError(`Не удалось найти пользователя`)
    }
    
    const authToken = await user.getAuthToken()
    if (authToken.refresh !== refreshToken) {
      throw ApiError.ForbiddenError()
    }
    const userDTO = new UserDTO(user)
    
    const tokens = authTokenService.generateTokens(userDTO)
    
    await authToken.update({
      refresh: tokens.refresh
    })
    
    await authToken.save()
    
    return {
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
      item: user
    }
  }
  
  
  
}