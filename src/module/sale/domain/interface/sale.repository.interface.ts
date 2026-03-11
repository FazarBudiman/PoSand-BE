import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { Sale } from '../sale.entity';
import { SaleRow } from '../../repository/sale.row';

export const SALE_REPOSITORY = Symbol('SALE_REPOSITORY');

export interface ISaleRepository {
  createSale(
    productSale: Sale,
    createdBy: string,
    pgContext?: PgTransactionContext,
  ): Promise<SaleRow>;

  getNextIdSale(pgContext?: PgTransactionContext): Promise<string>;

  findAllSales(pgContext?: PgTransactionContext): Promise<SaleRow[]>;

  findSaleById(id: string, pgContext?: PgTransactionContext): Promise<SaleRow>;

  updateSaleById(
    saleId: string,
    sale: Partial<Sale>,
    updatedBy: string,
    pgContext?: PgTransactionContext,
  ): Promise<SaleRow | undefined>;
}
