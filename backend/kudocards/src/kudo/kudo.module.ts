import { HistoryService } from './history.service';
import { AgiliboService } from './../helpers/agilibo/agilibo.service';
import { usersProviders } from '../Providers/users.provider';
import { AgiliboNotificationService } from '../helpers/agilibo-notification/agilibo-notification.service';
import { kudoProviders } from '../Providers/kudo.provider';
import { UserService } from './../auth/user/user.service';
import { KudoService } from './kudo.service';
import { Module, HttpModule } from '@nestjs/common';
import { KudoController } from './kudo.controller';
import { DatabaseModule } from './../database/database.module';
import { MailService } from '../helpers/mail/mail.service';
import { historyProviders } from '../Providers/history.provider';








@Module({
  imports:[DatabaseModule,HttpModule],
  controllers: [KudoController],
  exports:[ MailService,AgiliboNotificationService,...usersProviders,HistoryService, ...historyProviders,
    UserService,],
  providers:[KudoService,HistoryService, MailService,AgiliboNotificationService,UserService,AgiliboService,
    ...usersProviders,...kudoProviders, ...historyProviders],
})
export class KudoModule {}
