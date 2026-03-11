export class Role {
  constructor(
    public readonly roleName: string,
    public readonly permissions: string[],
  ) {}

  static create(params: { roleName: string; permissions: string[] }): Role {
    return new Role(params.roleName, params.permissions);
  }
}
