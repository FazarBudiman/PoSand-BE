import {
  Body,
  Controller,
  Delete,
  // Delete,
  Get,
  Param,
  Patch,
  // Patch,
  Post,
} from '@nestjs/common';
import { RoleService } from '../service/role.service';
import { RoleMapper } from '../mapper/role.mapper';
import {
  CreateRoleRequestDto,
  UpdateRoleRequestDto,
  // UpdateRoleRequestDto,
} from '../dto/request/role.request.dto';
import { PermissionMapper } from '../mapper/permission.mapper';
import { RequirePermissions } from 'src/shared/decorators/permission.decorator';
import {
  ApiCreateRole,
  ApiDeleteRole,
  ApiFindAllPermissions,
  ApiFindAllRoles,
  ApiFindRoleById,
  ApiRole,
  ApiUpdateRole,
} from '../doc/role.doc';

@ApiRole()
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiFindAllPermissions()
  @RequirePermissions('role:manage')
  @Get('/permissions')
  async findAllPermissions() {
    const permissions = await this.roleService.findAllPermissions();
    return {
      data: PermissionMapper.toResponseList(permissions),
    };
  }

  @ApiFindAllRoles()
  @RequirePermissions('role:manage')
  @Get('/')
  async findAllRoles() {
    const roles = await this.roleService.findAllRoles();
    return {
      data: RoleMapper.toResponseList(roles),
    };
  }

  @ApiFindRoleById()
  @RequirePermissions('role:manage')
  @Get('/:id')
  async findRoleById(@Param('id') id: string) {
    const role = await this.roleService.findRoleById(id);
    return {
      data: RoleMapper.toResponse(role),
    };
  }

  @ApiCreateRole()
  @RequirePermissions('role:manage')
  @Post('/')
  async createRole(@Body() body: CreateRoleRequestDto) {
    const role = await this.roleService.createRole(body);
    return {
      data: RoleMapper.toResponse(role),
    };
  }

  @ApiUpdateRole()
  @RequirePermissions('role:manage')
  @Patch('/:id')
  async updateRole(
    @Param('id') id: string,
    @Body() body: UpdateRoleRequestDto,
  ) {
    const role = await this.roleService.updateRoleById(id, body);
    return {
      data: RoleMapper.toResponse(role),
    };
  }

  @ApiDeleteRole()
  @RequirePermissions('role:manage')
  @Delete('/:id')
  async deleteRole(@Param('id') id: string) {
    await this.roleService.deleteRoleById(id);
    return {
      message: 'Role deleted successfully',
    };
  }
}
