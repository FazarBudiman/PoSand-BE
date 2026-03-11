import { PermissionResponseDto } from '../dto/response/permission.response.dto';
import { PermissionRow } from '../repository/permission.row';

export class PermissionMapper {
  static toResponse(permission: PermissionRow): PermissionResponseDto {
    return {
      id: permission.id,
      permissionName: permission.permission_name,
    };
  }

  static toResponseList(permissions: PermissionRow[]): PermissionResponseDto[] {
    return permissions.map((permission) => this.toResponse(permission));
  }
}
