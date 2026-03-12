import { Payment } from '../payment.entity';
import { PgTransactionContext } from '../../../../../shared/database/transaction/pg-transaction.manager';

export const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';

export interface IPaymentRepository {
  createPayment(
    payment: Payment,
    createdBy: string,
    pgContext?: PgTransactionContext,
  ): Promise<void>;
}
