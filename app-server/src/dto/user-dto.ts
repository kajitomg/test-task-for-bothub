import { User, UserModel } from '../models/user/user-model';

export class UserDTO {
  id: number
  username: string
  
  constructor(user: UserModel | User) {
    this.id = user.id
    this.username = user.username
  }
  
}