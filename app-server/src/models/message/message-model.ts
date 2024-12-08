import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin, HasOneCreateAssociationMixin, Op,
} from 'sequelize';
import db from '../../db';
import { JobModel, jobModel } from '../job/job-model';

enum MessageRoles {
  'user' = 'user',
  'assistant' = 'assistant',
}

type MessageAssociations = {
  setJob: HasOneCreateAssociationMixin<JobModel>,
}

export interface MessageModel extends Model<InferAttributes<MessageModel>, InferCreationAttributes<MessageModel>> {
  id: CreationOptional<number>,
  content: CreationOptional<string | null>,
  chat_id: number,
  user_id: CreationOptional<number | null>,
  role: CreationOptional<keyof typeof MessageRoles>,
  created_at: number,
  updated_at: number,
}

export type Message = Omit<MessageModel, keyof Model>

const messageModel = db.define<MessageModel & MessageAssociations>('message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.STRING},
  role: { type: DataTypes.ENUM(...Object.values(MessageRoles)), defaultValue: MessageRoles.user },
  chat_id: { type: DataTypes.INTEGER },
  user_id: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, {
  scopes: {
    withJob: {
      include: {
        model: jobModel,
        as: 'job'
      }
    },
    light: {
     attributes: ['id', 'content', 'chat_id']
    },
    openaiMessage: {
      where: {
        content: {
          [Op.ne]: null
        }
      },
      attributes: [ 'content', 'role' ]
    }
  }
})

export {
  messageModel
}