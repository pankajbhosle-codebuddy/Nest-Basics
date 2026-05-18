import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
// import { LoggerMiddleware } from './common/logger/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new PrismaExceptionFilter(),
  );

  // Global middleware
  // app.use(new LoggerMiddleware().use.bind(new LoggerMiddleware()));

  // Prisma shutdown hooks
  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);

  logger.log(`Application running on: http://localhost:${PORT}`);
}

void bootstrap();
