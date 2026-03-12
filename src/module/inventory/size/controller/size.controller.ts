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
import {
  SizeCreateRequestDto,
  SizeUpdateRequestDto,
} from '../dto/request/size.request';
import { RequirePermissions } from '../../../../shared/decorators/permission.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import {
  ApiCreateSizeGroup,
  ApiDeleteSizeGroup,
  ApiFindAllSizeGroups,
  ApiFindSizeGroupById,
  ApiSize,
  ApiUpdateSizeGroup,
} from '../doc/size.doc';
import { SizeGroupMapper } from '../mapper/size-group.mapper';

@ApiSize()
@Controller('sizes')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @ApiFindAllSizeGroups()
  @RequirePermissions('product:read')
  @Get()
  async findAll() {
    const sizeGroups = await this.sizeService.findAllSizeGroups();
    return {
      data: SizeGroupMapper.toResponseList(sizeGroups),
    };
  }

  @ApiCreateSizeGroup()
  @RequirePermissions('product:create')
  @Post()
  async create(
    @Body() body: SizeCreateRequestDto,
    @CurrentUser('sub') userId: string,
  ) {
    const createdSizeGroup = await this.sizeService.createSizeGroup(
      userId,
      body,
    );
    return {
      data: SizeGroupMapper.toResponse(createdSizeGroup),
    };
  }

  @ApiFindSizeGroupById()
  @RequirePermissions('product:read')
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const sizeGroup = await this.sizeService.findSizeGroupById(id);
    return {
      data: SizeGroupMapper.toResponse(sizeGroup),
    };
  }

  @ApiUpdateSizeGroup()
  @RequirePermissions('product:update')
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: SizeUpdateRequestDto,
    @CurrentUser('sub') userId: string,
  ) {
    const updatedSizeGroup = await this.sizeService.updateSizeGroupById(
      id,
      userId,
      body,
    );
    return {
      data: SizeGroupMapper.toResponse(updatedSizeGroup),
    };
  }

  @ApiDeleteSizeGroup()
  @RequirePermissions('product:delete')
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.sizeService.deleteSizeGroupById(id);
    return {
      message: 'Size group deleted',
    };
  }
}
