import { Inject } from '@nestjs/common';
import { Design } from '../domain/design.entity';
import { DESIGN_REPOSITORY } from '../domain/interface/design.repository.interface';
import type { IDesignRepository } from '../domain/interface/design.repository.interface';
import {
  DesignCreateRequestDto,
  DesignUpdateRequestDto,
} from '../dto/request/design.request.dto';
import { NotFoundException } from 'src/shared/exceptions/not-found.exception';
import { ConflictException } from 'src/shared/exceptions/conflict.exception';

export class DesignService {
  constructor(
    @Inject(DESIGN_REPOSITORY)
    private readonly designRepository: IDesignRepository,
  ) {}

  // Get All Design
  async getAllDesign(): Promise<Design[]> {
    return await this.designRepository.getAllDesign();
  }

  // Create Design
  async createDesign(
    design: DesignCreateRequestDto,
    userId: string,
  ): Promise<Design> {
    const isDesignExist = await this.designRepository.isDesignExist({
      name: design.name,
    });
    if (isDesignExist) {
      throw new ConflictException(
        'Design already exists',
        'RESOURCE_ALREADY_EXIST',
      );
    }
    return await this.designRepository.createDesign(design, userId);
  }

  // Get Design By Id
  async getDesignById(id: string): Promise<Design> {
    const design = await this.designRepository.getDesignById(id);
    if (!design) {
      throw new NotFoundException(
        `Design with ID ${id} not found`,
        'RESOURCE_NOT_FOUND',
      );
    }
    return design;
  }

  // Update Design By Id
  async updateDesignById(
    id: string,
    design: DesignUpdateRequestDto,
    userId: string,
  ): Promise<Design> {
    if (design.name) {
      const isDesignExist = await this.designRepository.isDesignExist({
        name: design.name,
      });
      if (isDesignExist) {
        throw new ConflictException(
          'Design already exists',
          'RESOURCE_ALREADY_EXIST',
        );
      }
    }

    const updatedDesign = await this.designRepository.updateDesignById(
      id,
      design,
      userId,
    );
    if (!updatedDesign) {
      throw new NotFoundException(
        `Design with ID ${id} not found`,
        'RESOURCE_NOT_FOUND',
      );
    }
    return updatedDesign;
  }

  // Delete Design By Id
  async deleteDesignById(id: string): Promise<void> {
    const success = await this.designRepository.deleteDesignById(id);
    if (!success) {
      throw new NotFoundException(
        `Design with ID ${id} not found`,
        'RESOURCE_NOT_FOUND',
      );
    }
  }
}
