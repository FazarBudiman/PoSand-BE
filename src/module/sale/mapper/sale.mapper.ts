import { SaleRow } from '../repository/sale.row';
import { SaleResponseDto } from '../dto/response/sale.response.dto';

export class SaleMapper {
  static toResponse(productSale: SaleRow): SaleResponseDto {
    return {
      id: productSale.id,
      customerId: productSale.customer_id,
      invoiceNumber: productSale.invoice_number,
      subTotal: productSale.sub_total,
      itemsDiscountTotal: productSale.items_discount_total,
      discountAmount: productSale.discount_amount,
      grandTotal: productSale.grand_total,
      totalPaid: productSale.total_paid,
      remainingAmount: productSale.remaining_amount,
      status: productSale.status,
      createdAt: productSale.created_at,
      note: productSale.notes || undefined,
    };
  }

  static toResponseList(productSales: SaleRow[]): SaleResponseDto[] {
    return productSales.map((productSale) => this.toResponse(productSale));
  }
}
