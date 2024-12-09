import { Request, Response, NextFunction } from 'express';
import db from '../db';
import { UserDTO } from '../dto/user-dto';
import { ApiError } from '../exceptions/api-error-exception';
import chatService from '../services/chat-service';
import jobService from '../services/job-service';
import { streams } from './chat-controller';

const controller = {
  
  async stop(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      
      const job = await db.transaction(async (t) => {
        const job = await jobService.getJobById(Number(id));
        
        await streams.get(job.chat_id)?.emit('JOB_ABORT', job);
        
        return job
      })
      
      res.status(200).send({ item: job })
    } catch (e) {
      next(e);
    }
  },
  
  async authorizingJobAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      
      //@ts-ignore
      const userData = req.user as UserDTO
      if (!userData) throw ApiError.UnauthorizedError()
      
      const jobs = await jobService.getJobsByUserId(userData.id)
      
      const isAccess = jobs.some((job) => job.id === Number(id))
      if (!isAccess) throw ApiError.ForbiddenError()
      
      next()
    } catch (e) {
      next(e);
    }
  }
}

export { controller as jobController }