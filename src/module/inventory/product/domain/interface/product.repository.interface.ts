import {
  ProductCreateRequestDto,
  ProductVariantCreateRequestDto,
} from '../../dto/request/product.request';
import { ProductVariant } from '../product-variant.entity';
import { Product } from '../product.entity';
import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';

export const PRODUCT_REPOSITORY = Symbol('IProductRepository');
export interface IProductRepository {
  createProduct(
    product: ProductCreateRequestDto,
    userWhoCreated: string,
  ): Promise<Product>;
  getAllProduct(): Promise<Product[]>;
  getProductById(id: string): Promise<Product>;
  isProductExist(id: string): Promise<boolean | undefined>;
  createProductVariant(
    productId: string,
    productVariant: ProductVariantCreateRequestDto,
    userWhoCreated: string,
    txContext?: PgTransactionContext,
  ): Promise<ProductVariant[]>;
  insertStockMovements(
    variants: ProductVariant[],
    referenceType: string,
    referenceId: string,
    userWhoCreated: string,
    txContext?: PgTransactionContext,
  ): Promise<void>;
  updateProductById(
    id: string,
    product: Pick<ProductCreateRequestDto, 'name' | 'sellingPrice'>,
    userWhoUpdated: string,
  ): Promise<Product | undefined>;
  deleteProductById(id: string): Promise<boolean>;
  hasActiveStock(id: string): Promise<boolean>;
}
