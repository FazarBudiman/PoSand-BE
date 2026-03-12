import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';

export function ApiRole() {
  return applyDecorators(ApiTags('Role'), ApiCookieAuth());
}

export function ApiFindAllPermissions() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all available permissions' }),
    ApiResponse({
      status: 200,
      description: 'Return list of permissions',
      schema: {
        example: {
          success: true,
          data: [
            { id: '1', permissionName: 'user:read' },
            { id: '2', permissionName: 'user:create' },
          ],
        },
      },
    }),
  );
}

export function ApiFindAllRoles() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all roles' }),
    ApiResponse({
      status: 200,
      description: 'Return list of roles',
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '1',
              roleName: 'ADMIN',
              permissions: [{ id: '1', permissionName: 'user:read' }],
            },
          ],
        },
      },
    }),
  );
}

export function ApiFindRoleById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get role by ID' }),
    ApiParam({ name: 'id', description: 'Role ID' }),
    ApiResponse({
      status: 200,
      description: 'Return role data',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            roleName: 'ADMIN',
            permissions: [{ id: '1', permissionName: 'user:read' }],
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Role not found',
      schema: {
        example: {
          success: false,
          message: 'Role not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}

export function ApiCreateRole() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new role' }),
    ApiResponse({
      status: 201,
      description: 'Role created successfully',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            roleName: 'ADMIN',
            permissions: [{ id: '1', permissionName: 'user:read' }],
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
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Role name already exists',
      schema: {
        example: {
          success: false,
          message: 'Role name already exists',
          errorCode: 'RESOURCE_ALREADY_EXIST',
        },
      },
    }),
  );
}

export function ApiUpdateRole() {
  return applyDecorators(
    ApiOperation({ summary: 'Update role data' }),
    ApiParam({ name: 'id', description: 'Role ID' }),
    ApiResponse({
      status: 200,
      description: 'Role updated successfully',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            roleName: 'ADMIN_UPDATED',
            permissions: [{ id: '2', permissionName: 'user:create' }],
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Role not found',
      schema: {
        example: {
          success: false,
          message: 'Role not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Cannot update system role',
      schema: {
        example: {
          success: false,
          message: 'Role is system role, cannot update',
          errorCode: 'ROLE_IS_SYSTEM',
        },
      },
    }),
  );
}

export function ApiDeleteRole() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete role' }),
    ApiParam({ name: 'id', description: 'Role ID' }),
    ApiResponse({
      status: 200,
      description: 'Role deleted successfully',
      schema: {
        example: {
          success: true,
          message: 'Role deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Role not found',
      schema: {
        example: {
          success: false,
          message: 'Role not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Role in use',
      schema: {
        example: {
          success: false,
          message: 'Role cannot be deleted while assigned to users',
          errorCode: 'RESOURCE_IN_USE',
        },
      },
    }),
  );
}
