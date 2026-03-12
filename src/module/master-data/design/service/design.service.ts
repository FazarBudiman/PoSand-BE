import { Inject, Injectable } from '@nestjs/common';
import { Design } from '../domain/design.entity';
import { DESIGN_REPOSITORY } from '../domain/interface/design.repository.interface';
import type { IDesignRepository } from '../domain/interface/design.repository.interface';
import {
  DesignCreateRequestDto,
  DesignUpdateRequestDto,
} from '../dto/request/design.request.dto';
import { NotFoundException } from '../../../../shared/exceptions/not-found.exception';
import { ConflictException } from '../../../../shared/exceptions/conflict.exception';
import { StorageService } from '../../../../shared/storage/storage.service';
import { DesignRow } from '../repository/design.row';

interface MulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

@Injectable()
export class DesignService {
  constructor(
    @Inject(DESIGN_REPOSITORY)
    private readonly designRepository: IDesignRepository,
    private readonly storageService: StorageService,
  ) {}

  // Find All Designs
  async findAllDesigns(): Promise<DesignRow[]> {
    return this.designRepository.findAllDesigns();
  }

  // Create Design
  async createDesign(
    body: DesignCreateRequestDto,
    createdBy: string,
    file: MulterFile,
  ): Promise<DesignRow> {
    const isExist = await this.designRepository.existsDesignByName(body.name);

    if (isExist) {
      throw new ConflictException(
        'Design already exists',
        'RESOURCE_ALREADY_EXIST',
      );
    }

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `designs/${fileName}`;
    await this.storageService.uploadFile(filePath, file.buffer, file.mimetype);

    // Get Public URL
    const publicUrl = this.storageService.getFileUrl(filePath);

    // Convert basePrice to number if it's a string (common in multipart/form-data)
    // const basePrice = Number(design.basePrice);
    const design = Design.create({
      name: body.name,
      referenceImageUrl: publicUrl,
      basePrice: body.basePrice,
      description: body.description,
      category: body.category,
    });

    return this.designRepository.createDesign(design, createdBy);
  }

  // Find Design By Id
  async findDesignById(id: string): Promise<DesignRow> {
    const design = await this.designRepository.findDesignById(id);
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
    updatedBy: string,
  ): Promise<DesignRow> {
    if (design.name) {
      const isExist = await this.designRepository.existsDesignByName(
        design.name,
      );

      if (isExist) {
        throw new ConflictException(
          'Design already exists',
          'RESOURCE_ALREADY_EXIST',
        );
      }
    }

    const updatedDesign = await this.designRepository.updateDesignById(
      id,
      design,
      updatedBy,
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
