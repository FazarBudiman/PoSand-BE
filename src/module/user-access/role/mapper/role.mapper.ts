import { Role } from '../domain/role.entity';
import { RoleResponseDto } from '../dto/response/role.response.dto';

export class RoleMapper {
  static toResponse(role: Role): RoleResponseDto {
    return {
      id: role.id,
      roleName: role.roleName,
      permissions: role.permissions,
    };
  }

  static toResponseList(roles: Role[]): RoleResponseDto[] {
    return roles.map((role) => this.toResponse(role));
  }
}
