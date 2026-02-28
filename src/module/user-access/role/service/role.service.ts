import { Inject } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../domain/interface/role.respository.interface';
import type { RoleRepository } from '../repository/role.repository';
import { Role } from '../domain/role.entity';
import { NotFoundException } from 'src/shared/exceptions/not-found.exception';
import {
  CreateRoleRequestDto,
  ParamsRoleRequestDto,
} from '../dto/request/role.request.dto';
import { Permission } from '../domain/permission.entity';
import { ConflictException } from 'src/shared/exceptions/conflict.exception';

export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
  ) {}

  // Get All Permission
  async getAllPermission(): Promise<Permission[]> {
    return await this.roleRepository.getAllPermission();
  }

  // Get All Role
  async getAll(): Promise<Role[]> {
    return await this.roleRepository.getAllRole();
  }

  // Get Role By Id
  async getRoleById(params: ParamsRoleRequestDto): Promise<Role> {
    const role = await this.roleRepository.getRoleById(params.id);
    if (!role) {
      throw new NotFoundException('Role not found', 'RESOURCE_NOT_FOUND');
    }
    return role;
  }

  // Create Role
  async create(body: CreateRoleRequestDto): Promise<Role> {
    const role = await this.roleRepository.isRoleNameExist(body.roleName);
    if (role) {
      throw new ConflictException(
        'Role name already exists',
        'RESOURCE_ALREADY_EXIST',
      );
    }

    const roleCreated = await this.roleRepository.create(
      new Role(
        '',
        body.roleName,
        body.permissions.map((id) => new Permission(id, '')),
      ),
    );

    const roles = await this.roleRepository.getRoleById(roleCreated.id);
    if (!roles) {
      throw new NotFoundException('Role not found', 'RESOURCE_NOT_FOUND');
    }
    return roles;
  }

  // Update Role
  async updateRoleById(
    params: ParamsRoleRequestDto,
    body: Partial<CreateRoleRequestDto>,
  ): Promise<Role> {
    const existing = await this.roleRepository.getRoleById(params.id);
    if (!existing) {
      throw new NotFoundException('Role not found', 'RESOURCE_NOT_FOUND');
    }

    if (body.roleName) {
      await this.roleRepository.updateRoleName(
        new Role(params.id, body.roleName, []),
      );
    }

    if (body.permissions) {
      await this.roleRepository.updateRolePermissions(
        new Role(
          params.id,
          '',
          body.permissions.map((id) => new Permission(id, '')),
        ),
      );
    }

    const updated = await this.roleRepository.getRoleById(params.id);
    if (!updated) {
      throw new NotFoundException('Role not found', 'RESOURCE_NOT_FOUND');
    }
    return updated;
  }

  // Delete Role
  async deleteRoleById(params: ParamsRoleRequestDto): Promise<void> {
    const isAssigned = await this.roleRepository.getRoleIsAssignByUser(
      params.id,
    );
    if (isAssigned) {
      throw new ConflictException(
        'Role cannot be deleted while assigned to users',
        'RESOURCE_IN_USE',
      );
    }

    const success = await this.roleRepository.deleteRoleById(params.id);
    if (!success) {
      throw new NotFoundException('Role not found', 'RESOURCE_NOT_FOUND');
    }
  }
}
