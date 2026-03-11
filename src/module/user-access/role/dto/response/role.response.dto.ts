import { PermissionResponseDto } from './permission.response.dto';

export class RoleResponseDto {
  id: string;
  roleName: string;
  permissions: PermissionResponseDto[];
}
