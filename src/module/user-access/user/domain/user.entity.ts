export class User {
  constructor(
    public readonly id: string,
    public readonly fullname: string,
    public readonly username: string,
    public readonly password: string,
    public readonly roleId: string,
    public readonly isActive: boolean,
    public readonly permissions: string[],
    public readonly roleName: string,
  ) {}
}
