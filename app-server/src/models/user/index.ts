import { walletModel } from './wallet-model';
import { userModel } from './user-model';
import { roleModel } from './role-model';
import { authTokenModel } from './auth-token-model';

roleModel.hasMany(userModel, { as: 'Users', foreignKey: 'role_id' })

userModel.hasOne(authTokenModel, { as: 'AuthToken', foreignKey: 'user_id' })

userModel.hasMany(walletModel, { as: 'Wallets', foreignKey: 'user_id' })

export default {
  userModel,
  roleModel,
  authTokenModel,
}