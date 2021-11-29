import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { configSwagger } from '@config';
import { HttpResponseInterceptor } from '@common/interceptors';
import { HttpExceptionFilter } from '@common/exeptions';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(compression());
  app.enableCors();
  app.enableVersioning();

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix(AppModule.apiPrefix);
  configSwagger(app, AppModule.apiVersion);
  await app.listen(AppModule.port);
  return AppModule.port;
};

bootstrap().then((port: number) => {
  Logger.log(`Application running on port: ${port}`, 'Main');
});
