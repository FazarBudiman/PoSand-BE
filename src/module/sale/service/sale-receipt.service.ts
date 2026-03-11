import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from 'src/shared/exceptions/not-found.exception';
import { TRANSACTION_MANAGER } from 'src/shared/database/tokens/transaction.token';
import type { ITransactionManager } from 'src/shared/database/transaction/transaction-manager.interface';
import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { SALE_RECEIPT_REPOSITORY } from '../domain/interface/sale-receipt.repository.interface';
import type { ISaleReceiptRepository } from '../domain/interface/sale-receipt.repository.interface';
import { SaleReceiptResponseDto } from '../dto/response/sale-receipt.response.dto';

@Injectable()
export class SaleReceiptService {
  constructor(
    @Inject(SALE_RECEIPT_REPOSITORY)
    private readonly receiptRepository: ISaleReceiptRepository,

    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: ITransactionManager,
  ) {}

  async findSaleReceiptById(
    id: string,
    updatedBy: string,
  ): Promise<SaleReceiptResponseDto> {
    return await this.transactionManager.runInTransaction(async (tx) => {
      const receipt = await this.receiptRepository.findSaleReceiptById(
        id,
        tx as PgTransactionContext,
      );
      if (!receipt) {
        throw new NotFoundException(
          'Product sale not found',
          'RESOURCE_NOT_FOUND',
        );
      }

      await this.receiptRepository.createReceiptSnapshot(
        id,
        receipt,
        updatedBy,
        tx as PgTransactionContext,
      );
      return receipt;
    });
  }
}
