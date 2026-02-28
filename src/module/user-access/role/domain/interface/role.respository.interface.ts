import { Permission } from '../permission.entity';
import { Role } from '../role.entity';

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';

export interface IRoleRepository {
  getAllPermission(): Promise<Permission[]>;
  getAllRole(): Promise<Role[]>;
  getRoleById(id: string | bigint): Promise<Role | undefined>;
  isRoleNameExist(roleName: string): Promise<boolean>;
  create(role: Role): Promise<Role>;
  updateRoleName(role: Pick<Role, 'id' | 'roleName'>): Promise<Role>;
  updateRolePermissions(role: Pick<Role, 'id' | 'permissions'>): Promise<Role>;
  deleteRoleById(id: string | bigint): Promise<boolean>;
  getRoleIsAssignByUser(roleId: string | bigint): Promise<boolean>;
}
