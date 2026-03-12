import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { SignInDto } from '../dto/request/signin.dto';
import { AuthenticatedResponseDto } from '../dto/response/authenticated.response';

export function ApiAuth() {
  return applyDecorators(ApiTags('Auth'));
}

export function ApiSignIn() {
  return applyDecorators(
    ApiOperation({ summary: 'User Sign In' }),
    ApiBody({ type: SignInDto }),
    ApiResponse({
      status: 201,
      description: 'Login successful, tokens set in cookies',
      schema: {
        example: {
          success: true,
          message: 'Login berhasil',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request',
      schema: {
        example: {
          success: false,
          message: 'Validation Error',
          errorCode: 'VALIDATION_ERROR',
          errors: [
            {
              field: 'passord',
              error: ['property passord should not exist'],
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid credentials',
      schema: {
        example: {
          success: false,
          message: 'Username atau password salah',
          errorCode: 'INVALID_CREDENTIALS',
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden',
      schema: {
        example: {
          success: false,
          message: 'Akun tidak aktif',
          errorCode: 'ACCOUNT_INACTIVE',
        },
      },
    }),
  );
}

export function ApiRefresh() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh Access Token' }),
    ApiResponse({
      status: 201,
      description: 'Token refreshed, new tokens set in cookies',
      schema: {
        example: {
          success: true,
          message: 'Token refreshed',
        },
      },
    }),

    ApiResponse({
      status: 401,
      description: 'No refresh token provided or invalid',
      schema: {
        example: {
          success: false,
          message: 'No refresh token',
          errorCode: 'UNAUTHORIZED',
        },
      },
    }),
  );
}

export function ApiLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'User Logout' }),
    ApiResponse({
      status: 201,
      description: 'Logout successful, cookies cleared',
      schema: {
        example: {
          success: true,
          message: 'Logout berhasil',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: {
        example: {
          success: false,
          message: 'Unauthorized',
          errorCode: 'UNAUTHORIZED',
        },
      },
    }),
  );
}

export function ApiGetMe() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current authenticated user' }),
    ApiCookieAuth(),
    ApiResponse({
      status: 200,
      description: 'Return current user data',
      schema: {
        example: {
          success: true,
          data: AuthenticatedResponseDto,
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: {
        example: {
          success: false,
          message: 'Unauthorized',
          errorCode: 'UNAUTHORIZED',
        },
      },
    }),
  );
}
