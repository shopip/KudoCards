import { SocketStateService } from './sockets/socketstate.service';

import { BlogModule } from './blog/BlogModule';
import { Module, HttpModule, HttpService } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AgiliboService } from './helpers/agilibo/agilibo.service';
import { KudoModule } from './kudo/kudo.module';
import { ServeStaticModule } from '@nestjs/serve-static';


import { AgiliboNotificationService } from './helpers/agilibo-notification/agilibo-notification.service';
import { MailService } from './helpers/mail/mail.service';
import { join } from 'path';
import { AppGateway } from './sockets/app.gateway';





@Module({
  imports: [BlogModule, AuthModule,HttpModule.register({
    timeout: 15000,
    maxRedirects: 5,
  }), KudoModule,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
  }),],
  controllers: [],
  providers: [AgiliboService, MailService, AgiliboNotificationService,AppGateway, SocketStateService],
  exports: [AgiliboService,MailService,SocketStateService],
})
export class AppModule {}
