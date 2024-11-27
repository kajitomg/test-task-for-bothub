import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import db from '../../db';

export interface ChatModel extends Model<InferAttributes<ChatModel>, InferCreationAttributes<ChatModel>> {
  id: CreationOptional<number>,
  name: string,
  user_id: number,
  model_id: number,
  created_at: number,
  updated_at: number,
}

export type Chat = Omit<ChatModel, keyof Model>

const chatModel = db.define<ChatModel>('chat', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true },
  user_id: { type: DataTypes.INTEGER },
  model_id: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
})

export {
  chatModel
}