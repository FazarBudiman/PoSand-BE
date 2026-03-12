import { SIZE_REPOSITORY } from '../domain/interface/size.repository.interface';
import type { ISizeRepository } from '../domain/interface/size.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { SizeGroup } from '../domain/size-group.entity';
import { TRANSACTION_MANAGER } from '../../../../shared/database/tokens/transaction.token';
import type { ITransactionManager } from '../../../../shared/database/transaction/transaction-manager.interface';
import {
  SizeCreateRequestDto,
  SizeUpdateRequestDto,
} from '../dto/request/size.request';
import { NotFoundException } from '../../../../shared/exceptions/not-found.exception';
import { ConflictException } from '../../../../shared/exceptions/conflict.exception';
import { SizeGroupRow } from '../repository/size-group.row';
import { SIZE_GROUP_REPOSITORY } from '../domain/interface/size-group.repository.interface';
import type { ISizeGroupRepository } from '../domain/interface/size-group.repository.interface';
import { PgTransactionContext } from '../../../../shared/database/transaction/pg-transaction.manager';

@Injectable()
export class SizeService {
  constructor(
    @Inject(SIZE_REPOSITORY)
    private readonly sizeRepository: ISizeRepository,

    @Inject(SIZE_GROUP_REPOSITORY)
    private readonly sizeGroupRepository: ISizeGroupRepository,

    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: ITransactionManager,
  ) {}

  // Find All Size Groups
  async findAllSizeGroups(): Promise<SizeGroupRow[]> {
    return this.sizeGroupRepository.findAllSizeGroups();
  }

  // Create Size Group
  async createSizeGroup(
    userId: string,
    body: SizeCreateRequestDto,
  ): Promise<SizeGroupRow> {
    const isExist = await this.sizeGroupRepository.existsSizeGroupByName(
      body.groupName,
    );
    if (isExist) {
      throw new ConflictException(
        'Size group name already exists',
        'RESOURCE_ALREADY_EXIST',
      );
    }
    const sizeGroup = SizeGroup.create({
      groupName: body.groupName,
      sizes: body.sizes,
    });

    return this.transactionManager.runInTransaction(async (context) => {
      const sizeGroupCreated = await this.sizeGroupRepository.createSizeGroup(
        sizeGroup.groupName,
        userId,
        context as PgTransactionContext,
      );

      const createdSizes = await this.sizeRepository.createSizes(
        sizeGroupCreated.id,
        sizeGroup.sizes,
        userId,
        context as PgTransactionContext,
      );

      const sizeGroupReturned: SizeGroupRow = {
        id: sizeGroupCreated.id,
        group_name: sizeGroupCreated.group_name,
        sizes: createdSizes,
      };
      return sizeGroupReturned;
    });
  }

  // Find Size Group By Id
  async findSizeGroupById(id: string): Promise<SizeGroupRow> {
    const sizeGroup = await this.sizeGroupRepository.findSizeGroupById(id);
    if (!sizeGroup) {
      throw new NotFoundException('Size group not found', 'RESOURCE_NOT_FOUND');
    }
    return sizeGroup;
  }

  // Update Size Group by Id
  async updateSizeGroupById(
    sizeGroupid: string,
    updatedBy: string,
    body: SizeUpdateRequestDto,
  ): Promise<SizeGroupRow> {
    if (body.groupName) {
      const isExist = await this.sizeGroupRepository.existsSizeGroupByName(
        body.groupName,
      );
      if (isExist) {
        throw new ConflictException(
          'Size group name already exists',
          'RESOURCE_ALREADY_EXIST',
        );
      }

      const sizeGroup = await this.sizeGroupRepository.updateSizeGroupById(
        sizeGroupid,
        body.groupName,
        updatedBy,
      );
      if (!sizeGroup) {
        throw new NotFoundException(
          'Size group not found',
          'RESOURCE_NOT_FOUND',
        );
      }
    }

    if (body.sizes) {
      const sizesToUpdate = body.sizes;
      await this.transactionManager.runInTransaction(async (context) => {
        await this.sizeRepository.deleteSizesBySizeGroupId(
          sizeGroupid,
          false,
          context as PgTransactionContext,
        );
        await this.sizeRepository.createSizes(
          sizeGroupid,
          sizesToUpdate,
          updatedBy,
          context as PgTransactionContext,
        );
      });
    }

    const updatedSizeGroup = await this.findSizeGroupById(sizeGroupid);
    return updatedSizeGroup;
  }

  // Delete Size Group By Id
  async deleteSizeGroupById(sizeGroupId: string): Promise<void> {
    await this.transactionManager.runInTransaction(async (context) => {
      const isSuccess = await this.sizeRepository.deleteSizesBySizeGroupId(
        sizeGroupId,
        true,
        context as PgTransactionContext,
      );
      await this.sizeGroupRepository.deleteSizeGroupById(sizeGroupId);

      if (!isSuccess) {
        throw new NotFoundException(
          'Size group not found',
          'RESOURCE_NOT_FOUND',
        );
      }
    });
  }
}
