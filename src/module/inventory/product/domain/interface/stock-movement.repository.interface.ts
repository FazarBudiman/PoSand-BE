import { ProductVariantRow } from '../../repository/product-variant.row';
import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';

export const STOCK_MOVEMENT_REPOSITORY = Symbol('IStockMovementRepository');

export interface IStockMovementRepository {
  insertStockMovements(
    variants: ProductVariantRow[],
    referenceType: string,
    referenceId: string,
    userWhoCreated: string,
    txContext?: PgTransactionContext,
  ): Promise<void>;
  insertOutStockMovements(
    items: { productVariantId: number; quantity: number }[],
    referenceId: string,
    createdBy: string,
    tx?: PgTransactionContext,
  ): Promise<void>;
}
