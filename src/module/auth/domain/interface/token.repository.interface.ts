import { JwtPayload } from '../../../../shared/types/jwt-payload.type';

export const TOKEN_REPOSITORY = Symbol('ITokenRepository');

export interface ITokenRepository {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verify(token: string): JwtPayload;
  saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void>;
  isRefreshTokenValid(userId: string, token: string): Promise<boolean>;
  deleteRefreshToken(token: string): Promise<void>;
}
