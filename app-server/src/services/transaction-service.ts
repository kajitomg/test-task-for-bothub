import { streams } from '../controllers/chat-controller';
import db from '../db';
import { ApiError } from '../exceptions/api-error-exception';
import calculateCaps from '../helpers/calculate-caps';
import { Transaction, transactionModel } from '../models/transaction/transaction-model';
import aiService from './ai-service';
import walletService from './wallet-service';

type TransactionPersonalData = Pick<Transaction, 'id'>
type TransactionTimestampsData = Pick<Transaction, 'created_at' | 'updated_at'>
type TransactionRefData = Pick<Transaction, 'user_id' | 'wallet_id'>
type TransactionSecureData = Pick<Transaction, 'status'>

type TransactionMainData = Omit<Transaction, keyof TransactionPersonalData | keyof TransactionTimestampsData | keyof TransactionRefData | keyof TransactionSecureData>

export default {
  async createTransaction(data: TransactionRefData & Partial<TransactionMainData> & Pick<TransactionMainData, 'amount' | 'type'> & { chat_id?: number}) {
    const currentTime = Date.now()
    
    await db.transaction(async () => {
      try {
        const transaction = await transactionModel.create({
          currency: 'credit',
          status: 'SUCCESS',
          ...data,
          created_at: currentTime,
          updated_at: currentTime,
        })
        if (!transaction) {
          throw ApiError.InternalServerError('Ошибка при создании транзакции');
        }
        if (data.chat_id) {
          streams.get(data.chat_id)?.emit('TRANSACTION_CREATE', transaction)
        }
        
        await walletService.transaction(data.wallet_id, {
          amount: data.type === 'WRITE_OFF' ? -data.amount : data.amount,
          chat_id: data.chat_id
        })
        
        return transaction
      } catch (e) {
        const transaction = await transactionModel.create({
          currency: 'credit',
          status: 'FAILED',
          ...data,
          created_at: currentTime,
          updated_at: currentTime,
        })
        if (data.chat_id) {
          streams.get(data.chat_id)?.emit('TRANSACTION_CREATE', transaction)
        }
        return e
      }
    })
  },
  
  async createWriteOffTransaction(data: TransactionRefData & Partial<Omit<TransactionMainData, 'type'>> & Pick<TransactionMainData, 'amount'> & { chat_id?: number }) {
    return await this.createTransaction({
      type: 'WRITE_OFF',
      ...data
    })
  },
  
  async createEnhanceTransaction(data: TransactionRefData & Partial<Omit<TransactionMainData, 'type'>> & Pick<TransactionMainData, 'amount'> & { chat_id?: number }) {
    return await this.createTransaction({
      type: 'ENHANCE',
      ...data
    })
  },
  
  async getTotalCaps(data: {model_id: number, in: number, out: number}) {
    const model = await aiService.getAiById(data.model_id)

    return calculateCaps({in: data.in, out: data.out}, {in: model.in_rate, out: model.out_rate})
  },
}