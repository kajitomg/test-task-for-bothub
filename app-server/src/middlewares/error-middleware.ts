import { ErrorRequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../exceptions/api-error-exception';

//@ts-ignore
const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof jwt.NotBeforeError) {
    return res.status(401).json({message: 'Ошибка времени токена'})
  }
  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({message: 'Срок действия токена истек'})
  }
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({message: 'Пользователь не авторизован'})
  }
  if (err instanceof ApiError) {
    return res.status(err.status).json({message: err.message, errors: err.errors})
  }
  return res.status(500).json({message: err.message})
}

export default errorMiddleware;