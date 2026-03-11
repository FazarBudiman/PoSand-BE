import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { PermissionRow } from '../../repository/permission.row';

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

export interface IPermissionRepository {
  findAllPermissions(): Promise<PermissionRow[]>;

  assignPermissionIntoRole(
    roleId: string,
    permissionIds: string[],
    pgContext?: PgTransactionContext,
  ): Promise<PermissionRow[]>;

  deleteAssignedPermission(
    roleId: string,
    txContext?: PgTransactionContext,
  ): Promise<void>;
}
