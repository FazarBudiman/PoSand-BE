import { SIZE_REPOSITORY } from '../domain/interface/size.repository.interface';
import type { ISizeRepository } from '../domain/interface/size.repository.interface';
import { Inject } from '@nestjs/common';
import { SizeGroup } from '../domain/size-group.entity';
import { TRANSACTION_MANAGER } from 'src/shared/database/tokens/transaction.token';
import type { ITransactionManager } from 'src/shared/database/transaction/transaction-manager.interface';
import {
  SizeCreateRequestDto,
  SizeUpdateResponseDto,
} from '../dto/request/size.request';
import { NotFoundException } from 'src/shared/exceptions/not-found.exception';
import { ConflictException } from 'src/shared/exceptions/conflict.exception';

export class SizeService {
  constructor(
    @Inject(SIZE_REPOSITORY)
    private readonly sizeRepository: ISizeRepository,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: ITransactionManager,
  ) {}

  // Get All Size Group
  async getAllSizeGroup(): Promise<SizeGroup[]> {
    return await this.sizeRepository.getAllSizeGroup();
  }

  // Create Size Group
  async createSizeGroup(
    userId: string,
    body: SizeCreateRequestDto,
  ): Promise<SizeGroup> {
    const isExist = await this.sizeRepository.isSizeGroupExist(body.groupName);
    if (isExist) {
      throw new ConflictException(
        'Size group name already exists',
        'RESOURCE_ALREADY_EXIST',
      );
    }
    return await this.transactionManager.runInTransaction(async (context) => {
      const sizeGroup = await this.sizeRepository.createSizeGroup(
        body.groupName,
        userId,
        context,
      );

      const createdSizes = await this.sizeRepository.createSizes(
        sizeGroup.id,
        body.sizes,
        userId,
        context,
      );

      sizeGroup.sizes = createdSizes;
      return sizeGroup;
    });
  }

  // Get Size Group By Id
  async getSizeGroupById(id: string): Promise<SizeGroup> {
    const sizeGroup = await this.sizeRepository.getSizeGroupById(id);
    if (!sizeGroup) {
      throw new NotFoundException('Size group not found', 'RESOURCE_NOT_FOUND');
    }
    return sizeGroup;
  }

  // Update Size Group by Id
  async updateSizeGroupById(
    id: string,
    userId: string,
    body: Partial<SizeUpdateResponseDto>,
  ): Promise<SizeGroup> {
    if (body.groupName) {
      const isExist = await this.sizeRepository.isSizeGroupExist(
        body.groupName,
      );
      if (isExist) {
        throw new ConflictException(
          'Size group name already exists',
          'RESOURCE_ALREADY_EXIST',
        );
      }

      const sizeGroup = await this.sizeRepository.updateSizeGroupById(
        id,
        body.groupName,
        userId,
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
        await this.sizeRepository.deleteSizesBySizeGroupId(id, false, context);
        await this.sizeRepository.createSizes(
          id,
          sizesToUpdate,
          userId,
          context,
        );
      });
    }

    const updatedSizeGroup = await this.getSizeGroupById(id);
    if (!updatedSizeGroup) {
      throw new NotFoundException('Size group not found', 'RESOURCE_NOT_FOUND');
    }
    return updatedSizeGroup;
  }

  // Delete Size Group By Id
  async deleteSizeGroupById(id: string): Promise<boolean> {
    await this.sizeRepository.deleteSizesBySizeGroupId(id, true);
    const isSuccess = await this.sizeRepository.deleteSizeGroupById(id);
    if (!isSuccess) {
      throw new NotFoundException('Size group not found', 'RESOURCE_NOT_FOUND');
    }
    return isSuccess;
  }
}
