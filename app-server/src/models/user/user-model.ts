import {
  Association,
  CreationOptional,
  DataTypes, HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import db from '../../db';
import { AuthTokenModel } from './auth-token-model';

export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>,
  username: string,
  password: string,
  role_id?: CreationOptional<number>,
  created_at: number,
  updated_at: number,
  
  getAuthToken: HasOneGetAssociationMixin<AuthTokenModel>,
  addAuthToken: HasOneCreateAssociationMixin<AuthTokenModel>,
  
  associations?: Association<UserModel, AuthTokenModel>;
}

export type User = Omit<UserModel, keyof Model>

const userModel = db.define<UserModel>('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, {
  hooks: {}
})

export {
  userModel
}