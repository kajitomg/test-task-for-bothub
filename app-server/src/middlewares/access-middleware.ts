import { RequestHandler } from 'express';
import { UserDTO } from '../dto/user-dto';
import { ApiError } from '../exceptions/api-error-exception';
import { Permissions } from '../models/user/role-model';
import { User } from '../models/user/user-model';
import roleService from '../services/role-service';
import userService from '../services/user-service';

const accessMiddleware = (access: Permissions[] | 'user' | 'admin'): RequestHandler =>
  async (req, res, next) => {
    try {
      //@ts-ignore
      const userData = req.user as User
      const user = await userService.getUserById(userData.id)

      if (!user || !user.role_id) throw ApiError.ForbiddenError()
      
      let role = await roleService.getRoleById(user.role_id)
      
      if (Array.isArray(access)) {
        if (role.permissions && !role.permissions.every(item => !access.includes(item))) {
          return next()
        }
      }
      if (typeof access === 'string') {
        if (role.name === access) {
          return next()
        }
      }
      
      throw ApiError.ForbiddenError()
    } catch (e) {
      return next(e);
    }
  }


export default accessMiddleware;