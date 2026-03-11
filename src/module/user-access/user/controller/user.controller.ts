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
  PatchUserRequestDto,
} from '../dto/request/user.request.dto';
import { UserMapper } from '../mapper/user.mapper';
import { RequirePermissions } from 'src/shared/decorators/permission.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @RequirePermissions('user:create')
  @Post('/')
  async createUser(@Body() body: CreateUserRequestDto) {
    const user = await this.userService.createUser(body);
    return {
      message: 'User berhasil dibuat',
      data: UserMapper.toResponse(user),
    };
  }

  @RequirePermissions('user:read')
  @Get('/')
  async findAllUsers() {
    const users = await this.userService.findAllUsers();
    return {
      data: UserMapper.toResponseList(users),
    };
  }

  @RequirePermissions('user:read')
  @Get('/:id')
  async findUserById(@Param('id') id: string) {
    const user = await this.userService.findUserById(id);
    return {
      data: UserMapper.toResponse(user),
    };
  }

  @RequirePermissions('user:update')
  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: PatchUserRequestDto) {
    const user = await this.userService.updateUserById(id, body);
    return {
      message: 'User berhasil diupdate',
      data: UserMapper.toResponse(user),
    };
  }

  @RequirePermissions('user:delete')
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUserById(id);
    return {
      message: 'User berhasil dihapus',
    };
  }
}
