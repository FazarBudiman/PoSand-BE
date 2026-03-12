import { Inject, Injectable } from '@nestjs/common';
import { IPermissionRepository } from '../domain/interface/permission.repository.interface';
import { PG_POOL } from '../../../../shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { PermissionRow } from './permission.row';
import { PgTransactionContext } from '../../../../shared/database/transaction/pg-transaction.manager';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findAllPermissions(): Promise<PermissionRow[]> {
    const { rows } = await this.pool.query<PermissionRow>(
      `SELECT id, permission_name FROM permissions`,
    );
    return rows;
  }

  async assignPermissionIntoRole(
    roleId: string,
    permissionIds: string[],
    pgContext?: PgTransactionContext,
  ): Promise<PermissionRow[]> {
    const client = pgContext || this.pool;
    if (permissionIds && permissionIds.length > 0) {
      const { rows } = await client.query<PermissionRow>(
        `
        WITH inserted AS (
          INSERT INTO role_permissions (role_id, permission_id)
          SELECT $1, unnest($2::bigint[])
          RETURNING permission_id
        )
        SELECT p.id, p.permission_name
        FROM inserted i
        JOIN permissions p ON p.id = i.permission_id
        `,
        [roleId, permissionIds],
      );
      return rows;
    }
    return [];
  }

  async deleteAssignedPermission(
    roleId: string,
    txContext?: PgTransactionContext,
  ): Promise<void> {
    const client = txContext || this.pool;
    await client.query(`DELETE FROM role_permissions WHERE role_id = $1`, [
      roleId,
    ]);
  }
}
