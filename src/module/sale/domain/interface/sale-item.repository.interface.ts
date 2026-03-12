import { PgTransactionContext } from '../../../../shared/database/transaction/pg-transaction.manager';
import { SaleItem } from '../sale-item.entity';

export const SALE_ITEM_REPOSITORY = Symbol('SALE_ITEM_REPOSITORY');

export interface ISaleItemRepository {
  createSaleItems(
    items: SaleItem[],
    pgContext?: PgTransactionContext,
  ): Promise<any[]>;
}
