import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(join(__dirname, '..', 'cert/agilibo.key')),
    cert: fs.readFileSync(join(__dirname, '..', 'cert/agilibo.crt')),
  };
  
  
 
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
    httpsOptions,
  });
  await app.listen(3000);
}
bootstrap();

