import { Request, Response, NextFunction } from 'express';
import db from '../db';
import roleService, { RoleMainData } from '../services/role-service';

const controller = {
  
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        permissions
      } = req.body as RoleMainData;
      
      const role = await db.transaction(async (t) => {
        return await roleService.createRole({
          name,
          permissions
        });
      })
      
      res.status(200).send({ item: role })
    } catch (e) {
      next(e);
    }
  },
}

export { controller as roleController }