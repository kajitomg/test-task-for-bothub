import { ApiError } from '../exceptions/api-error-exception';
import { Role, roleModel } from '../models/user/role-model';

type RolePersonalData = Pick<Role, 'id'>
type RoleTimestampsData = Pick<Role, 'created_at' | 'updated_at'>

export type RoleMainData = Omit<Role, keyof RolePersonalData | keyof RoleTimestampsData>

export default {
  async createRole(data: RoleMainData) {
    const currentTime = Date.now()
    
    const role = await roleModel.create({
      ...data,
      updated_at: currentTime,
      created_at: currentTime,
    })
    
    if (!role) {
      throw ApiError.InternalServerError('Ошибка при создании роли')
    }
    
    return role
  },
  async createBulkRoles(data: RoleMainData[]) {
    const currentTime = Date.now()
    
    const records = data.map((record) => ({
      ...record,
      updated_at: currentTime,
      created_at: currentTime,
    }))
    
    const roles = await roleModel.bulkCreate(records)
    
    if (!roles) {
      throw ApiError.InternalServerError('Ошибка при создании ролей')
    }
    
    return roles
  },
  async getRoleById(id: RolePersonalData['id']) {
    const role = await roleModel.findOne({
      where: { id }
    })
    
    if (!role) {
      throw ApiError.InternalServerError('Ошибка при поиске роли')
    }
    
    return role
  },
  async getAllRoles() {
    const roles = await roleModel.findAll()
    
    if (!roles) {
      throw ApiError.InternalServerError('Ошибка при поиске ролей')
    }
    
    return roles
  },
}