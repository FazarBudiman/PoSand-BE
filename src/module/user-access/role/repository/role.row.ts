import { PermissionRow } from './permission.row';

export interface RoleRow {
  id: string;
  role_name: string;
  permissions: PermissionRow[];
}
