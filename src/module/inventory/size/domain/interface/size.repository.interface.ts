import { SizeRow } from '../../repository/size.row';
import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';

export const SIZE_REPOSITORY = Symbol('ISizeRepository');

export interface ISizeRepository {
  createSizes(
    sizeGroupId: string,
    sizes: string[],
    createdBy: string,
    context?: PgTransactionContext,
  ): Promise<SizeRow[]>;

  deleteSizesBySizeGroupId(
    sizeGroupid: string,
    softDelete: boolean,
    context?: PgTransactionContext,
  ): Promise<boolean>;
}
