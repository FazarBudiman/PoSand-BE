import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RequirePermissions } from 'src/shared/decorators/permission.decorator';
import { ProductMapper } from '../mapper/product.mapper';
import {
  ProductCreateRequestDto,
  ProductUpdateRequestDto,
  ProductVariantCreateRequestDto,
} from '../dto/request/product.request';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ProductService } from '../service/product.service';
import { ProductStockMapper } from '../mapper/product-stock.mapper';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @RequirePermissions('product:create')
  async createProduct(
    @Body() body: ProductCreateRequestDto,
    @CurrentUser('sub') userWhoCreated: string,
  ) {
    const product = await this.productService.createProduct(
      body,
      userWhoCreated,
    );
    return {
      data: ProductMapper.toResponse(product),
    };
  }

  @Get()
  @RequirePermissions('product:read')
  async findAllProducts() {
    const products = await this.productService.findAllProducts();
    return {
      data: ProductMapper.toResponseList(products),
    };
  }

  @Get('/:id')
  @RequirePermissions('product:read')
  async findProductById(@Param('id') id: string) {
    const product = await this.productService.findProductById(id);
    return {
      data: ProductMapper.toResponse(product),
    };
  }

  @Post('/:id/stock')
  @RequirePermissions('product:create')
  async createProductVariant(
    @Param('id') productId: string,
    @Body() body: ProductVariantCreateRequestDto,
    @CurrentUser('sub') userWhoCreated: string,
  ) {
    const product = await this.productService.createProductVariant(
      productId,
      body,
      userWhoCreated,
    );
    return {
      data: ProductMapper.toResponse(product),
    };
  }

  @Get('/:id/stock')
  @RequirePermissions('product:read')
  async findStockHistoryByProductId(@Param('id') id: string) {
    const productStocks =
      await this.productService.findStockHistoryByProductId(id);
    return {
      data: ProductStockMapper.toResponseList(productStocks),
    };
  }

  @Patch('/:id')
  @RequirePermissions('product:update')
  async updateProduct(
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

  @Delete('/:id')
  @RequirePermissions('product:delete')
  async deleteProduct(@Param('id') id: string) {
    await this.productService.deleteProductById(id);
    return {
      message: 'Product deleted successfully',
    };
  }
}
