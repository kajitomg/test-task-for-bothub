import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import db from '../../db';

export interface AuthTokenModel extends Model<InferAttributes<AuthTokenModel>, InferCreationAttributes<AuthTokenModel>> {
  id: CreationOptional<number>,
  refresh: string,
  user_id: CreationOptional<number>,
  created_at: number,
  updated_at: number,
}

export type AuthToken = Omit<AuthTokenModel, keyof Model>

const authTokenModel = db.define<AuthTokenModel>('auth-token', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  refresh: { type: DataTypes.STRING },
  user_id: { type: DataTypes.INTEGER, unique: true },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
})

export {
  authTokenModel
}