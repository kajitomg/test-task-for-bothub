import { RequestHandler } from 'express';
import { UserDTO } from '../dto/user-dto';
import { ApiError } from '../exceptions/api-error-exception';
import { User } from '../models/user/user-model';
import authTokenService from '../services/auth-token-service';
import userService from '../services/user-service';

const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1]

    if (!accessToken) throw ApiError.UnauthorizedError()
    
    const userData = authTokenService.validateAccessToken(accessToken) as User
    if (!userData) throw ApiError.UnauthorizedError()
    
    const user = await userService.getUserById(userData.id)
    if (!user) throw ApiError.UnauthorizedError()
    
    //@ts-ignore
    req.user = new UserDTO(user)
    next()
  } catch (e) {
    throw ApiError.UnauthorizedError()
  }
}

export default authMiddleware;