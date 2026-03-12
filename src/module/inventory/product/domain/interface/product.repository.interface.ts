import { PgTransactionContext } from '../../../../../shared/database/transaction/pg-transaction.manager';
import { ProductRow } from '../../repository/product.row';
import { Product } from '../product.entity';

export const PRODUCT_REPOSITORY = Symbol('IProductRepository');

export interface IProductRepository {
  createProduct(product: Product, userWhoCreated: string): Promise<ProductRow>;
  findAllProducts(): Promise<ProductRow[]>;
  findProductById(
    id: string,
    txContext?: PgTransactionContext,
  ): Promise<ProductRow | undefined>;
  existsProductById(id: string): Promise<boolean>;
  updateProductById(
    id: string,
    product: Partial<Product>,
    updatedBy: string,
  ): Promise<ProductRow | undefined>;
  deleteProductById(id: string): Promise<boolean>;
}
