import { ErrorResponse } from '../types/api-response.interface';

export class DomainException extends Error {
  constructor(
    message: string,
    public readonly errorCode: string,
    public readonly statusCode: number,
    public readonly errors?: ErrorResponse['errors'],
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
