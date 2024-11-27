import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import db from '../../db';

enum Currencies {
  'credit' = 'credit',
}

export interface WalletModel extends Model<InferAttributes<WalletModel>, InferCreationAttributes<WalletModel>> {
  id: CreationOptional<number>,
  currency: Currencies,
  balance: number,
  initial: boolean,
  user_id: CreationOptional<number>,
  created_at: number,
  updated_at: number,
}

export type Currency = Omit<WalletModel, keyof Model>

const walletModel = db.define<WalletModel>('wallet', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  currency: { type: DataTypes.ENUM( ...Object.values(Currencies)) },
  balance: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  initial: { type: DataTypes.BOOLEAN },
  user_id: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, {
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'currency'],
    },
  ]
})

export {
  walletModel
}