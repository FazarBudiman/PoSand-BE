import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';

export function ApiSale() {
  return applyDecorators(ApiTags('Sale'), ApiCookieAuth());
}

export function ApiCreateSale() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new sale transaction' }),
    ApiResponse({
      status: 201,
      description: 'Sale created successfully',
      schema: {
        example: {
          success: true,
          message: 'Sale created',
          data: {
            id: '1',
            invoiceNumber: 'INV-2024-001',
            grandTotal: 100000,
            status: 'UNPAID',
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
      status: 404,
      description: 'Customer or Product variant not found',
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
      description: 'Conflict - Insufficient stock',
      schema: {
        example: {
          success: false,
          message: 'Stock not enough',
          errorCode: 'CONFLICT_RESOURCE',
        },
      },
    }),
  );
}

export function ApiFindAllSales() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all sale transactions' }),
    ApiResponse({
      status: 200,
      description: 'Return list of sales',
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '1',
              invoiceNumber: 'INV-2024-001',
              grandTotal: 100000,
              status: 'PAID',
            },
          ],
        },
      },
    }),
  );
}

export function ApiCreateSalePayment() {
  return applyDecorators(
    ApiOperation({ summary: 'Create payment for a sale' }),
    ApiParam({ name: 'id', description: 'Sale ID' }),
    ApiResponse({
      status: 201,
      description: 'Payment successful',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            totalPaid: 100000,
            remainingAmount: 0,
            status: 'PAID',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Sale not UNPAID',
      schema: {
        example: {
          success: false,
          message: 'Product sale is not in UNPAID status',
          errorCode: 'BAD_REQUEST',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Sale not found',
      schema: {
        example: {
          success: false,
          message: 'Product sale not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Payment exceeds grand total',
      schema: {
        example: {
          success: false,
          message: 'Paid melebihi grand total',
          errorCode: 'CONFLICT_RESOURCE',
        },
      },
    }),
  );
}

export function ApiGetSaleReceipt() {
  return applyDecorators(
    ApiOperation({ summary: 'Get sale receipt and create snapshot' }),
    ApiParam({ name: 'id', description: 'Sale ID' }),
    ApiResponse({
      status: 200,
      description: 'Return receipt data',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            invoiceNumber: 'INV-2024-001',
            customerName: 'John Doe',
            items: [],
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Sale not found',
      schema: {
        example: {
          success: false,
          message: 'Product sale not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}
