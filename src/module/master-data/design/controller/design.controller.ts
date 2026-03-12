import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DesignService } from '../service/design.service';
import { RequirePermissions } from '../../../../shared/decorators/permission.decorator';
import { DesignMapper } from '../mapper/design.mapper';
import {
  DesignCreateRequestDto,
  DesignUpdateRequestDto,
} from '../dto/request/design.request.dto';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';

import {
  ApiCreateDesign,
  ApiDeleteDesign,
  ApiDesign,
  ApiFindAllDesigns,
  ApiFindDesignById,
  ApiUpdateDesign,
} from '../doc/design.doc';

interface MulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

@ApiDesign()
@Controller('designs')
export class DesignController {
  constructor(private readonly designService: DesignService) {}

  @ApiFindAllDesigns()
  @Get()
  @RequirePermissions('product:read')
  async findAll() {
    const designs = await this.designService.findAllDesigns();
    return {
      data: DesignMapper.toResponseList(designs),
    };
  }

  @ApiCreateDesign()
  @Post()
  @RequirePermissions('product:create')
  @UseInterceptors(FileInterceptor('referenceImage'))
  async create(
    @Body() body: DesignCreateRequestDto,
    @CurrentUser('sub') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: MulterFile,
  ) {
    const createdDesign = await this.designService.createDesign(
      body,
      userId,
      file,
    );
    return {
      data: DesignMapper.toResponse(createdDesign),
    };
  }

  @ApiFindDesignById()
  @Get('/:id')
  @RequirePermissions('product:read')
  async findOne(@Param('id') id: string) {
    const design = await this.designService.findDesignById(id);
    return {
      data: DesignMapper.toResponse(design),
    };
  }

  @ApiUpdateDesign()
  @Patch('/:id')
  @RequirePermissions('product:update')
  async update(
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

  @ApiDeleteDesign()
  @Delete('/:id')
  @RequirePermissions('product:delete')
  async delete(@Param('id') id: string) {
    await this.designService.deleteDesignById(id);
    return {
      message: 'Design deleted successfully',
    };
  }
}
