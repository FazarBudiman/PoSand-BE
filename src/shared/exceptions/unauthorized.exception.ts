import { DomainException } from './domain.exception';

export class UnauthorizedException extends DomainException {
  constructor(message: string, errorCode: string = 'UNAUTHORIZED') {
    super(message, errorCode, 401);
  }
}
