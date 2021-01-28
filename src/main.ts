import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { configSwagger } from '@config';
import { ConfigService } from '@nestjs/config';
import { HttpResponseInterceptor } from '@common/interceptors';
import { HttpExceptionFilter } from '@common/exeptions';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_PORT');
  const prefix = configService.get<string>('API_PREFIX');

  app.use(helmet());
  app.use(compression());
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(prefix);
  configSwagger(app);
  await app.listen(port);
  return port;
}

bootstrap().then((port: number) => {
  Logger.log(`Application running on port: ${port}`, 'Main');
});
