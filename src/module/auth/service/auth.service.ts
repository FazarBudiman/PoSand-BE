import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TOKEN_REPOSITORY } from 'src/module/auth/domain/interface/token.repository.interface';
import type { ITokenRepository } from 'src/module/auth/domain/interface/token.repository.interface';
import { PASSWORD_REPOSITORY } from '../domain/interface/password.repository.interface';
import type { IPasswordRepository } from '../domain/interface/password.repository.interface';
import { AUTH_REPOSITORY } from '../domain/interface/auth.repository.interface';
import type { IAuthRepository } from '../domain/interface/auth.repository.interface';
import { JwtPayload } from 'src/shared/types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,

    @Inject(PASSWORD_REPOSITORY)
    private readonly passwordRepository: IPasswordRepository,

    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  // Sign In
  async signIn(username: string, password: string) {
    const user = await this.authRepository.findByUsername(username);

    if (!user)
      throw new UnauthorizedException(
        'Username atau password salah',
        'INVALID_CREDENTIALS',
      );

    if (!user.isActive)
      throw new ForbiddenException({
        message: 'Akun tidak aktif',
        errorCode: 'ACCOUNT_INACTIVE',
      });

    const isValid = await this.passwordRepository.compare(
      password,
      user.password,
    );

    if (!isValid)
      throw new UnauthorizedException(
        'Username atau password salah',
        'INVALID_CREDENTIALS',
      );

    const payload = {
      sub: user.id,
      username: user.username,
      roleId: user.roleId,
      permissions: user.permissions,
    };

    const accessToken = this.tokenRepository.generateAccessToken(payload);
    const refreshToken = this.tokenRepository.generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.tokenRepository.saveRefreshToken(
      user.id,
      refreshToken,
      expiresAt,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  // Refresh Token
  async refresh(token: string) {
    try {
      const payload: JwtPayload = this.tokenRepository.verify(token);
      const isValid = await this.tokenRepository.isRefreshTokenValid(
        payload.sub,
        token,
      );

      if (!isValid)
        throw new UnauthorizedException('Token tidak valid', 'INVALID_TOKEN');

      // Hapus token lama
      await this.tokenRepository.deleteRefreshToken(token);

      // Generate token baru
      const newPayload = {
        sub: payload.sub,
        username: payload.username,
        roleId: payload.roleId,
        permissions: payload.permissions,
      };

      const accessToken = this.tokenRepository.generateAccessToken(newPayload);
      const refreshToken =
        this.tokenRepository.generateRefreshToken(newPayload);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await this.tokenRepository.saveRefreshToken(
        payload.sub,
        refreshToken,
        expiresAt,
      );

      return { accessToken, refreshToken };
    } catch {
      throw new UnauthorizedException('Session expired');
    }
  }

  // Get Authenticated User
  async getAuthenticatedUser(username: string) {
    const user = await this.authRepository.findByUsername(username);
    if (!user)
      throw new UnauthorizedException('User belum login', 'UNAUTHORIZED');

    return user;
  }

  // Logout
  async logout(token: string) {
    await this.tokenRepository.deleteRefreshToken(token);
  }
}
