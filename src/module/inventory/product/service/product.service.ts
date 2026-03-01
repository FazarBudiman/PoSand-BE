import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../domain/interface/product.repository.interface';
import type { IProductRepository } from '../domain/interface/product.repository.interface';
import { Product } from '../domain/product.entity';
import {
  ProductCreateRequestDto,
  ProductVariantCreateRequestDto,
} from '../dto/request/product.request';
import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { TRANSACTION_MANAGER } from 'src/shared/database/tokens/transaction.token';
import type { ITransactionManager } from 'src/shared/database/transaction/transaction-manager.interface';
import { PRODUCT_STOCK_REPOSITORY } from '../domain/interface/product-stock.repository.interface';
import type { IProductStockRepository } from '../domain/interface/product-stock.repository.interface';
import { ProductStock } from '../domain/product-stock.entity';
import { NotFoundException } from 'src/shared/exceptions/not-found.exception';
import { BadRequestException } from 'src/shared/exceptions/bad-request.exception';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,

    @Inject(PRODUCT_STOCK_REPOSITORY)
    private readonly productStockRepository: IProductStockRepository,

    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: ITransactionManager,
  ) {}

  // Create Product
  async createProduct(
    product: ProductCreateRequestDto,
    userWhoCreated: string,
  ): Promise<Product> {
    const products = await this.productRepository.createProduct(
      product,
      userWhoCreated,
    );
    return products;
  }

  // Get All Product
  async getAllProduct(): Promise<Product[]> {
    const products = await this.productRepository.getAllProduct();
    return products;
  }

  // Get Product by Id
  async getProductById(id: string): Promise<Product> {
    const isProductExist = await this.productRepository.isProductExist(id);
    if (!isProductExist) {
      throw new Error('Product not found');
    }
    const product = await this.productRepository.getProductById(id);
    return product;
  }

  // Get History Stock Product by Id
  async getHistoryStockProductById(id: string): Promise<ProductStock[]> {
    const isProductExist = await this.productRepository.isProductExist(id);
    if (!isProductExist) {
      throw new Error('Product not found');
    }
    const productStock =
      await this.productStockRepository.getHistoryStockProductById(id);
    return productStock;
  }

  // Create Product Variant & Insert Stock Movements
  async createProductVariant(
    productId: string,
    productVariant: ProductVariantCreateRequestDto,
    userWhoCreated: string,
  ): Promise<Product> {
    const isProductExist =
      await this.productRepository.isProductExist(productId);
    if (!isProductExist) {
      throw new Error('Product not found');
    }
    return this.transactionManager.runInTransaction(async (tx) => {
      const insertedVariants =
        await this.productRepository.createProductVariant(
          productId,
          productVariant,
          userWhoCreated,
          tx as PgTransactionContext,
        );

      await this.productRepository.insertStockMovements(
        insertedVariants,
        'PRODUCT',
        productId,
        userWhoCreated,
        tx as PgTransactionContext,
      );

      return this.productRepository.getProductById(productId);
    });
  }

  // Update Product By Id
  async updateProductById(
    id: string,
    product: Pick<ProductCreateRequestDto, 'name' | 'sellingPrice'>,
    userWhoUpdated: string,
  ): Promise<Product> {
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
    const isProductExist = await this.productRepository.isProductExist(id);
    if (!isProductExist) {
      throw new NotFoundException('Product not found', 'RESOURCE_NOT_FOUND');
    }

    const hasActiveStock = await this.productRepository.hasActiveStock(id);
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
