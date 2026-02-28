import { User } from '../../../user-access/user/domain/user.entity';

export const AUTH_REPOSITORY = Symbol('IAuthRepository');

export interface IAuthRepository {
  findByUsername(username: string): Promise<User | undefined>;
}
