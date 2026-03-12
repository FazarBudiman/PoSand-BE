import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';

export function ApiSize() {
  return applyDecorators(ApiTags('Inventory - Size'), ApiCookieAuth());
}

export function ApiCreateSizeGroup() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new size group' }),
    ApiResponse({
      status: 201,
      description: 'Size group created successfully',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            groupName: 'Adult Size',
            sizes: [
              { id: '1', sizeName: 'S' },
              { id: '2', sizeName: 'M' },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Name already exists',
      schema: {
        example: {
          success: false,
          message: 'Size group name already exists',
          errorCode: 'RESOURCE_ALREADY_EXIST',
        },
      },
    }),
  );
}

export function ApiFindAllSizeGroups() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all size groups' }),
    ApiResponse({
      status: 200,
      description: 'Return list of size groups',
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '1',
              groupName: 'Adult Size',
              sizes: [{ id: '1', sizeName: 'S' }],
            },
          ],
        },
      },
    }),
  );
}

export function ApiFindSizeGroupById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get size group by ID' }),
    ApiParam({ name: 'id', description: 'Size Group ID' }),
    ApiResponse({
      status: 200,
      description: 'Return size group data',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            groupName: 'Adult Size',
            sizes: [{ id: '1', sizeName: 'S' }],
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Size group not found',
      schema: {
        example: {
          success: false,
          message: 'Size group not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}

export function ApiUpdateSizeGroup() {
  return applyDecorators(
    ApiOperation({ summary: 'Update size group data' }),
    ApiParam({ name: 'id', description: 'Size Group ID' }),
    ApiResponse({
      status: 200,
      description: 'Size group updated successfully',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            groupName: 'Adult updated',
            sizes: [{ id: '1', sizeName: 'S' }],
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Size group not found',
      schema: {
        example: {
          success: false,
          message: 'Size group not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Name already exists',
      schema: {
        example: {
          success: false,
          message: 'Size group name already exists',
          errorCode: 'RESOURCE_ALREADY_EXIST',
        },
      },
    }),
  );
}

export function ApiDeleteSizeGroup() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete size group' }),
    ApiParam({ name: 'id', description: 'Size Group ID' }),
    ApiResponse({
      status: 200,
      description: 'Size group deleted successfully',
      schema: {
        example: {
          success: true,
          message: 'Size group dihapus',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Size group not found',
      schema: {
        example: {
          success: false,
          message: 'Size group not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}
