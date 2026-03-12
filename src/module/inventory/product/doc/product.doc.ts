import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';

export function ApiProduct() {
  return applyDecorators(ApiTags('Inventory - Product'), ApiCookieAuth());
}

export function ApiCreateProduct() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new product' }),
    ApiResponse({
      status: 201,
      description: 'Product created successfully',
      schema: {
        example: {
          success: true,
          message: 'Product created',
          data: {
            id: '1',
            name: 'Kaos Polos',
            sellingPrice: 50000,
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
  );
}

export function ApiFindAllProducts() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all products' }),
    ApiResponse({
      status: 200,
      description: 'Return list of products',
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '1',
              name: 'Kaos Polos',
              sellingPrice: 50000,
              stock: [{ sizeId: '1', sizeName: 'XL', quantity: 10 }],
            },
          ],
        },
      },
    }),
  );
}

export function ApiFindProductById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get product by ID' }),
    ApiParam({ name: 'id', description: 'Product ID' }),
    ApiResponse({
      status: 200,
      description: 'Return product data',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            name: 'Kaos Polos',
            sellingPrice: 50000,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found',
      schema: {
        example: {
          success: false,
          message: 'Product not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}

export function ApiUpdateProduct() {
  return applyDecorators(
    ApiOperation({ summary: 'Update product data' }),
    ApiParam({ name: 'id', description: 'Product ID' }),
    ApiResponse({
      status: 200,
      description: 'Product updated successfully',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            name: 'Kaos Polos Updated',
            sellingPrice: 55000,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found',
      schema: {
        example: {
          success: false,
          message: 'Product not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}

export function ApiDeleteProduct() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete product' }),
    ApiParam({ name: 'id', description: 'Product ID' }),
    ApiResponse({
      status: 200,
      description: 'Product deleted successfully',
      schema: {
        example: {
          success: true,
          message: 'Product deleted',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Active stock exists',
      schema: {
        example: {
          success: false,
          message:
            'Product cannot be deleted because it still has active stock',
          errorCode: 'PRODUCT_HAS_ACTIVE_STOCK',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found',
      schema: {
        example: {
          success: false,
          message: 'Product not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}

export function ApiCreateProductVariant() {
  return applyDecorators(
    ApiOperation({ summary: 'Add product variants (stock)' }),
    ApiParam({ name: 'id', description: 'Product ID' }),
    ApiResponse({
      status: 201,
      description: 'Variants created successfully',
      schema: {
        example: {
          success: true,
          data: {
            id: '1',
            name: 'Kaos Polos',
            stock: [{ sizeId: '1', sizeName: 'XL', quantity: 15 }],
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product or Size group not found',
      schema: {
        example: {
          success: false,
          message: 'Product not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Invalid size ID',
      schema: {
        example: {
          success: false,
          message: 'Invalid size id',
          errorCode: 'INVALID_SIZE_ID',
        },
      },
    }),
  );
}

export function ApiFindStockHistory() {
  return applyDecorators(
    ApiOperation({ summary: 'Get stock history for product' }),
    ApiParam({ name: 'id', description: 'Product ID' }),
    ApiResponse({
      status: 200,
      description: 'Return stock history',
      schema: {
        example: {
          success: true,
          data: [
            {
              productId: '1',
              productName: 'Kaos Polos',
              variantId: '1',
              sizeName: 'XL',
              quantityStock: 10,
              stockHistory: [],
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found',
      schema: {
        example: {
          success: false,
          message: 'Product not found',
          errorCode: 'RESOURCE_NOT_FOUND',
        },
      },
    }),
  );
}
