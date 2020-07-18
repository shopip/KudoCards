

import { CreateUserDto } from './../../blog/DTO/CreateUserDto';
import { Controller, Post, Body, Get, UseGuards, Request, Res } from  '@nestjs/common';
import { AuthService } from  '../auth/auth.service';


import { AuthGuard } from '@nestjs/passport';

import { UserData, TokenDTO } from 'src/DTO/AgiliboResponseDTO';
import { User } from '../../Entity/user.entity';




@Controller('auth')
export class AuthController {

    constructor(private  readonly  authService:  AuthService){

    }

    @Post('login')
    async login(@Body() user: User): Promise<any> {
      return this.authService.login(user);
    }  

    @Post('sso')
    async ssoLogin(@Body() token: TokenDTO): Promise<any> {
      return this.authService.ssoLogin(token.token);
    }  

    @UseGuards(AuthGuard('jwt'))
    @Post('set-company')
    async setCompany(@Request() req, @Body() user: UserData): Promise<any> {
      return this.authService.setCompany(user, req.user.email);
    }  

    @Post('register')
    async register(@Body() user: User ): Promise<any> {
       
      return this.authService.register(user);
    } 

    @UseGuards(AuthGuard('jwt'))
    @Get('check')
    async check(@Request() req): Promise<any> {
       const data =  {

        user : (req.user),
        type: 'agilibo',
        msg : 'hello world'

       }

      return data;
    } 


}
