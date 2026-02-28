import { DomainException } from './domain.exception';

export class BusinessRuleException extends DomainException {
  constructor(message: string, errorCode: string = 'BUSINESS_RULE_VIOLATION') {
    super(message, errorCode, 409);
  }
}
