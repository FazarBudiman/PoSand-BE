import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import {
  CreateUserRequestDto,
  ParamUserRequestDto,
  PatchUserRequestDto,
} from '../dto/request/user.request.dto';
import { UserMapper } from '../mapper/user.mapper';
import { RequirePermissions } from 'src/shared/decorators/permission.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @RequirePermissions('user:create')
  @Post('/')
  async create(@Body() body: CreateUserRequestDto) {
    const user = await this.userService.create(body);
    return {
      message: 'User berhasil dibuat',
      data: UserMapper.toResponse(user),
    };
  }

  @RequirePermissions('user:read')
  @Get('/')
  async getAll() {
    const users = await this.userService.getAllUsers();
    return {
      data: UserMapper.toResponseList(users),
    };
  }

  @RequirePermissions('user:read')
  @Get('/:id')
  async getUserById(@Param() params: ParamUserRequestDto) {
    const user = await this.userService.getUserById(params);
    return {
      data: UserMapper.toResponse(user),
    };
  }

  @RequirePermissions('user:update')
  @Patch('/:id')
  async updateuserById(
    @Param() params: ParamUserRequestDto,
    @Body() body: PatchUserRequestDto,
  ) {
    const user = await this.userService.updateUserById(params, body);
    return {
      message: 'User berhasil diupdate',
      data: UserMapper.toResponse(user),
    };
  }

  @RequirePermissions('user:delete')
  @Delete('/:id')
  async deleteUserById(@Param() params: ParamUserRequestDto) {
    await this.userService.deleteUserById(params);
    return {
      message: 'User berhasil dihapus',
    };
  }
}
