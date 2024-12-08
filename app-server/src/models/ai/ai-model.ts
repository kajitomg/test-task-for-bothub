import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import db from '../../db';

export interface AiModel extends Model<InferAttributes<AiModel>, InferCreationAttributes<AiModel>> {
  id: CreationOptional<number>,
  name: string,
  in_rate: CreationOptional<number>,
  out_rate: CreationOptional<number>,
  created_at: number,
  updated_at: number,
  created_by: number,
}

export type Ai = Omit<AiModel, keyof Model>

const aiModel = db.define<AiModel>('ai', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true },
  in_rate: { type: DataTypes.DOUBLE, defaultValue: 0.15},
  out_rate: { type: DataTypes.DOUBLE, defaultValue: 0.2 },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
  created_by: { type: DataTypes.INTEGER },
})

export {
  aiModel
}