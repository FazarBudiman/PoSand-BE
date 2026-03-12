import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../domain/interface/auth.repository.interface';
import { PG_POOL } from '../../../shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { AuthenticatedUserRow } from './auth.row';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findByUsername(
    username: string,
  ): Promise<AuthenticatedUserRow | undefined> {
    const { rows } = await this.pool.query<AuthenticatedUserRow>(
      `SELECT 
        u.id,
        u.full_name,
        u.username,
        u.is_active,
        u.password_hash,
        r.role_name,
        ARRAY_AGG(p.permission_name) AS permissions
      FROM users u
      JOIN roles r ON u.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE u.username = $1
      GROUP BY 
        u.id,
        u.full_name,
        u.username,
        u.password_hash,
        r.role_name`,
      [username],
    );

    if (rows.length === 0) return undefined;

    return rows[0];
  }
}
