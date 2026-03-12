import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RequirePermissions } from '../../../../shared/decorators/permission.decorator';
import { ProductMapper } from '../mapper/product.mapper';
import {
  ProductCreateRequestDto,
  ProductUpdateRequestDto,
  ProductVariantCreateRequestDto,
} from '../dto/request/product.request';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import {
  ApiCreateProduct,
  ApiCreateProductVariant,
  ApiDeleteProduct,
  ApiFindAllProducts,
  ApiFindProductById,
  ApiFindStockHistory,
  ApiProduct,
  ApiUpdateProduct,
} from '../doc/product.doc';
import { ProductService } from '../service/product.service';
import { ProductStockMapper } from '../mapper/product-stock.mapper';

@ApiProduct()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiCreateProduct()
  @Post()
  @RequirePermissions('product:create')
  async create(
    @Body() body: ProductCreateRequestDto,
    @CurrentUser('sub') userId: string,
  ) {
    const product = await this.productService.createProduct(body, userId);
    return {
      message: 'Product created',
      data: ProductMapper.toResponse(product),
    };
  }

  @ApiFindAllProducts()
  @Get()
  @RequirePermissions('product:read')
  async findAll() {
    const products = await this.productService.findAllProducts();
    return {
      data: ProductMapper.toResponseList(products),
    };
  }

  @ApiFindProductById()
  @Get('/:id')
  @RequirePermissions('product:read')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findProductById(id);
    return {
      data: ProductMapper.toResponse(product),
    };
  }

  @ApiCreateProductVariant()
  @Post('/:id/variants')
  @RequirePermissions('product:create')
  async createVariant(
    @Param('id') id: string,
    @Body() body: ProductVariantCreateRequestDto,
    @CurrentUser('sub') userId: string,
  ) {
    const product = await this.productService.createProductVariant(
      id,
      body,
      userId,
    );
    return {
      data: ProductMapper.toResponse(product),
    };
  }

  @ApiFindStockHistory()
  @Get('/:id/stock-history')
  @RequirePermissions('product:read')
  async findStockHistory(@Param('id') id: string) {
    const stockHistory =
      await this.productService.findStockHistoryByProductId(id);
    return {
      data: ProductStockMapper.toResponseList(stockHistory),
    };
  }

  @ApiUpdateProduct()
  @Patch('/:id')
  @RequirePermissions('product:update')
  async update(
    @Param('id') id: string,
    @Body() body: ProductUpdateRequestDto,
    @CurrentUser('sub') userWhoUpdated: string,
  ) {
    const product = await this.productService.updateProductById(
      id,
      body,
      userWhoUpdated,
    );
    return {
      data: ProductMapper.toResponse(product),
    };
  }

  @ApiDeleteProduct()
  @Delete('/:id')
  @RequirePermissions('product:delete')
  async delete(@Param('id') id: string) {
    await this.productService.deleteProductById(id);
    return {
      message: 'Product deleted',
    };
  }
}
