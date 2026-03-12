import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';

export function ApiCustomer() {
  return applyDecorators(ApiTags('Master Data - Customer'), ApiCookieAuth());
}

export function ApiCreateCustomer() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new customer' }),
    ApiResponse({
      status: 201,
      description: 'Customer created successfully',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            fullname: 'John Doe',
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
          message: 'Name customer is same',
          errorCode: 'RESOURCE_ALREADY_EXIST',
        },
      },
    }),
  );
}

export function ApiFindAllCustomers() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all customers' }),
    ApiResponse({
      status: 200,
      description: 'Return list of customers',
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '1',
              fullname: 'John Doe',
              phone: '08123456789',
            },
          ],
        },
      },
    }),
  );
}

export function ApiFindCustomerById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get customer by ID' }),
    ApiParam({ name: 'id', description: 'Customer ID' }),
    ApiResponse({
      status: 200,
      description: 'Return customer data',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            fullname: 'John Doe',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Customer not found',
      schema: {
        example: {
          success: false,
          message: 'Customer tidak ditemukan',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}

export function ApiUpdateCustomer() {
  return applyDecorators(
    ApiOperation({ summary: 'Update customer data' }),
    ApiParam({ name: 'id', description: 'Customer ID' }),
    ApiResponse({
      status: 200,
      description: 'Customer updated successfully',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            fullname: 'John Updated',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Customer not found',
      schema: {
        example: {
          success: false,
          message: 'Customer not found',
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
          message: 'Name customer is same',
          errorCode: 'RESOURCE_ALREADY_EXIST',
        },
      },
    }),
  );
}

export function ApiDeleteCustomer() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete customer' }),
    ApiParam({ name: 'id', description: 'Customer ID' }),
    ApiResponse({
      status: 200,
      description: 'Customer deleted successfully',
      schema: {
        example: {
          success: true,
          message: 'Customer dihapus',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Customer not found',
      schema: {
        example: {
          success: false,
          message: 'Customer tidak ditemukan',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}
