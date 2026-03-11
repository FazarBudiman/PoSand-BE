export interface AuthenticatedUserRow {
  id: string;
  full_name: string;
  username: string;
  password_hash: string;
  role_id: string;
  role_name: string;
  is_active: boolean;
  permissions: string[];
}
