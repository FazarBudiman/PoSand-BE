import { DomainException } from './domain.exception';

export class ForbiddenException extends DomainException {
  constructor(message: string, errorCode: string = 'FORBIDDEN') {
    super(message, errorCode, 403);
  }
}
