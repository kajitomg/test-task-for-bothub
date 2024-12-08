import { EventEmitter } from 'events';
import { NextFunction, Request, Response } from 'express';
import OpenAI from 'openai';
import db from '../db';
import { UserDTO } from '../dto/user-dto';
import sendSSE from '../helpers/send-sse';
import { Job } from '../models/job/job-model';
import { Message } from '../models/message/message-model';
import { Transaction } from '../models/transaction/transaction-model';
import { User } from '../models/user/user-model';
import { Wallet } from '../models/user/wallet-model';
import chatService, { ChatMainData, ChatRefData } from '../services/chat-service';
import jobService from '../services/job-service';

type Events = {
  CREATE_CONNECTION: [],
  CLOSED_CONNECTION: [],
  MULTIPLE_CONNECTIONS: [],
  CREATE_MESSAGE: [message: Message],
  UPDATE_MESSAGE: [message: Message],
  ABORT_MESSAGE: [id?: number],
  FINISH_MESSAGE: [],
  
  MESSAGE_CREATE: [message: Message],
  MESSAGE_UPDATE: [message: Message],
  JOB_CREATE: [job: Job],
  JOB_UPDATE: [job: Job],
  JOB_START: [job: Job],
  JOB_DONE: [job: Job],
  JOB_ABORT: [job: Job],
  JOB_STOP: [job: Job],
  TRANSACTION_CREATE: [transaction: Transaction],
  WALLET_UPDATE: [wallet: Wallet],
  UPDATE: [total_caps: number]
}

export const streams = new Map<number, EventEmitter<Events>>()

const controller = {
  
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        model_id,
        name
      } = req.body as ChatMainData & ChatRefData;
      //@ts-ignore
      const user = req.user as UserDTO

      const chat = await db.transaction(async (t) => {
        return await chatService.createChat({
          user_id: user.id,
          model_id,
          name
        });
      })
      
      res.status(200).send(chat)
    } catch (e) {
      next(e);
    }
  },
  
  async stream(req: Request, res: Response, next: NextFunction) {
    try {
      //const { id } = req.params
      
      //@ts-ignore
      const user = req.user as User
      
      let stream = streams.get(Number(user.id))
      if (stream) {
        stream.emit('MULTIPLE_CONNECTIONS')
      }
      stream = new EventEmitter<Events>();
      streams.set(Number(user.id), stream);
      
      stream.on('MULTIPLE_CONNECTIONS', () => {
        res.end()
      })
      
      stream.on('MESSAGE_CREATE', (message) => {
        sendSSE<[keyof Events], { message: Message }>(res, {
          data: { message },
          event: 'MESSAGE_CREATE'
        })
      })
      
      stream.on('MESSAGE_UPDATE', (message) => {
        sendSSE<[keyof Events], { message: Message }>(res, {
          data: { message },
          event: 'MESSAGE_UPDATE'
        })
      })
      
      stream.on('JOB_CREATE', (job) => {
        sendSSE<[keyof Events], { job: Job }>(res, {
          data: { job },
          event: 'JOB_CREATE'
        })
      })
      
      stream.on('JOB_UPDATE', (job) => {
        sendSSE<[keyof Events], { job: Job }>(res, {
          data: { job },
          event: 'JOB_UPDATE'
        })
      })
      
      stream.on('JOB_DONE', (job) => {
        sendSSE<[keyof Events], { job: Job }>(res, {
          data: { job },
          event: 'JOB_DONE'
        })
      })
      
      stream.on('JOB_START', (job) => {
        sendSSE<[keyof Events], { job: Job }>(res, {
          data: { job },
          event: 'JOB_START'
        })
      })
      
      stream.on('JOB_STOP', (job) => {
        sendSSE<[keyof Events], { job: Job }>(res, {
          data: { job },
          event: 'JOB_STOP'
        })
      })
      
      stream.on('TRANSACTION_CREATE', (transaction) => {
        sendSSE<[keyof Events], { transaction: Transaction }>(res, {
          data: { transaction },
          event: 'TRANSACTION_CREATE'
        })
      })
      
      stream.on('WALLET_UPDATE', (wallet) => {
        sendSSE<[keyof Events], { wallet: Wallet }>(res, {
          data: { wallet },
          event: 'WALLET_UPDATE'
        })
      })
      
      stream.on('UPDATE', (total_caps) => {
        sendSSE<[keyof Events], { total_caps: number }>(res, {
          data: { total_caps },
          event: 'UPDATE'
        })
      })
      
      req.on('close', () => {
        console.info('SSE connection closed');
        streams.delete(Number(user.id));
      });
      res.on('error', () => {
        console.info('SSE connection error')
        streams.delete(Number(user.id));
        res.end();
      });
    } catch (e) {
      next(e);
    }
  },
  async stop(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      
      const jobs = await jobService.getJobsByChatId(Number(id), {scope:'isPending'});
      
      jobs.map(async (job) => {
        streams.get(Number(job.user_id))?.emit('JOB_ABORT', job)
      })
      
      res.sendStatus(200)
    } catch (e) {
      next(e);
    }
  }
}

export { controller as chatController }