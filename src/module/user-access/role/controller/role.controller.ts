import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RoleService } from '../service/role.service';
import { RoleMapper } from '../mapper/role.mapper';
import {
  CreateRoleRequestDto,
  ParamsRoleRequestDto,
} from '../dto/request/role.request.dto';
import { PermissionMapper } from '../mapper/permission.mapper';
import { RequirePermissions } from 'src/shared/decorators/permission.decorator';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @RequirePermissions('role:manage')
  @Get('/permissions')
  async getAllPermission() {
    const permissions = await this.roleService.getAllPermission();
    return {
      data: PermissionMapper.toResponseList(permissions),
    };
  }

  @RequirePermissions('role:manage')
  @Get('/')
  async getAll() {
    const roles = await this.roleService.getAll();
    return {
      data: RoleMapper.toResponseList(roles),
    };
  }

  @RequirePermissions('role:manage')
  @Get('/:id')
  async getRoleById(@Param() params: ParamsRoleRequestDto) {
    const role = await this.roleService.getRoleById(params);
    return {
      data: RoleMapper.toResponse(role),
    };
  }

  @RequirePermissions('role:manage')
  @Post('/')
  async create(@Body() body: CreateRoleRequestDto) {
    const role = await this.roleService.create(body);
    return {
      data: RoleMapper.toResponse(role),
    };
  }

  @RequirePermissions('role:manage')
  @Patch('/:id')
  async update(
    @Param() params: ParamsRoleRequestDto,
    @Body() body: Partial<CreateRoleRequestDto>,
  ) {
    const role = await this.roleService.updateRoleById(params, body);
    return {
      data: RoleMapper.toResponse(role),
    };
  }

  @RequirePermissions('role:manage')
  @Delete('/:id')
  async deleteRoleById(@Param() params: ParamsRoleRequestDto) {
    await this.roleService.deleteRoleById(params);
    return {
      message: 'Role deleted successfully',
    };
  }
}
