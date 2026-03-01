import { TransactionContext } from 'src/shared/database/transaction/transaction-manager.interface';
import { SizeGroup } from '../size-group.entity';
import { Size } from '../size.entity';

export const SIZE_REPOSITORY = Symbol('ISizeRepository');

export interface ISizeRepository {
  getAllSizeGroup(): Promise<SizeGroup[]>;
  isSizeGroupExist(groupName: string): Promise<boolean>;
  createSizeGroup(
    groupName: string,
    userId: string,
    context?: TransactionContext,
  ): Promise<SizeGroup>;
  createSizes(
    sizeGroupId: string,
    sizes: string[],
    userId: string,
    context?: TransactionContext,
  ): Promise<Size[]>;
  getSizeGroupById(id: string | bigint): Promise<SizeGroup | undefined>;
  updateSizeGroupById(
    id: string,
    userId: string,
    groupName: string,
  ): Promise<SizeGroup | undefined>;
  deleteSizesBySizeGroupId(
    id: string,
    softDelete: boolean,
    context?: TransactionContext,
  ): Promise<boolean>;
  deleteSizeGroupById(id: string): Promise<boolean>;
}
