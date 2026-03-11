import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { ProductVariantRow } from '../../repository/product-variant.row';
import { ProductVariant } from '../product-variant.entity';

export const PRODUCT_VARIANT_REPOSITORY = Symbol('IProductVariantRepository');

export interface IProductVariantRepository {
  createProductVariants(
    productId: string,
    productVariant: ProductVariant[],
    createdBy: string,
    txContext?: PgTransactionContext,
  ): Promise<ProductVariantRow[]>;

  hasActiveStock(productId: string): Promise<boolean>;

  findProductVariantById(
    id: string,
    txContext?: PgTransactionContext,
  ): Promise<ProductVariantRow | undefined>;

  reduceStocks(
    items: { productVariantId: number; quantity: number }[],
    tx?: PgTransactionContext,
  ): Promise<void>;
}
