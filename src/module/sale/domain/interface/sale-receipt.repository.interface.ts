import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { SaleReceiptResponseDto } from '../../dto/response/sale-receipt.response.dto';

export const SALE_RECEIPT_REPOSITORY = Symbol('SALE_RECEIPT_REPOSITORY');

export interface ISaleReceiptRepository {
  findSaleReceiptById(
    id: string,
    pgContext?: PgTransactionContext,
  ): Promise<SaleReceiptResponseDto>;

  createReceiptSnapshot(
    saleId: string,
    receipt: SaleReceiptResponseDto,
    updatedBy: string,
    pgContext?: PgTransactionContext,
  ): Promise<void>;
}
