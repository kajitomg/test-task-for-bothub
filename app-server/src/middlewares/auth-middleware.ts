import { RequestHandler } from 'express';
import { ApiError } from '../exceptions/api-error-exception';
import { User } from '../models/user/user-model';
import authTokenService from '../services/auth-token-service';

const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1]
    
    if (!accessToken) throw ApiError.UnauthorizedError()
    
    const userData = authTokenService.validateAccessToken(accessToken) as User
    if (!userData) throw ApiError.UnauthorizedError()
    
    //@ts-ignore
    req.user = userData
    next()
  } catch (e) {
    throw ApiError.UnauthorizedError()
  }
}

export default authMiddleware;