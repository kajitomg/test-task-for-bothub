import { userModel } from './user-model';
import { roleModel } from './role-model';
import { authTokenModel } from './auth-token-model';

roleModel.hasMany(userModel, { as: 'users', foreignKey: 'role_id' })

userModel.hasOne(authTokenModel, { as: 'AuthToken', foreignKey: 'user_id' })

export default {
  userModel,
  roleModel,
  authTokenModel,
}