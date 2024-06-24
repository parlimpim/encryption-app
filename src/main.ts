import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/exceptions/global-exception.filter';

const API_DEFAULT_PORT = 3000;

const SWAGGER_TITLE = 'Encryption App API';
const SWAGGER_DESCRIPTION = 'API used for Encryption App';
const SWAGGER_PREFIX = 'api-docs';

function createSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_PREFIX, app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // class validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // create swagger
  createSwagger(app);

  // bind interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // bind exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.API_PORT || API_DEFAULT_PORT);
}
bootstrap();
