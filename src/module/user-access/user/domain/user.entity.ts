export class User {
  constructor(
    public readonly fullname: string,
    public readonly username: string,
    public readonly password: string,
    public readonly roleId: string,
    public readonly isActive: boolean,
    // public readonly permissions: string[],
  ) {}

  static create(params: {
    fullname: string;
    username: string;
    passwordHash: string;
    roleId: string;
    isActive?: boolean;
  }): User {
    return new User(
      params.fullname,
      params.username,
      params.passwordHash,
      params.roleId,
      params.isActive ?? true,
    );
  }

  static update(params: {
    fullname?: string;
    username?: string;
    passwordHash?: string;
    roleId?: string;
    isActive?: boolean;
  }): Partial<User> {
    return params;
  }
}
