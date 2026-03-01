import { Inject, Injectable } from '@nestjs/common';
import { IRoleRepository } from '../domain/interface/role.respository.interface';
import { Role } from '../domain/role.entity';
import { PG_POOL } from 'src/shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { Permission } from '../domain/permission.entity';

interface RoleRow {
  id: string;
  role_name: string;
  permission_name: Permission[];
}

interface PermissionRow {
  id: string;
  permission_name: string;
}

function mapToEntity(row: RoleRow): Role {
  return new Role(row.id, row.role_name, row.permission_name);
}

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}
  async getAllPermission(): Promise<Permission[]> {
    const { rows } = await this.pool.query<PermissionRow>(
      `SELECT id, permission_name FROM permissions`,
    );
    return rows.map((row) => new Permission(row.id, row.permission_name));
  }

  async getAllRole(): Promise<Role[]> {
    const { rows } = await this.pool.query<RoleRow>(
      `SELECT r.id, r.role_name, ARRAY_AGG(p.permission_name) as permission_name 
        FROM roles r 
        JOIN role_permissions rp ON r.id = rp.role_id 
        JOIN permissions p ON rp.permission_id = p.id 
        GROUP BY r.id, r.role_name`,
    );

    return rows.map((row) => mapToEntity(row));
  }
  async getRoleById(id: string): Promise<Role | undefined> {
    const { rows } = await this.pool.query<RoleRow>(
      `SELECT r.id, r.role_name, ARRAY_AGG(p.permission_name) as permission_name 
        FROM roles r 
        JOIN role_permissions rp ON r.id = rp.role_id 
        JOIN permissions p ON rp.permission_id = p.id 
        WHERE r.id = $1
        GROUP BY r.id, r.role_name`,
      [id],
    );
    if (rows.length === 0) return undefined;

    return mapToEntity(rows[0]);
  }
  async isRoleNameExist(roleName: string): Promise<boolean> {
    const { rows } = await this.pool.query<{ exists: boolean }>(
      `SELECT EXISTS (SELECT 1 FROM roles WHERE role_name = $1)`,
      [roleName],
    );
    return rows[0].exists;
  }
  async create(role: Role): Promise<Role> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query<RoleRow>(
        `INSERT INTO roles (role_name) VALUES ($1) RETURNING id, role_name`,
        [role.roleName],
      );
      const roleId = rows[0].id;

      if (role.permissions && role.permissions.length > 0) {
        const values = [roleId];
        const placeholders = role.permissions
          .map((permisson, index) => {
            values.push(permisson.id);
            return `($1, $${index + 2})`;
          })
          .join(', ');

        const queryAssignPermission = `INSERT INTO role_permissions (role_id, permission_id) VALUES ${placeholders}`;
        await client.query(queryAssignPermission, values);
      }

      await client.query('COMMIT');

      return new Role(roleId, rows[0].role_name, role.permissions);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateRoleName(
    role: Pick<Role, 'id' | 'roleName'>,
  ): Promise<Role | undefined> {
    const { rows } = await this.pool.query<RoleRow>(
      `UPDATE roles SET role_name = $1 WHERE id = $2 AND is_system = FALSE RETURNING id, role_name`,
      [role.roleName, role.id],
    );
    if (rows.length === 0) {
      return undefined;
    }
    return mapToEntity(rows[0]);
  }

  async updateRolePermissions(
    role: Pick<Role, 'id' | 'permissions'>,
  ): Promise<Role> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(`DELETE FROM role_permissions WHERE role_id = $1`, [
        role.id,
      ]);
      if (role.permissions && role.permissions.length > 0) {
        const values = [role.id];
        const placeholders = role.permissions
          .map((permisson, index) => {
            values.push(permisson.id);
            return `($1, $${index + 2})`;
          })
          .join(', ');

        const queryAssignPermission = `INSERT INTO role_permissions (role_id, permission_id) VALUES ${placeholders}`;
        await client.query(queryAssignPermission, values);
      }

      await client.query('COMMIT');

      return new Role(role.id, '', role.permissions);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  async deleteRoleById(id: string | bigint): Promise<boolean> {
    const { rowCount } = await this.pool.query<RoleRow>(
      `DELETE FROM roles WHERE id = $1 AND is_system = FALSE RETURNING id, role_name`,
      [id],
    );
    return rowCount !== null && rowCount > 0;
  }

  async getRoleIsAssignByUser(roleId: string | bigint): Promise<boolean> {
    const { rows } = await this.pool.query<{ exists: boolean }>(
      `SELECT EXISTS (SELECT 1 FROM users WHERE role_id = $1 AND is_deleted = false)`,
      [roleId],
    );
    return rows[0].exists;
  }
}
