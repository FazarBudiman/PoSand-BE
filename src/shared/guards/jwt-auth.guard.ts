import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { TOKEN_REPOSITORY } from 'src/module/auth/domain/interface/token.repository.interface';
import type { ITokenRepository } from 'src/module/auth/domain/interface/token.repository.interface';
import { JwtPayload } from '../types/jwt-payload.type';

interface RequestWithCookies extends Request {
  cookies: Record<string, string | undefined>;
  user?: JwtPayload;
}

import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenService: ITokenRepository,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithCookies>();

    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Token tidak ditemukan');
    }

    try {
      const payload = this.tokenService.verify(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token tidak valid');
    }
  }
}
