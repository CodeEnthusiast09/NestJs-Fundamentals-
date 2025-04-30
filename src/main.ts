import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // app.useGlobalInterceptors(new TransformInterceptor());

  // const seedService = app.get(SeedService);
  // await seedService.seed();

  const config = new DocumentBuilder() //1
    .setTitle('Spotify Clone')
    .setDescription('Spotify Clone Api documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config); //2
  SwaggerModule.setup('api', app, document); //3

  const configService = app.get(ConfigService);

  await app.listen(configService.get<number>('port'));
  console.log(configService.get<string>('NODE_ENV'));
}
bootstrap();
