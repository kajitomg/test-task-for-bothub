import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import db from '../../db';

export interface RoleModel extends Model<InferAttributes<RoleModel>, InferCreationAttributes<RoleModel>> {
  id: CreationOptional<number>,
  name: string,
  created_at: number,
  updated_at: number,
}

export type Role = Omit<RoleModel, keyof Model>

const roleModel = db.define<RoleModel>('role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
})

export {
  roleModel
}