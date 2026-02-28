export class PermissionResponseDto {
  id: string;
  permissionName: string;
}

export class RoleResponseDto {
  id: string;
  roleName: string;
  permissions: PermissionResponseDto[];
}
