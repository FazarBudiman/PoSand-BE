import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../shared/exceptions/domain.exception';
import type { ErrorResponse } from '../../shared/types/api-response.interface';

const ErrorCodeMap: Record<number, string> = {
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // ===============================
    // 1️⃣ DomainException
    // ===============================
    if (exception instanceof DomainException) {
      const { message, errorCode, statusCode, errors } = exception;

      const body: ErrorResponse = {
        success: false,
        message,
        errorCode,
        ...(errors && { errors }),
      };

      response.status(statusCode).json(body);
      return;
    }

    // ===============================
    // 2️⃣ NestJS HttpException
    // ===============================
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse: unknown = exception.getResponse();

      let message = exception.message;
      let errors: ErrorResponse['errors'];
      let customErrorCode: string | undefined;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        // Ekstrak errorCode jika ada
        if ('errorCode' in exceptionResponse) {
          customErrorCode = (exceptionResponse as { errorCode: string })
            .errorCode;
        }

        if ('message' in exceptionResponse) {
          const msg = (exceptionResponse as { message?: unknown }).message;

          if (Array.isArray(msg)) {
            message = 'Validation failed';
            errors = msg.filter(
              (item): item is string => typeof item === 'string',
            );
          } else if (typeof msg === 'string') {
            message = msg;
          }
        }
      }

      const errorCode =
        customErrorCode ||
        ErrorCodeMap[status] ||
        exception.constructor.name
          .replace('Exception', '')
          .split(/(?=[A-Z])/)
          .join('_')
          .toUpperCase();

      const body: ErrorResponse = {
        success: false,
        message,
        errorCode,
        ...(errors && { errors }),
      };

      response.status(status).json(body);
      return;
    }

    // ===============================
    // 3️⃣ Unknown Error → 500
    // ===============================
    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error('Unhandled non-error exception', exception);
    }

    const body: ErrorResponse = {
      success: false,
      message: 'Internal server error',
      errorCode: 'INTERNAL_SERVER_ERROR',
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
  }
}
