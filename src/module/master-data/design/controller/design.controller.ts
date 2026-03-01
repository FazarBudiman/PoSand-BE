import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DesignService } from '../service/design.service';
import { RequirePermissions } from 'src/shared/decorators/permission.decorator';
import { DesignMapper } from '../mapper/design.mapper';
import {
  DesignCreateRequestDto,
  DesignUpdateRequestDto,
} from '../dto/request/design.request.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Controller('designs')
export class DesignController {
  constructor(private readonly designService: DesignService) {}

  @Get()
  @RequirePermissions('product:read')
  async getAllDesign() {
    const designs = await this.designService.getAllDesign();
    return {
      data: DesignMapper.toResponseList(designs),
    };
  }

  @Post()
  @RequirePermissions('product:create')
  async createDesign(
    @Body() body: DesignCreateRequestDto,
    @CurrentUser('sub') userId: string,
  ) {
    const createdDesign = await this.designService.createDesign(body, userId);
    return {
      data: DesignMapper.toResponse(createdDesign),
    };
  }

  @Get(':id')
  @RequirePermissions('product:read')
  async getDesignById(@Param('id') id: string) {
    const design = await this.designService.getDesignById(id);
    return {
      data: DesignMapper.toResponse(design),
    };
  }

  @Patch(':id')
  @RequirePermissions('product:update')
  async updateDesign(
    @Param('id') id: string,
    @Body() body: DesignUpdateRequestDto,
    @CurrentUser('sub') userId: string,
  ) {
    const updatedDesign = await this.designService.updateDesignById(
      id,
      body,
      userId,
    );
    return {
      data: DesignMapper.toResponse(updatedDesign),
    };
  }

  @Delete(':id')
  @RequirePermissions('product:delete')
  async deleteDesign(@Param('id') id: string) {
    await this.designService.deleteDesignById(id);
    return {
      message: 'Design deleted successfully',
    };
  }
}
