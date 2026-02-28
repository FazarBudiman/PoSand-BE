import { User } from '../user.entity';

export const USER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepository {
  isUsernameExist(user: Pick<User, 'username'>): Promise<boolean>;
  create(
    user: Pick<User, 'fullname' | 'username' | 'password' | 'roleId'>,
  ): Promise<User>;
  getAll(): Promise<User[]>;
  getUserById(id: string | bigint): Promise<User | undefined>;
  updateUserById(
    id: string | bigint,
    user: Partial<Pick<User, 'roleId' | 'isActive'>>,
  ): Promise<User | undefined>;
  deleteUserById(id: string | bigint): Promise<boolean>;
}
