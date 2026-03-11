import { PaymentType } from 'src/module/finance/payment/domain/type/payment-type';
import { DiscountType } from '../../domain/type/discount-type.enum';
import { PaymentMethod } from 'src/module/finance/payment/domain/type/payment-method';
import { SaleStatus } from '../../domain/type/product-sale-status.enum';

export class SaleReceiptResponseDto {
  id: string;
  invoiceNumber: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  items: {
    productName: string;
    size: string;
    quantity: number;
    unitPrice: number;
    discountType: DiscountType;
    discountValue: number;
    discountAmount: number;
    subTotal: number;
  }[];
  subTotal: number;
  itemsDiscountTotal: number;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  grandTotal: number;
  totalPaid: number;
  remainingAmount: number;
  status: SaleStatus;
  payments: {
    id: string;
    paymentType: PaymentType;
    method: PaymentMethod;
    amount: number;
    paidAt: string;
  }[];
  createdAt: string;
}
