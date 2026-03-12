import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestException } from './shared/exceptions/bad-request.exception';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { Express } from 'express';

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

  const config = new DocumentBuilder()
    .setTitle('PoSand API')
    .setDescription('PoSand Backend API Documentation')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Jika running lokal (bukan Vercel)
  if (process.env.NODE_ENV !== 'production') {
    await app.listen(process.env.PORT ?? 5000);
    console.log(
      `Application is running on: http://localhost:${process.env.PORT ?? 5000}`,
    );
  }

  return app.getHttpAdapter().getInstance() as Express;
}

// Handler untuk Vercel
export default async (req: any, res: any) => {
  const server = await bootstrap();
  server(req, res);
};

// Jalankan bootstrap jika tidak di production (lokal)
if (process.env.NODE_ENV !== 'production') {
  bootstrap().catch((err) => {
    console.error('Failed to start application:', err);
    process.exit(1);
  });
}
