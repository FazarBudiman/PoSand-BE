import { IsNotEmpty, IsOptional } from 'class-validator';
import { PaymentMethod } from 'src/module/finance/payment/domain/type/payment-method';

export class CreateSalePaymentRequestDto {
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsNotEmpty()
  amount: number;

  @IsOptional()
  referenceNumber?: string;

  @IsOptional()
  notes?: string;
}
