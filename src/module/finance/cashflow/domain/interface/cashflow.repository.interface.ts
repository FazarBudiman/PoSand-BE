import { PgTransactionContext } from '../../../../../shared/database/transaction/pg-transaction.manager';
import { Cashflow } from '../cashflow.entity';

export const CASHFLOW_REPOSITORY = Symbol('CASHFLOW_REPOSITORY');

export interface ICashflowRepository {
  createCashflow(
    cashflow: Cashflow,
    createdBy: string,
    pgContext?: PgTransactionContext,
  ): Promise<void>;
}
