import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestException } from './shared/exceptions/bad-request.exception';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { Express } from 'express';
import { INestApplication } from '@nestjs/common';

let cachedServer: Express;

async function bootstrap(): Promise<INestApplication> {
  console.log('Bootstrapping application...');
  const app = await NestFactory.create(AppModule);
  console.log('Nest application created.');

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

  console.log('Calling app.init()...');
  await app.init();
  console.log('app.init() finished.');

  return app;
}

// Local start
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  bootstrap()
    .then(async (app) => {
      const port = process.env.PORT ?? 5000;
      await app.listen(port);
      console.log(`Application is running on: http://localhost:${port}`);
    })
    .catch((err) => {
      console.error('Failed to start application:', err);
      process.exit(1);
    });
}

// Handler untuk Vercel
export default async (req: any, res: any) => {
  if (!cachedServer) {
    const app = await bootstrap();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer(req, res);
};
