import { Permission } from './permission.entity';

export class Role {
  constructor(
    public readonly id: string,
    public readonly roleName: string,
    public readonly permissions: Permission[],
  ) {}
}
