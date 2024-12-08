import { streams } from '../controllers/chat-controller';
import { ApiError } from '../exceptions/api-error-exception';
import { Wallet, walletModel } from '../models/user/wallet-model';

type WalletPersonalData = Pick<Wallet, 'id'>
type WalletTimestampsData = Pick<Wallet, 'created_at' | 'updated_at'>
type WalletRefData = Pick<Wallet, 'user_id'>
type WalletSecureData = Pick<Wallet, 'balance'>

type WalletMainData = Omit<Wallet, keyof WalletPersonalData | keyof WalletTimestampsData | keyof WalletRefData>

export default {
  async createWallet(data: Pick<WalletMainData, 'currency'> & Partial<Omit<WalletMainData, keyof WalletSecureData>>) {
    const currentTime = Date.now()

    const wallet = await walletModel.create({
      ...data,
      balance: 0,
      created_at: currentTime,
      updated_at: currentTime,
    })
    
    if (!wallet) {
      throw ApiError.InternalServerError('Ошибка при создании кошелька');
    }
    
    return wallet
  },
  
  async createCreditWallet() {
    const wallet = await this.createWallet({
      currency: 'credit',
      initial: true,
    })
    
    if (!wallet) {
      throw ApiError.InternalServerError('Ошибка при создании Credit кошелька');
    }
    
    return wallet
  },
  
  async updateWalletById(id: WalletPersonalData['id'], data: Partial<WalletMainData>, options?: { scope?: Partial<'initial'> }) {
    const currentTime = Date.now();
    const affected = await walletModel.scope(options?.scope).update({
      ...data,
      updated_at: currentTime
    }, {
      where: { id }
    })
    
    if (!affected[0]) {
      throw ApiError.InternalServerError('Ошибка при обновлении данных кошелька');
    }
    const wallet = await this.getWalletById(id)
    
    streams.get(wallet.user_id)?.emit('WALLET_UPDATE', wallet)
    
    return wallet
  },
  
  async getWalletById(id: WalletPersonalData['id']) {
    const wallet = await walletModel.findByPk(id)
    
    if (!wallet) {
      throw ApiError.InternalServerError('Ошибка при поиске кошелька');
    }
    
    return wallet
  },
  
  async transaction(id: WalletPersonalData['id'], data: { amount: number }) {
    let wallet = await this.getWalletById(id)
    
    wallet = await this.updateWalletById(id, {
      balance: wallet.balance + data.amount
    })
    
    return wallet
  }
}