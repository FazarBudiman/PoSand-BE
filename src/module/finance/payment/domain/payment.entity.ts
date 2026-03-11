import { PaymentMethod } from './type/payment-method';
import { PaymentSourceType } from './type/payment-source-type';
import { PaymentType } from './type/payment-type';

export class Payment {
  constructor(
    public sourceType: PaymentSourceType,
    public sourceId: string,
    public paymentType: PaymentType,
    public paymentMethod: PaymentMethod,
    public amount: number,
    public referenceNumber?: string | null,
    public notes?: string | null,
  ) {}

  static create(params: {
    sourceType: PaymentSourceType;
    sourceId: string;
    paymentType: PaymentType;
    paymentMethod: PaymentMethod;
    amount: number;
    referenceNumber?: string;
    notes?: string;
  }): Payment {
    return new Payment(
      params.sourceType,
      params.sourceId,
      params.paymentType,
      params.paymentMethod,
      params.amount,
      params.referenceNumber || null,
      params.notes || null,
    );
  }
}
