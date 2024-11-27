import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import db from '../../db';

export interface MessageModel extends Model<InferAttributes<MessageModel>, InferCreationAttributes<MessageModel>> {
  id: CreationOptional<number>,
  text: string,
  chat_id: number,
  created_at: number,
  updated_at: number,
}

export type Message = Omit<MessageModel, keyof Model>

const messageModel = db.define<MessageModel>('message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.STRING },
  chat_id: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
})

export {
  messageModel
}