import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import db from '../../db';
import { Currencies } from '../user/wallet-model';

enum TransactionTypes {
  ENHANCE = 'ENHANCE',
  WRITE_OFF = 'WRITE_OFF'
}

enum TransactionStatuses {
  'SUCCESS' = 'SUCCESS',
  'FAILED' = 'FAILED',
}

export interface TransactionModel extends Model<InferAttributes<TransactionModel>, InferCreationAttributes<TransactionModel>> {
  id: CreationOptional<number>,
  currency: keyof typeof Currencies,
  amount: number,
  status: keyof typeof TransactionStatuses,
  type: keyof typeof TransactionTypes,
  user_id: CreationOptional<number>,
  wallet_id: CreationOptional<number>,
  created_at: number,
  updated_at: number,
}

export type Transaction = Omit<TransactionModel, keyof Model>

const transactionModel = db.define<TransactionModel>('transaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  currency: { type: DataTypes.ENUM( ...Object.values(Currencies)) },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM( ...Object.values(TransactionStatuses)) },
  type: { type: DataTypes.ENUM( ...Object.values(TransactionTypes)) },
  user_id: { type: DataTypes.INTEGER },
  wallet_id: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
})

export {
  transactionModel
}