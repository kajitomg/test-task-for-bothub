import {
  CreationOptional,
  DataTypes, HasManyGetAssociationsMixin, HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import db from '../../db';
import { AuthTokenModel } from './auth-token-model';
import { RoleModel } from './role-model';
import { WalletModel } from './wallet-model';

type UserAssociations = {
  getAuthToken: HasOneGetAssociationMixin<AuthTokenModel>,
  setAuthToken: HasOneCreateAssociationMixin<AuthTokenModel>,
  
  getWallets: HasManyGetAssociationsMixin<WalletModel>,
  setWallets: HasOneCreateAssociationMixin<WalletModel>,
  
  getRole: HasOneGetAssociationMixin<RoleModel>,
  setRole: HasOneCreateAssociationMixin<RoleModel>,
}

export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>,
  username: string,
  password: string,
  role_id?: CreationOptional<number>,
  created_at: number,
  updated_at: number,
}

export type User = Omit<UserModel, keyof Model>

const userModel = db.define<UserModel & UserAssociations>('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role_id: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
})

export {
  userModel
}