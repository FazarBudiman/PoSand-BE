import { DiscountType } from '../domain/type/discount-type.enum';
import { SaleStatus } from '../domain/type/product-sale-status.enum';

export interface SaleRow {
  id: string;
  invoice_number: string;
  customer_id: string;
  sub_total: number;
  items_discount_total: number;
  discount_type: DiscountType | null;
  discount_value: number | null;
  discount_amount: number;
  grand_total: number;
  total_paid: number;
  remaining_amount: number;
  status: SaleStatus;
  notes: string | null;
  created_at: string;
}
