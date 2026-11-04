import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const frontendOrigins = (process.env.FRONTEND_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (frontendOrigins.length > 0) {
    app.enableCors({
      origin: frontendOrigins,
      credentials: true,
    });
  }

  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error: unknown) => {
  console.error('Application startup failed', error);
  process.exitCode = 1;
});