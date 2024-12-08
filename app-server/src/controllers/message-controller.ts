import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/api-error-exception';
import { User } from '../models/user/user-model';
import chatService from '../services/chat-service';
import jobService from '../services/job-service';
import messageService from '../services/message-service';
import transactionService from '../services/transaction-service';
import userService from '../services/user-service';
import { streams } from './chat-controller';

const controller = {
  
  async send(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        chat_id,
        prompt
      } = req.body;
      
      //@ts-ignore
      const userData = req.user as User
      
      const user = await userService.getUserById(userData.id)
      
      if (!user) throw ApiError.UnauthorizedError()
      
      await messageService.createUserMessage({
        content: prompt,
        chat_id,
        user_id: user.id
      })
      const chat = await chatService.getChatById(chat_id)
      
      const wallet = await userService.getInitialWallet(chat.user_id)
      
      if (wallet.balance <= 0) {
        return next(ApiError.PaymentRequiredError('Недостаточный баланс для генерации'))
      }
      const job = await jobService.createModelGenerationJob({
        user_id: user?.id,
        chat_id: chat.id,
      })
      let message = await messageService.createAssistantMessage({
        chat_id
      })
      res.status(200).send(message)

      const result = await jobService.startModelGenerationJob(job.id, {
        message_id: message.id,
        model_id: chat.model_id,
        prompt
      })
      
      const total_caps = await transactionService.getTotalCaps({
        model_id: chat.model_id,
        in: result.tokens.in,
        out: result.tokens.out
      })
      
      streams.get(user.id)?.emit('UPDATE', total_caps)
      
      message = await messageService.getMessageById(message.id)
      
      streams.get(user.id)?.emit('MESSAGE_UPDATE', message)
      
      await transactionService.createWriteOffTransaction({
        user_id: chat.user_id,
        chat_id: chat.id,
        wallet_id: wallet.id,
        currency: 'credit',
        amount: total_caps
      })
      
    } catch (e) {
      next(e);
    }
  },
}

export { controller as messageController }