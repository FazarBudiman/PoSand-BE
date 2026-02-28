import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestException } from './shared/exceptions/bad-request.exception';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedError = errors.map((error) => {
          return {
            field: error.property,
            error: Object.values(error.constraints || {}),
          };
        });
        return new BadRequestException(
          'Validation Error',
          'VALIDATION_ERROR',
          formattedError,
        );
      },
    }),
  );

  app.use(cookieParser());

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
