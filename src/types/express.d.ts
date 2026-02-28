import { JwtPayload } from '../shared/types/jwt-payload.type';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
    cookies: {
      access_token?: string;
      refresh_token?: string;
    };
  }
}
