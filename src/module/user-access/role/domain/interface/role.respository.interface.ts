import { RoleRow } from '../../repository/role.row';
import { PgTransactionContext } from '../../../../../shared/database/transaction/pg-transaction.manager';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  findAllRoles(): Promise<RoleRow[]>;

  findRoleById(id: string): Promise<RoleRow | undefined>;

  existsRoleByName(roleName: string): Promise<boolean>;

  createRole(
    roleName: string,
    txContext?: PgTransactionContext,
  ): Promise<RoleRow>;

  updateRoleName(id: string, roleName: string): Promise<RoleRow | undefined>;

  deleteRoleById(id: string): Promise<boolean>;

  isRoleAssignedToUser(roleId: string): Promise<boolean>;
}
