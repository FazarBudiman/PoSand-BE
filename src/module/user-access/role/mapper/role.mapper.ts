import { RoleResponseDto } from '../dto/response/role.response.dto';
import { RoleRow } from '../repository/role.row';

export class RoleMapper {
  static toResponse(role: RoleRow): RoleResponseDto {
    return {
      id: role.id,
      roleName: role.role_name,
      permissions: role.permissions.map((p) => {
        return {
          id: p.id,
          permissionName: p.permission_name,
        };
      }),
    };
  }

  static toResponseList(roles: RoleRow[]): RoleResponseDto[] {
    return roles.map((role) => this.toResponse(role));
  }
}
