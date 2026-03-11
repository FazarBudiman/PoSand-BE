import { CashflowSourceType } from './type/cashflow-source-type';
import { CashflowType } from './type/cashflow-type';

export class Cashflow {
  constructor(
    public type: CashflowType,
    public sourceType: CashflowSourceType,
    public sourceId: string,
    public amount: number,
    public description?: string | null,
  ) {}

  static create(params: {
    type: CashflowType;
    sourceType: CashflowSourceType;
    sourceId: string;
    amount: number;
    description?: string;
  }): Cashflow {
    return new Cashflow(
      params.type,
      params.sourceType,
      params.sourceId,
      params.amount,
      params.description || null,
    );
  }
}
