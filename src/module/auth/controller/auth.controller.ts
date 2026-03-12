import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';

import { SignInDto } from '../dto/request/signin.dto';
import { AuthService } from '../service/auth.service';
import { JwtPayload } from 'src/shared/types/jwt-payload.type';
import { Public } from 'src/shared/decorators/public.decorator';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { AuthenticatedMapper } from '../mapper/authenticated.mapper';
import {
  ApiAuth,
  ApiGetMe,
  ApiLogout,
  ApiRefresh,
  ApiSignIn,
} from '../doc/auth.doc';

interface RequestWithCookies extends Request {
  cookies: Record<string, string>;
  user?: JwtPayload;
}

@ApiAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiSignIn()
  @Public()
  @Post('login')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      dto.username,
      dto.password,
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 menit
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    return { message: 'Login berhasil' };
  }

  @ApiRefresh()
  @Post('refresh')
  async refresh(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies['refresh_token'];
    if (!oldRefreshToken)
      throw new UnauthorizedException({
        message: 'No refresh token',
        errorCode: 'INVALID_TOKEN',
      });

    const { accessToken, refreshToken } =
      await this.authService.refresh(oldRefreshToken);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Token refreshed' };
  }

  @ApiLogout()
  @Post('logout')
  async logout(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logout berhasil' };
  }

  @ApiGetMe()
  @Get('me')
  async getMe(@CurrentUser('username') username: string) {
    const authenticatedUser =
      await this.authService.getAuthenticatedUser(username);
    return {
      data: AuthenticatedMapper.toResponse(authenticatedUser),
    };
  }
}
