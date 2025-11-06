import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionFilter } from './common/filters/app-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AppExceptionFilter());
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
