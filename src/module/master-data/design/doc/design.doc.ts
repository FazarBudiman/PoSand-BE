import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';

export function ApiDesign() {
  return applyDecorators(ApiTags('Master Data - Design'), ApiCookieAuth());
}

export function ApiCreateDesign() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new design with image upload' }),
    ApiConsumes('multipart/form-data'),
    ApiResponse({
      status: 201,
      description: 'Design created successfully',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            name: 'Baju Batik',
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
          message: 'Design already exists',
          errorCode: 'RESOURCE_ALREADY_EXIST',
        },
      },
    }),
  );
}

export function ApiFindAllDesigns() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all designs' }),
    ApiResponse({
      status: 200,
      description: 'Return list of designs',
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '1',
              name: 'Baju Batik',
              category: 'Batik',
            },
          ],
        },
      },
    }),
  );
}

export function ApiFindDesignById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get design by ID' }),
    ApiParam({ name: 'id', description: 'Design ID' }),
    ApiResponse({
      status: 200,
      description: 'Return design data',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            name: 'Baju Batik',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Design not found',
      schema: {
        example: {
          success: false,
          message: 'Design with ID 1 not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}

export function ApiUpdateDesign() {
  return applyDecorators(
    ApiOperation({ summary: 'Update design data' }),
    ApiParam({ name: 'id', description: 'Design ID' }),
    ApiResponse({
      status: 200,
      description: 'Design updated successfully',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            name: 'Baju Batik Updated',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Design not found',
      schema: {
        example: {
          success: false,
          message: 'Design with ID 1 not found',
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
          message: 'Design already exists',
          errorCode: 'RESOURCE_ALREADY_EXIST',
        },
      },
    }),
  );
}

export function ApiDeleteDesign() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete design' }),
    ApiParam({ name: 'id', description: 'Design ID' }),
    ApiResponse({
      status: 200,
      description: 'Design deleted successfully',
      schema: {
        example: {
          success: true,
          message: 'Design dihapus',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Design not found',
      schema: {
        example: {
          success: false,
          message: 'Design with ID 1 not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}
