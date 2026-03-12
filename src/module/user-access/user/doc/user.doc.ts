import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';

export function ApiUser() {
  return applyDecorators(ApiTags('User'), ApiCookieAuth());
}

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new user' }),
    ApiResponse({
      status: 201,
      description: 'User created successfully',
      schema: {
        example: {
          success: true,
          message: 'User berhasil dibuat',
          data: {
            id: '1',
            fullname: 'John Doe',
            username: 'johndoe',
            roleName: 'ADMIN',
            isActive: true,
            permissions: ['user:read'],
          },
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
              field: 'username',
              error: ['username should not be empty'],
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
      schema: {
        example: {
          success: false,
          message: 'Forbidden resource',
          errorCode: 'FORBIDDEN',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Username already exists',
      schema: {
        example: {
          success: false,
          message: 'Username sudah digunakan',
          errorCode: 'RESOURCE_ALREADY_EXIST',
        },
      },
    }),
  );
}

export function ApiFindAllUsers() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users' }),
    ApiResponse({
      status: 200,
      description: 'Return list of users',
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '1',
              fullname: 'John Doe',
              username: 'johndoe',
              roleName: 'ADMIN',
              isActive: true,
              permissions: ['user:read'],
            },
          ],
        },
      },
    }),
  );
}

export function ApiFindUserById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user by ID' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({
      status: 200,
      description: 'Return user data',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            fullname: 'John Doe',
            username: 'johndoe',
            roleName: 'ADMIN',
            isActive: true,
            permissions: ['user:read'],
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
      schema: {
        example: {
          success: false,
          message: 'User tidak ditemukan',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Update user data' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({
      status: 200,
      description: 'User updated successfully',
      schema: {
        example: {
          success: true,
          message: 'User berhasil diupdate',
          data: {
            id: '1',
            fullname: 'John Updated',
            username: 'johndoe',
            roleName: 'ADMIN',
            isActive: true,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
      schema: {
        example: {
          success: false,
          message: 'User tidak ditemukan',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}

export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete user' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({
      status: 200,
      description: 'User deleted successfully',
      schema: {
        example: {
          success: true,
          message: 'User berhasil dihapus',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
      schema: {
        example: {
          success: false,
          message: 'User tidak ditemukan',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}
