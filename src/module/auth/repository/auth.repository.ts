import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../domain/interface/auth.repository.interface';
import { PG_POOL } from 'src/shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { User } from 'src/module/user-access/user/domain/user.entity';

interface UserCredentials {
  id: string;
  full_name: string;
  username: string;
  password_hash: string;
  role_id: string;
  is_active: boolean;
  permission_name: string;
  role_name: string;
}

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findByUsername(username: string): Promise<User | undefined> {
    const { rows } = await this.pool.query<UserCredentials>(
      `SELECT 
        u.id,
        u.full_name,
        u.username,
        u.password_hash,
        u.is_active,
        r.role_name,
        p.permission_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE u.username = $1`,
      [username],
    );
    if (rows.length === 0) return undefined;

    const permissions = rows.map((r) => r.permission_name);
    const row = rows[0];
    const user = new User(
      row.id,
      row.full_name,
      row.username,
      row.password_hash,
      row.role_id,
      row.is_active,
      permissions,
      row.role_name,
    );
    return user;
  }
}
