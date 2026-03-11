import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { SizeGroupRow } from '../../repository/size-group.row';

export const SIZE_GROUP_REPOSITORY = Symbol('ISizeRepository');

export interface ISizeGroupRepository {
  findAllSizeGroups(): Promise<SizeGroupRow[]>;

  createSizeGroup(
    groupName: string,
    createdBy: string,
    context?: PgTransactionContext,
  ): Promise<SizeGroupRow>;

  findSizeGroupById(id: string): Promise<SizeGroupRow | undefined>;

  findSizeGroupByName(groupName: string): Promise<SizeGroupRow | undefined>;

  existsSizeGroupByName(groupName: string): Promise<boolean>;

  updateSizeGroupById(
    sizeGroupid: string,
    groupName: string,
    createdBy: string,
  ): Promise<SizeGroupRow | undefined>;

  deleteSizeGroupById(id: string): Promise<boolean>;
}
