export interface SuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
  errors?: unknown[] | Record<string, unknown>;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
