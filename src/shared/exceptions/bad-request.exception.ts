import { ErrorResponse } from '../types/api-response.interface';
import { DomainException } from './domain.exception';

export class BadRequestException extends DomainException {
  constructor(
    message: string,
    errorCode: string = 'BAD_REQUEST',
    errors: ErrorResponse['errors'],
  ) {
    super(message, errorCode, 400, errors);
  }
}
