import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../domain/interface/product.repository.interface';
import type { IProductRepository } from '../domain/interface/product.repository.interface';
import { PRODUCT_VARIANT_REPOSITORY } from '../domain/interface/product-variant.repository.interface';
import type { IProductVariantRepository } from '../domain/interface/product-variant.repository.interface';
import { STOCK_MOVEMENT_REPOSITORY } from '../domain/interface/stock-movement.repository.interface';
import type { IStockMovementRepository } from '../domain/interface/stock-movement.repository.interface';
import { PRODUCT_STOCK_REPOSITORY } from '../domain/interface/product-stock.repository.interface';
import type { IProductStockRepository } from '../domain/interface/product-stock.repository.interface';
import { Product } from '../domain/product.entity';
import {
  ProductCreateRequestDto,
  ProductUpdateRequestDto,
  ProductVariantCreateRequestDto,
} from '../dto/request/product.request';
import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { TRANSACTION_MANAGER } from 'src/shared/database/tokens/transaction.token';
import type { ITransactionManager } from 'src/shared/database/transaction/transaction-manager.interface';
import { NotFoundException } from 'src/shared/exceptions/not-found.exception';
import { SIZE_REPOSITORY } from '../../size/domain/interface/size.repository.interface';
import type { ISizeRepository } from '../../size/domain/interface/size.repository.interface';
import { ConflictException } from 'src/shared/exceptions/conflict.exception';
import { SIZE_GROUP_REPOSITORY } from '../../size/domain/interface/size-group.repository.interface';
import type { ISizeGroupRepository } from '../../size/domain/interface/size-group.repository.interface';
import { ProductRow } from '../repository/product.row';
import { ProductVariant } from '../domain/product-variant.entity';
import { ProductStockRow } from '../repository/product-stock.row';
import { BadRequestException } from 'src/shared/exceptions/bad-request.exception';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,

    @Inject(SIZE_REPOSITORY)
    private readonly sizeRepository: ISizeRepository,

    @Inject(SIZE_GROUP_REPOSITORY)
    private readonly sizeGroupRepository: ISizeGroupRepository,

    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly productVariantRepository: IProductVariantRepository,

    @Inject(STOCK_MOVEMENT_REPOSITORY)
    private readonly stockMovementRepository: IStockMovementRepository,

    @Inject(PRODUCT_STOCK_REPOSITORY)
    private readonly productStockRepository: IProductStockRepository,

    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: ITransactionManager,
  ) {}

  // Create Product
  async createProduct(
    body: ProductCreateRequestDto,
    userWhoCreated: string,
  ): Promise<ProductRow> {
    const productCreated = Product.create({
      designId: body.designId,
      sizeGroupId: body.sizeGroupId,
      name: body.name,
      sellingPrice: body.sellingPrice,
    });
    return this.productRepository.createProduct(productCreated, userWhoCreated);
  }

  // Find All Products
  async findAllProducts(): Promise<ProductRow[]> {
    return this.productRepository.findAllProducts();
  }

  // Find Product by Id
  async findProductById(id: string): Promise<ProductRow> {
    const product = await this.productRepository.findProductById(id);
    if (!product) {
      throw new NotFoundException('Product not found', 'RESOURCE_NOT_FOUND');
    }
    return product;
  }

  // Create Product Variant & Insert Stock Movements
  async createProductVariant(
    productId: string,
    body: ProductVariantCreateRequestDto,
    createdBy: string,
  ): Promise<ProductRow> {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found', 'RESOURCE_NOT_FOUND');
    }

    const sizeGroup = await this.sizeGroupRepository.findSizeGroupByName(
      product.group_name,
    );
    if (!sizeGroup) {
      throw new NotFoundException('Size group not found', 'RESOURCE_NOT_FOUND');
    }

    const validaSizeids = new Set(
      sizeGroup.sizes.map((size) => size.id.toString()),
    );

    const allSizeValid = body.stock.every((stock) =>
      validaSizeids.has(stock.sizeId.toString()),
    );

    if (!allSizeValid) {
      throw new ConflictException('Invalid size id', 'INVALID_SIZE_ID');
    }

    const productVariants = ProductVariant.createMany(body.stock);

    return this.transactionManager.runInTransaction(async (tx) => {
      // Insert Product Variant
      const insertedVariants =
        await this.productVariantRepository.createProductVariants(
          productId,
          productVariants,
          createdBy,
          tx as PgTransactionContext,
        );

      await this.stockMovementRepository.insertStockMovements(
        insertedVariants,
        'PRODUCT',
        productId,
        createdBy,
        tx as PgTransactionContext,
      );

      const product = await this.productRepository.findProductById(
        productId,
        tx as PgTransactionContext,
      );
      if (!product) {
        throw new NotFoundException('Product not found', 'RESOURCE_NOT_FOUND');
      }
      return product;
    });
  }

  // Find Stock History by Product Id
  async findStockHistoryByProductId(id: string): Promise<ProductStockRow[]> {
    const exists = await this.productRepository.existsProductById(id);
    if (!exists) {
      throw new NotFoundException('Product not found', 'RESOURCE_NOT_FOUND');
    }
    return this.productStockRepository.findStockHistoryByProductId(id);
  }

  // Update Product By Id
  async updateProductById(
    id: string,
    body: ProductUpdateRequestDto,
    userWhoUpdated: string,
  ): Promise<ProductRow> {
    const product = Product.update(body);
    const productUpdated = await this.productRepository.updateProductById(
      id,
      product,
      userWhoUpdated,
    );
    if (!productUpdated) {
      throw new NotFoundException('Product not found', 'RESOURCE_NOT_FOUND');
    }
    return productUpdated;
  }

  // Delete Product By Id
  async deleteProductById(id: string): Promise<boolean> {
    const exists = await this.productRepository.existsProductById(id);
    if (!exists) {
      throw new NotFoundException('Product not found', 'RESOURCE_NOT_FOUND');
    }

    const hasActiveStock =
      await this.productVariantRepository.hasActiveStock(id);
    if (hasActiveStock) {
      throw new BadRequestException(
        'Product cannot be deleted because it still has active stock',
        'PRODUCT_HAS_ACTIVE_STOCK',
        [],
      );
    }

    return this.productRepository.deleteProductById(id);
  }
}
