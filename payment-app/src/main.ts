import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
// import * as hbs from 'hbs';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;
  // TODO: enable csrf - https://docs.nestjs.com/security/csrf

  /**
   * Apply validation for all inputs globally
   */
  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * Strip away all none-object existing properties
       */
      whitelist: true,
      /***
       * Transform input objects to their corresponding DTO objects
       */
      transform: true,
    }),
  );

  app.useStaticAssets(join(__dirname, 'public'));
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.set('view options', { layout: 'partials/default' });
  app.setViewEngine('hbs');

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port);
  });
}
bootstrap();
