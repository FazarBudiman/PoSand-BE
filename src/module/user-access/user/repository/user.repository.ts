import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../domain/interfaces/user.repository.interface';
import { PG_POOL } from 'src/shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { User } from '../domain/user.entity';

interface UserRow {
  id: string;
  full_name: string;
  username?: string;
  password_hash?: string;
  role_id?: string;
  is_active?: boolean;
  role_name?: string;
  permission_name?: string[];
}

function mapToEntity(row: UserRow): User {
  return new User(
    row.id,
    row.full_name,
    row.username ?? '',
    row.password_hash ?? '',
    row.role_id ?? '',
    row.is_active ?? false,
    row.permission_name ?? [],
    row.role_name ?? '',
  );
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async isUsernameExist(user: Pick<User, 'username'>): Promise<boolean> {
    const { rows } = await this.pool.query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1  FROM users u WHERE u.username = $1)`,
      [user.username],
    );

    return rows[0].exists;
  }

  async create(
    user: Pick<User, 'fullname' | 'username' | 'password' | 'roleId'>,
  ): Promise<User> {
    const { rows } = await this.pool.query<UserRow>(
      `WITH inserted AS (
        INSERT INTO users (full_name, username, password_hash, role_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, full_name, username, password_hash, role_id, is_active
      )
      SELECT 
        i.*, r.role_name, ARRAY_AGG(p.permission_name) as permission_name
      FROM inserted i
      JOIN roles r ON i.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      GROUP BY i.id, i.full_name, i.username, i.password_hash, i.role_id, i.is_active, r.role_name`,
      [user.fullname, user.username, user.password, user.roleId],
    );

    return mapToEntity(rows[0]);
  }

  async getAll(): Promise<User[]> {
    const { rows } = await this.pool.query<UserRow>(`
      SELECT 
        u.id, 
        u.full_name, 
        u.username, 
        u.password_hash, 
        u.role_id, 
        u.is_active, 
        r.role_name, 
        ARRAY_AGG(p.permission_name) as permission_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE u.is_deleted = false
      GROUP BY u.id, r.role_name
      `);

    return rows.map((row) => mapToEntity(row));
  }

  async getUserById(id: string | bigint): Promise<User | undefined> {
    const { rows } = await this.pool.query<UserRow>(
      `SELECT 
        u.id, 
        u.full_name, 
        u.username, 
        u.password_hash, 
        u.role_id, 
        u.is_active, 
        r.role_name,
        ARRAY_AGG(p.permission_name) as permission_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE u.id = $1 AND u.is_deleted = false
      GROUP BY u.id, r.role_name`,
      [id],
    );

    if (rows.length === 0) return undefined;

    return mapToEntity(rows[0]);
  }

  async updateUserById(
    id: string | bigint,
    user: Partial<Pick<User, 'roleId' | 'isActive'>>,
  ): Promise<User | undefined> {
    const values: any[] = [];
    let query = `UPDATE users SET`;
    let index = 1;

    if (user.roleId) {
      query += ` role_id = $${index++},`;
      values.push(user.roleId);
    }
    if (user.isActive) {
      query += ` is_active = $${index++},`;
      values.push(user.isActive);
    }
    query = query.slice(0, -1);
    query += ` WHERE id = $${index} RETURNING id, full_name, username, password_hash, role_id, is_active`;
    values.push(id);

    const fullQuery = `
      WITH updated AS (
        ${query}
      )
      SELECT 
        u.*, r.role_name, ARRAY_AGG(p.permission_name) as permission_name
      FROM updated u
      JOIN roles r ON u.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      GROUP BY u.id, u.full_name, u.username, u.password_hash, u.role_id, u.is_active, r.role_name
    `;

    // console.log(fullQuery);
    // console.log(values);

    const { rows } = await this.pool.query<UserRow>(fullQuery, values);

    if (rows.length === 0) return undefined;

    return mapToEntity(rows[0]);
  }

  async deleteUserById(id: string | bigint): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      `UPDATE users SET is_deleted = true, is_active = false WHERE id = $1 AND is_deleted = false RETURNING id`,
      [id],
    );

    return rowCount !== null && rowCount > 0;
  }
}
