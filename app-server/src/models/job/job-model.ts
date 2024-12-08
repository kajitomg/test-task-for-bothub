import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes
} from 'sequelize';
import db from '../../db';

export enum JobNames {
  'MODEL_GENERATION' = 'MODEL_GENERATION',
}

export enum JobStatuses {
  'CREATE' = 'CREATE',
  'PENDING' = 'PENDING',
  'DONE' = 'DONE',
  'STOPPED' = 'STOPPED',
}

export interface JobModel extends Model<InferAttributes<JobModel>, InferCreationAttributes<JobModel>> {
  id: CreationOptional<number>,
  name: keyof typeof JobNames,
  status: keyof typeof JobStatuses,
  chat_id: CreationOptional<number>,
  user_id: CreationOptional<number>,
  message_id?: CreationOptional<number>,
  created_at: number,
  updated_at: number
}

export type Job = Omit<JobModel, keyof Model>

const jobModel = db.define<JobModel>('job', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.ENUM(...Object.values(JobNames)) },
  status: { type: DataTypes.ENUM(...Object.values(JobStatuses)) },
  chat_id: { type: DataTypes.INTEGER },
  user_id: { type: DataTypes.INTEGER },
  message_id: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, {
  scopes: {
    isPending: {
      where: {
        status: ['PENDING', 'CREATE']
      }
    }
  }
})

export {
  jobModel
}