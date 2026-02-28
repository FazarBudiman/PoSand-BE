import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenRepository } from 'src/module/auth/domain/interface/token.repository.interface';
import { JwtPayload } from 'src/shared/types/jwt-payload.type';
import { PG_POOL } from 'src/shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { Inject } from '@nestjs/common';

@Injectable()
export class TokenRepository implements ITokenRepository {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(PG_POOL) private readonly pool: Pool,
  ) {}

  generateAccessToken(payload: object): string {
    return this.jwtService.sign(payload, {
      expiresIn: '60m',
    });
  }

  generateRefreshToken(payload: object): string {
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }

  verify(token: string): JwtPayload {
    const payload = this.jwtService.verify<JwtPayload>(token);
    return payload;
  }

  async saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.pool.query(
      `INSERT INTO auth_tokens (user_id, refresh_token, expires_at) 
       VALUES ($1, $2, $3)`,
      [userId, token, expiresAt],
    );
  }

  async isRefreshTokenValid(userId: string, token: string): Promise<boolean> {
    const { rows } = await this.pool.query(
      `SELECT 1 FROM auth_tokens 
       WHERE user_id = $1 AND refresh_token = $2 AND expires_at > CURRENT_TIMESTAMP`,
      [userId, token],
    );
    return rows.length > 0;
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.pool.query(`DELETE FROM auth_tokens WHERE refresh_token = $1`, [
      token,
    ]);
  }
}
