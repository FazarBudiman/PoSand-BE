import { IsNotEmpty, IsOptional } from 'class-validator';
import { PaymentMethod } from '../../../finance/payment/domain/type/payment-method';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalePaymentRequestDto {
  @ApiProperty({ enum: PaymentMethod, example: 'CASH' })
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: 50000 })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'REF123', required: false })
  @IsOptional()
  referenceNumber?: string;

  @ApiProperty({ example: 'Pembayaran DP', required: false })
  @IsOptional()
  notes?: string;
}
