import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestException } from './shared/exceptions/bad-request.exception';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { Express, Request, Response } from 'express';

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
  SwaggerModule.setup('api', app, document, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  });

  console.log('Calling app.init()...');
  await app.init();
  console.log('app.init() finished.');

  return app;
}

// Local start
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  bootstrap()
    .then(async (app: INestApplication) => {
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
export default async (req: VercelRequest, res: VercelResponse) => {
  if (!cachedServer) {
    const app = await bootstrap();
    cachedServer = app.getHttpAdapter().getInstance() as Express;
  }
  cachedServer(req as unknown as Request, res as unknown as Response);
};
