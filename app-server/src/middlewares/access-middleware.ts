import { RequestHandler } from 'express';

const accessMiddleware: RequestHandler = (req, res, next) => {
  try {
    next()
  } catch (e) {
  }
}

export default accessMiddleware;