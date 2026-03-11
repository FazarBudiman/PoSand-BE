import { Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../domain/interface/role.respository.interface';
import type { IRoleRepository } from '../domain/interface/role.respository.interface';
import { Role } from '../domain/role.entity';
import { NotFoundException } from 'src/shared/exceptions/not-found.exception';
import {
  CreateRoleRequestDto,
  UpdateRoleRequestDto,
  // UpdateRoleRequestDto,
} from '../dto/request/role.request.dto';
import { ConflictException } from 'src/shared/exceptions/conflict.exception';
import { TRANSACTION_MANAGER } from 'src/shared/database/tokens/transaction.token';
import type { ITransactionManager } from 'src/shared/database/transaction/transaction-manager.interface';
import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { PermissionRow } from '../repository/permission.row';
import { PERMISSION_REPOSITORY } from '../domain/interface/permission.repository.interface';
import type { IPermissionRepository } from '../domain/interface/permission.repository.interface';
import { RoleRow } from '../repository/role.row';

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,

    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,

    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: ITransactionManager,
  ) {}

  // Find All Permissions
  async findAllPermissions(): Promise<PermissionRow[]> {
    return this.permissionRepository.findAllPermissions();
  }

  // Find All Roles
  async findAllRoles(): Promise<RoleRow[]> {
    return this.roleRepository.findAllRoles();
  }

  // Find Role By Id
  async findRoleById(id: string): Promise<RoleRow> {
    const role = await this.roleRepository.findRoleById(id);
    if (!role) {
      throw new NotFoundException('Role not found', 'RESOURCE_NOT_FOUND');
    }
    return role;
  }

  // Create Role
  async createRole(body: CreateRoleRequestDto): Promise<RoleRow> {
    const exists = await this.roleRepository.existsRoleByName(body.roleName);

    if (exists) {
      throw new ConflictException(
        'Role name already exists',
        'RESOURCE_ALREADY_EXIST',
      );
    }

    const role = Role.create({
      roleName: body.roleName,
      permissions: body.permissions,
    });

    // Insert Role and Assign Permissions
    const createdRole = await this.transactionManager.runInTransaction(
      async (tx) => {
        const roleCreated = await this.roleRepository.createRole(
          role.roleName,
          tx as PgTransactionContext,
        );

        const assignedPermissions =
          await this.permissionRepository.assignPermissionIntoRole(
            roleCreated.id,
            role.permissions,
            tx as PgTransactionContext,
          );

        const roleReturned: RoleRow = {
          id: roleCreated.id,
          role_name: roleCreated.role_name,
          permissions: assignedPermissions,
        };

        return roleReturned;
      },
    );

    return createdRole;
  }

  // Update Role by Id
  async updateRoleById(
    id: string,
    body: UpdateRoleRequestDto,
  ): Promise<RoleRow> {
    const existing = await this.roleRepository.findRoleById(id);
    if (!existing) {
      throw new NotFoundException('Role not found', 'RESOURCE_NOT_FOUND');
    }

    if (body.roleName) {
      const role = await this.roleRepository.updateRoleName(id, body.roleName);
      if (!role) {
        throw new ConflictException(
          'Role is system role, cannot update',
          'ROLE_IS_SYSTEM',
        );
      }
    }

    if (body.permissions) {
      await this.transactionManager.runInTransaction(async (tx) => {
        await this.permissionRepository.deleteAssignedPermission(
          id,
          tx as PgTransactionContext,
        );

        await this.permissionRepository.assignPermissionIntoRole(
          id,
          body.permissions!,
          tx as PgTransactionContext,
        );
      });
    }

    const updated = await this.roleRepository.findRoleById(id);
    if (!updated) {
      throw new NotFoundException('Role not found', 'RESOURCE_NOT_FOUND');
    }
    return updated;
  }

  // Delete Role by Id
  async deleteRoleById(id: string): Promise<void> {
    const isAssigned = await this.roleRepository.isRoleAssignedToUser(id);
    if (isAssigned) {
      throw new ConflictException(
        'Role cannot be deleted while assigned to users',
        'RESOURCE_IN_USE',
      );
    }

    const success = await this.roleRepository.deleteRoleById(id);
    if (!success) {
      throw new NotFoundException('Role not found', 'RESOURCE_NOT_FOUND');
    }
  }
}
