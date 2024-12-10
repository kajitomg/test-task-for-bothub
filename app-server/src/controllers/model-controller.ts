import { Request, Response, NextFunction } from 'express';
import db from '../db';
import { UserDTO } from '../dto/user-dto';
import aiService, { AiMainData } from '../services/ai-service';

const controller = {
  
  async createModel(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
      } = req.body as AiMainData;
      //@ts-ignore
      const user = req.user as UserDTO
      
      const model = await db.transaction(async (t) => {
        return await aiService.createAi({
          created_by: user.id,
          name
        });
      })
      
      res.status(200).send({ item: model })
    } catch (e) {
      next(e);
    }
  },
  
  async getAllModels(req: Request, res: Response, next: NextFunction) {
    try {
      
      const models = await db.transaction(async (t) => {
        return await aiService.getAllAis();
      })
      
      res.status(200).send({ list: models })
    } catch (e) {
      next(e);
    }
  },
}

export { controller as modelController }