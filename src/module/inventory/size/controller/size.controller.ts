import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SizeService } from '../service/size.service';
import { SizeGroupMapper } from '../mapper/size-group.mapper';
import {
  SizeCreateRequestDto,
  SizeUpdateResponseDto,
} from '../dto/request/size.request';
import { RequirePermissions } from 'src/shared/decorators/permission.decorator';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Controller('size-groups')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @RequirePermissions('product:read')
  @Get()
  async getAllSizeGroup() {
    const sizeGroups = await this.sizeService.getAllSizeGroup();

    return {
      data: SizeGroupMapper.toResponseList(sizeGroups),
    };
  }

  @RequirePermissions('product:create')
  @Post()
  async createSizeGroup(
    @CurrentUser('sub') userId: string,
    @Body() body: SizeCreateRequestDto,
  ) {
    const createdSizeGroup = await this.sizeService.createSizeGroup(
      userId,
      body,
    );

    return {
      message: 'Size group created successfully',
      data: SizeGroupMapper.toResponse(createdSizeGroup),
    };
  }

  @RequirePermissions('product:read')
  @Get(':id')
  async getSizeGroupById(@Param('id') id: string) {
    const sizeGroup = await this.sizeService.getSizeGroupById(id);

    return {
      data: SizeGroupMapper.toResponse(sizeGroup),
    };
  }

  @RequirePermissions('product:update')
  @Patch(':id')
  async updateSizeGroup(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() body: SizeUpdateResponseDto,
  ) {
    const updatedSizeGroup = await this.sizeService.updateSizeGroupById(
      id,
      userId,
      body,
    );

    return {
      message: 'Size group updated successfully',
      data: SizeGroupMapper.toResponse(updatedSizeGroup),
    };
  }

  @RequirePermissions('product:delete')
  @Delete(':id')
  async deleteSizeGroup(@Param('id') id: string) {
    await this.sizeService.deleteSizeGroupById(id);

    return {
      message: 'Size group deleted successfully',
    };
  }
}
