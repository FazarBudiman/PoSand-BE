import { SaleStatus } from '../../domain/type/product-sale-status.enum';

export class SaleResponseDto {
  id: string;
  invoiceNumber: string;
  customerId: string;
  subTotal: number;
  itemsDiscountTotal: number;
  discountAmount: number;
  grandTotal: number;
  totalPaid: number;
  remainingAmount: number;
  status: SaleStatus;
  createdAt?: string;
  note?: string;
}
