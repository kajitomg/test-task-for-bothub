import { Request, Response, NextFunction } from 'express';
import db from '../db';
import userService, { UserAuthData } from '../services/user-service';

const controller = {

  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        password,
        username
      } = req.body as UserAuthData;
      
      const reqData = await db.transaction(async (t) => {
        return await userService.signin({
          password,
          username
        });
      })
      
      res.status(200).send(reqData)
    } catch (e) {
      next(e);
    }
  },
  
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        password,
        username
      } = req.body as UserAuthData;
      
      const reqData = await db.transaction(async (t) => {
        return await userService.signup({
          password,
          username
        });
      })
    
      res.status(200).send(reqData)
    } catch (e) {
      next(e);
    }
  },
  
  async refreshAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req?.cookies
      
      const reqData = await db.transaction(async (t) => {
        return await userService.refreshAuth(refreshToken);
      })
      
      res.status(200).send(reqData)
    } catch (e) {
      next(e);
    }
  }
}

export { controller as authController }