import { Request, Response, NextFunction } from 'express';
import db from '../db';
import { User } from '../models/user/user-model';
import userService from '../services/user-service';

const controller = {
  async getBalanceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const wallet = await db.transaction(async (t) => {
        return await userService.getInitialWallet(Number(id));
      })
      
      res.status(200).send({ balance: wallet.balance })
    } catch (e) {
      next(e);
    }
  },
  async getMyBalance(req: Request, res: Response, next: NextFunction) {
    try {
      //@ts-ignore
      const user = req.user as User;
      
      const wallet = await db.transaction(async (t) => {
        return await userService.getInitialWallet(Number(user.id));
      })
      
      res.status(200).send({ balance: wallet.balance })
    } catch (e) {
      next(e);
    }
  },
  async setBalanceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { balance } = req.body as { balance: number };
      
      const wallet = await db.transaction(async (t) => {
        return await userService.setInitialWalletBalance(Number(id), {
          balance
        });
      })
      
      res.status(200).send({ balance: wallet.balance })
    } catch (e) {
      next(e);
    }
  },
  
  async setRoleByRoleId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { role_id } = req.body as { role_id: number };
      
      const role = await db.transaction(async () => {
        return await userService.setRole(Number(id), {
          role_id
        });
      })
      
      res.status(200).send({ item: role })
    } catch (e) {
      next(e);
    }
  }
}

export { controller as userController }