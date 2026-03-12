import { Inject, Injectable } from '@nestjs/common';
import { IRoleRepository } from '../domain/interface/role.respository.interface';
import { PG_POOL } from '../../../../shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { PgTransactionContext } from '../../../../shared/database/transaction/pg-transaction.manager';
import { RoleRow } from './role.row';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findAllRoles(): Promise<RoleRow[]> {
    const { rows } = await this.pool.query<RoleRow>(
      `SELECT 
        r.id, r.role_name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', p.id,
              'permission_name', p.permission_name
            )
          ) FILTER (WHERE p.id IS NOT NULL), '[]'
        ) AS permissions
        FROM roles r
        LEFT JOIN role_permissions rp ON r.id = rp.role_id
        LEFT JOIN permissions p ON rp.permission_id = p.id
        GROUP BY r.id, r.role_name`,
    );
    // console.log(rows);
    return rows;
  }

  async findRoleById(id: string): Promise<RoleRow | undefined> {
    const { rows } = await this.pool.query<RoleRow>(
      `SELECT 
        r.id, r.role_name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', p.id,
              'permission_name', p.permission_name
            )
          ) FILTER (WHERE p.id IS NOT NULL), '[]'
        ) AS permissions
        FROM roles r
        LEFT JOIN role_permissions rp ON r.id = rp.role_id
        LEFT JOIN permissions p ON rp.permission_id = p.id
        WHERE r.id = $1
        GROUP BY r.id, r.role_name`,
      [id],
    );
    if (rows.length === 0) return undefined;
    return rows[0];
  }

  async existsRoleByName(roleName: string): Promise<boolean> {
    const { rows } = await this.pool.query<{ exists: boolean }>(
      `SELECT EXISTS (SELECT 1 FROM roles WHERE role_name = $1)`,
      [roleName],
    );
    return rows[0].exists;
  }

  async createRole(
    roleName: string,
    txContext?: PgTransactionContext,
  ): Promise<RoleRow> {
    const client = txContext || this.pool;

    const { rows } = await client.query<RoleRow>(
      `INSERT INTO roles (role_name) VALUES ($1) RETURNING id, role_name`,
      [roleName],
    );

    return rows[0];
  }

  async updateRoleName(
    id: string,
    roleName: string,
  ): Promise<RoleRow | undefined> {
    const { rows } = await this.pool.query<RoleRow>(
      `UPDATE roles SET role_name = $1 WHERE id = $2 AND is_system = FALSE RETURNING id, role_name`,
      [roleName, id],
    );
    if (rows.length === 0) return undefined;
    return rows[0];
  }

  async deleteRoleById(id: string): Promise<boolean> {
    const { rowCount } = await this.pool.query<RoleRow>(
      `DELETE FROM roles WHERE id = $1 AND is_system = FALSE RETURNING id, role_name`,
      [id],
    );
    return rowCount !== null && rowCount > 0;
  }

  async isRoleAssignedToUser(roleId: string): Promise<boolean> {
    const { rows } = await this.pool.query<{ exists: boolean }>(
      `SELECT EXISTS (SELECT 1 FROM users WHERE role_id = $1 AND is_deleted = false)`,
      [roleId],
    );
    return rows[0].exists;
  }
}
