import { AuthenticatedUserRow } from '../../repository/auth.row';

export const AUTH_REPOSITORY = Symbol('IAuthRepository');

export interface IAuthRepository {
  findByUsername(username: string): Promise<AuthenticatedUserRow | undefined>;
}
