import { SaleItem } from './sale-item.entity';
import { DiscountType } from './type/discount-type.enum';
import { SaleStatus } from './type/product-sale-status.enum';

export class Sale {
  constructor(
    public readonly id: string,
    public readonly invoiceNumber: string,
    public readonly customerId: string,
    public readonly subTotal: number,
    public readonly itemsDiscountTotal: number,
    public readonly discountType: DiscountType | null,
    public readonly discountValue: number | null,
    public readonly discountAmount: number,
    public readonly grandTotal: number,
    public readonly totalPaid: number,
    public readonly remainingAmount: number,
    public readonly status: SaleStatus,
    public readonly note: string | null,
    public readonly productSaleItems?: SaleItem[],
    public readonly createdAt?: string,
  ) {}

  static generateInvoiceNumber(productSaleId: string): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const datePart = `${year}${month}${day}`;
    return `ATPS-${datePart}-${productSaleId}`;
  }

  static create(params: {
    id: string;
    customerId: string;
    items: SaleItem[];
    discountType?: DiscountType;
    discountValue?: number;
    note?: string;
  }): Sale {
    const subTotal = params.items.reduce((acc, item) => acc + item.subTotal, 0);

    const itemsDiscountTotal = params.items.reduce(
      (acc, item) => acc + item.discountAmount,
      0,
    );

    let discountAmount = 0;

    if (params.discountType === DiscountType.PERCENTAGE) {
      discountAmount = subTotal * ((params.discountValue ?? 0) / 100);
    }

    if (params.discountType === DiscountType.FIXED) {
      discountAmount = params.discountValue ?? 0;
    }

    const grandTotal = subTotal - discountAmount;

    const invoiceNumber = this.generateInvoiceNumber(params.id);

    return new Sale(
      params.id,
      invoiceNumber,
      params.customerId,
      subTotal,
      itemsDiscountTotal,
      params.discountType ?? null,
      params.discountValue ?? null,
      discountAmount,
      grandTotal,
      0,
      grandTotal,
      SaleStatus.UNPAID,
      params.note ?? null,
      params.items,
      new Date().toISOString(),
    );
  }

  static update(params: {
    totalPaid: number;
    remainingAmount: number;
  }): Partial<Sale> {
    let status = SaleStatus.PARTIALLY_PAID;

    if (params.remainingAmount === 0) {
      status = SaleStatus.PAID;
    } else if (params.totalPaid === 0) {
      status = SaleStatus.UNPAID;
    }

    return {
      totalPaid: params.totalPaid,
      remainingAmount: params.remainingAmount,
      status,
    };
  }
}
