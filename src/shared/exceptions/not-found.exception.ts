import { DomainException } from './domain.exception';

export class NotFoundException extends DomainException {
  constructor(message: string, errorCode: string = 'NOT_FOUND') {
    super(message, errorCode, 404);
  }
}
