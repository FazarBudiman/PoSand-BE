export interface UserRow {
  id: string;
  full_name: string;
  username: string;
  password_hash: string;
  role_id: string;
  is_active: boolean;
  role_name: string;
  permission_name: string[];
}
