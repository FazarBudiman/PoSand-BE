import { BadRequestException, Inject } from '@nestjs/common';
import { NotFoundException } from '../../../shared/exceptions/not-found.exception';
import { PaymentType } from '../../finance/payment/domain/type/payment-type';
import { Payment } from '../../finance/payment/domain/payment.entity';
import { PaymentSourceType } from '../../finance/payment/domain/type/payment-source-type';
import { Cashflow } from '../../finance/cashflow/domain/cashflow.entity';
import { CashflowType } from '../../finance/cashflow/domain/type/cashflow-type';
import { CashflowSourceType } from '../../finance/cashflow/domain/type/cashflow-source-type';
import { PAYMENT_REPOSITORY } from '../../finance/payment/domain/interface/payment.repository.interface';
import type { IPaymentRepository } from '../../finance/payment/domain/interface/payment.repository.interface';
import { CASHFLOW_REPOSITORY } from '../../finance/cashflow/domain/interface/cashflow.repository.interface';
import type { ICashflowRepository } from '../../finance/cashflow/domain/interface/cashflow.repository.interface';
import { TRANSACTION_MANAGER } from '../../../shared/database/tokens/transaction.token';
import type { ITransactionManager } from '../../../shared/database/transaction/transaction-manager.interface';
import { PgTransactionContext } from '../../../shared/database/transaction/pg-transaction.manager';
import { ConflictException } from '../../../shared/exceptions/conflict.exception';
import { SALE_REPOSITORY } from '../domain/interface/sale.repository.interface';
import type { ISaleRepository } from '../domain/interface/sale.repository.interface';
import { CreateSalePaymentRequestDto } from '../dto/request/sale-payment.request.dto';
import { SaleStatus } from '../domain/type/product-sale-status.enum';
import { Sale } from '../domain/sale.entity';
import { SaleRow } from '../repository/sale.row';

export class SalePaymentService {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,

    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,

    @Inject(CASHFLOW_REPOSITORY)
    private readonly cashflowRepository: ICashflowRepository,

    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: ITransactionManager,
  ) {}
  async createPayment(
    id: string,
    body: CreateSalePaymentRequestDto,
    createdBy: string,
  ): Promise<SaleRow> {
    const saleReturned = await this.transactionManager.runInTransaction(
      async (tx) => {
        const sale = await this.saleRepository.findSaleById(
          id,
          tx as PgTransactionContext,
        );
        if (!sale) {
          throw new NotFoundException(
            'Product sale not found',
            'RESOURCE_NOT_FOUND',
          );
        }

        if (sale.status === SaleStatus.PAID) {
          throw new BadRequestException(
            'Product sale is not in UNPAID status',
            'BAD_REQUEST',
          );
        }

        const saleUpdate = Sale.update({
          totalPaid: body.amount + sale.total_paid,
          remainingAmount: sale.remaining_amount - body.amount,
        });

        if (saleUpdate.remainingAmount && saleUpdate.remainingAmount < 0) {
          throw new ConflictException(
            'Paid melebihi grand total',
            'CONFLICT_RESOURCE',
          );
        }

        const payment = Payment.create({
          sourceType: PaymentSourceType.SALE,
          sourceId: id,
          paymentType:
            saleUpdate.remainingAmount === 0
              ? PaymentType.FULL
              : PaymentType.INSTALLMENT,
          paymentMethod: body.paymentMethod,
          amount: body.amount,
          referenceNumber: body.referenceNumber,
          notes: body.notes,
        });

        const cashflow = Cashflow.create({
          type: CashflowType.INCOME,
          sourceType: CashflowSourceType.PRODUCT_SALE,
          sourceId: id,
          amount: body.amount,
          description: body.notes,
        });

        await this.paymentRepository.createPayment(
          payment,
          createdBy,
          tx as PgTransactionContext,
        );

        await this.cashflowRepository.createCashflow(
          cashflow,
          createdBy,
          tx as PgTransactionContext,
        );

        const saleUpdated = await this.saleRepository.updateSaleById(
          id,
          saleUpdate,
          createdBy,
          tx as PgTransactionContext,
        );
        if (!saleUpdated) {
          throw new NotFoundException(
            'Product sale not found',
            'RESOURCE_NOT_FOUND',
          );
        }
        return saleUpdated;
      },
    );

    return saleReturned;
  }
}
