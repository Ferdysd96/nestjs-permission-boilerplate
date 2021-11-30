import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { AUTH_OPTIONS, TOKEN_NAME } from '@auth';

const title = 'Nestjs Framework';
const description =
  'This is a basic Nest boilerplate project built on the more powerful node.js framework. ' +
  'The main purpose of this project is to dynamically handle roles and permissions assigned to the user.';

/**
 * Setup swagger in the application
 * @param app {INestApplication}
 */
export const SwaggerConfig = (app: INestApplication, apiVersion: string) => {
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(apiVersion)
    .addBearerAuth(AUTH_OPTIONS, TOKEN_NAME)
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`api/v${apiVersion}/swagger`, app, document);
};
