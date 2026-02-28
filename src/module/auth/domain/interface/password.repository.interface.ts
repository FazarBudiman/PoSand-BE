export const PASSWORD_REPOSITORY = Symbol('IPasswordRepository');

export interface IPasswordRepository {
  hash(password: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}
