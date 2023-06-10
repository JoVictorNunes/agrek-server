import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from 'app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Agrek API')
    .setDescription('Agrek Main API for managing users, customers and areas')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('users')
    .addTag('customers')
    .addTag('areas')
    .addTag('sprayings')
    .addTag('drones')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
