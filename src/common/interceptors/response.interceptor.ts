import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { SuccessResponse } from '../../shared/types/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  SuccessResponse<T>
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) {
          return { success: true as const };
        }

        if (typeof data !== 'object' || Array.isArray(data)) {
          return { success: true as const, data };
        }

        const {
          message,
          data: innerData,
          meta,
          ...rest
        } = data as Record<string, unknown>;

        const result: SuccessResponse<T> = { success: true };

        if (message !== undefined) result.message = message as string;

        if (innerData !== undefined) {
          result.data = innerData as T;
        } else if (Object.keys(rest).length > 0) {
          result.data = rest as T;
        }

        if (meta !== undefined) {
          result.meta = meta as Record<string, unknown>;
        }

        return result;
      }),
    );
  }
}
