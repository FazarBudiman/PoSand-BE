import { UserRow } from '../../repository/user.row';
import { User } from '../user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  existsUserByUsername(username: string): Promise<boolean>;
  createUser(user: User): Promise<UserRow>;
  findAllUsers(): Promise<UserRow[]>;
  findUserById(id: string): Promise<UserRow | undefined>;
  updateUserById(id: string, user: Partial<User>): Promise<UserRow | undefined>;
  deleteUserById(id: string): Promise<boolean>;
}
