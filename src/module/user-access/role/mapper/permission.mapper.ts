import { Permission } from '../domain/permission.entity';
import { PermissionResponseDto } from '../dto/response/role.response.dto';

export class PermissionMapper {
  static toResponse(permission: Permission): PermissionResponseDto {
    return {
      id: permission.id,
      permissionName: permission.permissionName,
    };
  }

  static toResponseList(permissions: Permission[]): PermissionResponseDto[] {
    return permissions.map((permission) => this.toResponse(permission));
  }
}
