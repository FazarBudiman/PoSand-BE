export interface CustomerRow {
  id: string;
  fullname: string;
  phone?: string | null;
  address?: string | null;
  tags?: string[];
}
