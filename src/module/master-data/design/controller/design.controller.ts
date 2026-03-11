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
import { RequirePermissions } from 'src/shared/decorators/permission.decorator';
import { DesignMapper } from '../mapper/design.mapper';
import {
  DesignCreateRequestDto,
  DesignUpdateRequestDto,
} from '../dto/request/design.request.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

interface MulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

@Controller('designs')
export class DesignController {
  constructor(private readonly designService: DesignService) {}

  @Get()
  @RequirePermissions('product:read')
  async findAllDesigns() {
    const designs = await this.designService.findAllDesigns();
    return {
      data: DesignMapper.toResponseList(designs),
    };
  }

  @Post()
  @RequirePermissions('product:create')
  @UseInterceptors(FileInterceptor('referenceImage'))
  async createDesign(
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

  @Get(':id')
  @RequirePermissions('product:read')
  async findDesignById(@Param('id') id: string) {
    const design = await this.designService.findDesignById(id);
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
