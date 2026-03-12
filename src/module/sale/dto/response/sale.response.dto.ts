import { ApiProperty } from '@nestjs/swagger';
import { SaleStatus } from '../../domain/type/product-sale-status.enum';

export class SaleResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'INV-2024-001' })
  invoiceNumber: string;

  @ApiProperty({ example: '1' })
  customerId: string;

  @ApiProperty({ example: 100000 })
  subTotal: number;

  @ApiProperty({ example: 5000 })
  itemsDiscountTotal: number;

  @ApiProperty({ example: 2000 })
  discountAmount: number;

  @ApiProperty({ example: 93000 })
  grandTotal: number;

  @ApiProperty({ example: 50000 })
  totalPaid: number;

  @ApiProperty({ example: 43000 })
  remainingAmount: number;

  @ApiProperty({ enum: SaleStatus, example: 'PARTIALLY_PAID' })
  status: SaleStatus;

  @ApiProperty({ example: '2024-03-12T07:15:40Z', required: false })
  createdAt?: string;

  @ApiProperty({ example: 'Note', required: false })
  note?: string;
}
