import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import db from '../../db';

export enum Permissions {
  'ALL' = 'ALL'
}

export interface RoleModel extends Model<InferAttributes<RoleModel>, InferCreationAttributes<RoleModel>> {
  id: CreationOptional<number>,
  name: string,
  permissions: Permissions[] | null
  created_at: number,
  updated_at: number,
}
export type Role = Omit<RoleModel, keyof Model>

const roleModel = db.define<RoleModel>('role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true },
  permissions: { type: DataTypes.ARRAY(DataTypes.STRING) },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
})

export {
  roleModel
}