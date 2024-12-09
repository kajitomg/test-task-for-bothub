import { Request, Response, NextFunction } from 'express';
import db from '../db';
import jobService from '../services/job-service';
import { streams } from './chat-controller';

const controller = {
  
  async stop(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      
      const job = await db.transaction(async (t) => {
        const job = await jobService.getJobById(Number(id));
        
        await streams.get(job.user_id)?.emit('JOB_ABORT', job);
        
        return job
      })
      
      res.status(200).send({ item: job })
    } catch (e) {
      next(e);
    }
  },
}

export { controller as jobController }