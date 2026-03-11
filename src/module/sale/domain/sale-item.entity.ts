import { DiscountType } from './type/discount-type.enum';

export class SaleItem {
  constructor(
    public readonly saleId: string,
    public readonly id: string,
    public readonly productVariantId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly discountType: DiscountType | null,
    public readonly discountValue: number | null,
    public readonly discountAmount: number,
    public readonly subTotal: number,
  ) {}

  static create(params: {
    saleId: string;
    id: string;
    productVariantId: string;
    quantity: number;
    unitPrice: number;
    discountType?: DiscountType;
    discountValue?: number;
  }): SaleItem {
    const basePrice = params.quantity * params.unitPrice;

    let discountAmount = 0;

    if (params.discountType === DiscountType.PERCENTAGE) {
      discountAmount = basePrice * ((params.discountValue ?? 0) / 100);
    }

    if (params.discountType === DiscountType.FIXED) {
      discountAmount = params.discountValue ?? 0;
    }

    const subTotal = basePrice - discountAmount;

    return new SaleItem(
      params.saleId,
      params.id,
      params.productVariantId,
      params.quantity,
      params.unitPrice,
      params.discountType ?? null,
      params.discountValue ?? null,
      discountAmount,
      subTotal,
    );
  }
}
