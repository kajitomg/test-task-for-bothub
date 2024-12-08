import { User, UserModel } from '../models/user/user-model';

export class UserDTO {
  id: number
  username: string
  role_id: number | null
  
  constructor(user: UserModel | User | UserDTO) {
    this.id = user.id
    this.username = user.username
    this.role_id = user.role_id || null
  }
  
}