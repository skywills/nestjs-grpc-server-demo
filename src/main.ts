import { AppFactory } from '@nathapp/nestjs-app';
import { getLoggerLevel } from '@nathapp/nestjs-common';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await AppFactory.createFastifyApp(AppModule, {
    logger: getLoggerLevel(),
  });

  const appService = app.get(AppService);
  app
    .useAppGlobalPipes()
    .useAppGlobalPrefix()
    .useAppGlobalFilters()
    .useAppGlobalGuards()
    .useSwaggerUIOnDevOnly(appService.getAppInfo());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'hero',
      protoPath: join(__dirname, 'hero/hero.proto'),
      url: '0.0.0.0:8765',
    },
  });

  await app.start();
}
bootstrap();
