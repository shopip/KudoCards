import { CreateHistoryDto } from '../DTO/CreateHistoryDTO';
import { HistoryService } from './history.service';
import { MailDTO } from '../DTO/MailDTO';
import { AgiliboNotificationService } from '../helpers/agilibo-notification/agilibo-notification.service';

import { config } from './../config/config';
import { NotificationPostDTO } from './../DTO/NotificationPostDTO';
import { UserService } from './../auth/user/user.service';

import { CreateKudoDto } from './../DTO/CreateKudoDto';
import { Kudo } from './../Entity/kudo.entity';

import { KudoService } from './kudo.service';
import { Controller, Post, Body, Get, UseGuards, Request, Query } from  '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MailService } from '../helpers/mail/mail.service';





@Controller('kudo')
export class KudoController {

    constructor(private kudoService: KudoService , private mail : MailService , private userService: UserService ,
         private agNotificationService : AgiliboNotificationService, private historyService : HistoryService){

    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@Request() req , @Query() query ) : Promise<Kudo[]> {
       
        return this.kudoService.findAllFromDB(req.user.company.id ,query);

    }
    @UseGuards(AuthGuard('jwt'))
    @Get('teams')
    findAllTeams() : Promise<Kudo[]> {
       
        return this.kudoService.findAllTeams();

    }
    @UseGuards(AuthGuard('jwt'))
    @Get('userlist')
    findAllCompanyUsers(@Request() req , @Query() query ) : Promise<any> {
       
        return this.kudoService.findAllCompanyUserFromAgilibo(req.user.company.id,req.user.token,query);

    }

    @UseGuards(AuthGuard('jwt'))
    @Get('sprintlist')
    findAllSprintsUsers(@Request() req , @Query() query ) : Promise<any> {
       
        return this.kudoService.findAllSprintsByUserFromAgilibo(req.user.token,query);

    }

    @UseGuards(AuthGuard('jwt'))
    @Get('kudowheelhistory')
    findAllSprintsHistory(@Request() req , @Query() query ) : Promise<any> {
       
        return this.historyService.findAllFromDB(req.user.company.id,query);

    }

    @UseGuards(AuthGuard('jwt'))
    @Post("createkudohistory")
    createKudoWheelHistory(@Body() createHistoryDTO : CreateHistoryDto,@Request() req) : Promise<CreateHistoryDto> {

        createHistoryDTO.companyId = req.user.company.id;

        console.log(createHistoryDTO);
        
        return this.historyService.create(createHistoryDTO);
       

    }

    @UseGuards(AuthGuard('jwt'))
    @Post("create")
    create(@Body() createKudoDto : CreateKudoDto,@Request() req) : Promise<CreateKudoDto> {
       
        console.log('kudo create request');
        createKudoDto.fromEmail = req.user.email;
        createKudoDto.fromName = req.user.username ;
        createKudoDto.fromImage = req.user.image ;
        createKudoDto.companyId = req.user.company.id ;
        createKudoDto.kudoId  =  JSON.parse(JSON.stringify(createKudoDto.kudoType)).id ;
     

            if (createKudoDto.team != null )
            createKudoDto.team = createKudoDto.teamId ;
           
             if (typeof createKudoDto.team != "number") {

                createKudoDto.team = 0 ;
             }

        
            
        
        

        console.log(createKudoDto);


        return  this.kudoService.create(createKudoDto).then((kudo)=> {
            //getting current users
            if (config.sendKudoMail || config.sendCoreNotification)
            this.userService.findByEmail(kudo.fromEmail).then((user)=> {
                //sending email
                if (config.sendKudoMail)
                this.mail.getMailContent(kudo).then((value)=> {

                    const mail : MailDTO = {} as MailDTO ;
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    mail.from_email = kudo.fromEmail;
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    mail.from_name = kudo.fromName;
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    mail.to_email = kudo.toEmail;
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    mail.to_name = kudo.toName;
                    
                    mail.token = user.token;
                    mail.content = value ;
                    this.mail.sendMail(mail);
                   
     
     
                 });

                 //Sending notification
                 if (config.sendCoreNotification)
                 {
                    const notification : NotificationPostDTO = {} as NotificationPostDTO ;
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    notification.company_id = kudo.companyId ;
                    notification.description = kudo.title;
                    notification.title = `${kudo.fromName} has just posted ${kudo.toName} a new KUDO Card`;
                    notification.token = user.token ;
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    notification.feed_type = "general";
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    notification.target_url='https://agilibo.com';
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    notification.event_time = new Date().toISOString();

                    this.agNotificationService.sendNotification(notification);

                 }

                
            }); 
            
          
            return kudo
        }).catch((err)=> {

            return err ;
        });

    }




}
