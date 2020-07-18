import { UserService } from './../user/user.service';
import { config } from './../../config/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable, UnauthorizedException } from '@nestjs/common';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }


  async validate(payload: any) {

   
    // console.log(payload);
     
    const user = this.userService.findByEmail (payload.email);

    if (user == null)
    {
        new UnauthorizedException();
    }

    return payload ;
   
    }
}