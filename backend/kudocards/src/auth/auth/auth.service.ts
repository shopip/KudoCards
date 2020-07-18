import { UserInfo } from './../../DTO/UserInfoDTo';
import { UserData, AgiliboTokenDTO,AgiliboResponseDTO } from './../../DTO/AgiliboResponseDTO';
import { User } from '../../Entity/user.entity';
import { AgiliboService } from './../../helpers/agilibo/agilibo.service';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from  '@nestjs/jwt';
import { UserService } from  '../user/user.service';



@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly agilibo : AgiliboService
    ){ }

    private async validate(userData: User): Promise<User> {
        return await this.userService.findByEmailPasword(userData.email,userData.password);
    }

    private async validateByAgilibo(userData: User): Promise<User> {
      const loginData : AgiliboResponseDTO = await this.agilibo.agiliboLogin (userData.email,userData.password);
     if (!loginData)
     {
       return null;
     }
     else
      { 
        
        const user = await this.userService.findByEmail(userData.email); 
        
        if (!user)
        {
          const newUser = new User ();
          newUser.name = loginData.name;
          newUser.avatar = loginData.profileImage;
          newUser.email = loginData.userEmail;
          newUser.token = loginData.token;
          newUser.password = loginData.token;
          newUser.data = loginData.companies;
         return  await this.userService.create(newUser);
        }

        else{
          user.data = loginData.companies;
          user.token = loginData.token ;
          user.avatar = loginData.profileImage ;
          return  await this.userService.update(user);
        } 
      
      }

  }



  private async validateTokenByAgilibo(token: string): Promise<User> {
    const loginData : AgiliboTokenDTO = await this.agilibo.agiliboLoginByToken (token);
   if (!loginData)
   {
     return null;
   }
   else
    { 
      const user = await this.userService.findByEmail(loginData.userEmail); 

      if (!user)
      {
        const newUser = new User ();
        newUser.name = loginData.name;
        newUser.avatar = loginData.profileImage;
        newUser.email = loginData.userEmail;
        newUser.token = loginData.token;
        newUser.password = loginData.token;
        newUser.data = JSON.parse(JSON.stringify(loginData.companies));
       return  await this.userService.create(newUser);
      }

      else{
        user.data =  JSON.parse(JSON.stringify(loginData.companies));
        user.token = loginData.token ;
        user.avatar = loginData.profileImage ;
        return  await this.userService.update(user);
      } 

       
    
    }

  }

  public validateToken (token : string) : UserInfo {

    try {
     
    const user =  this.jwtService.verify(token) as UserInfo;

    return user ;
    } catch (error) {
      
      return null;
    }
    

  }
  
 

  public async setCompany(userData: UserData, email : string): Promise< any | { status: number }>{
          
          const user = await this.userService.findByEmail(email); 
          
          const payload = {

            email : user.email,
            sub : user.id,
            username : user.name,
            company : userData,
            image : user.avatar,
            token : user.token


          }


          const accessToken = this.jwtService.sign(payload);

          return {'access_token': accessToken};
    }
    public async ssoLogin (token :string): Promise< any | { status: number }>{

      return this.validateTokenByAgilibo(token).then((userData)=>{
        if(!userData){
        // return  res.status(HttpStatus.UNAUTHORIZED).json( { status: 404 });
       
        throw new HttpException({ status: HttpStatus.UNAUTHORIZED, message: 'Username or password is invalid' }, HttpStatus.UNAUTHORIZED);
         
        }

        try {

          const userCompanies = (JSON.parse(JSON.stringify(userData.data)) as  UserData[] );
          const currentCompany = userCompanies[0];
          delete currentCompany.units;

              
        const payload = {

          image : userData.avatar,
          email : userData.email,
          company : currentCompany,
          sub : userData.id,
          username : userData.name,
          token : userData.token



        }
   
        const accessToken = this.jwtService.sign(payload);

        return {
           'expires_in': 3600,
           'access_token': accessToken,
           'core_token': userData.token,
           'core_token1': 'static',
           'user_info': payload,
           'user_data': userData.data,
           'status': 200
        };
          
        } catch (error) {

          throw new HttpException({ status: HttpStatus.UNAUTHORIZED, message: 'Username or password is invalid' }, HttpStatus.UNAUTHORIZED);
          
        }
       

       


  

      });


    }

    public async login(user: User): Promise< any | { status: number }>{
        return this.validateByAgilibo(user).then((userData)=>{
          if(!userData){
          // return  res.status(HttpStatus.UNAUTHORIZED).json( { status: 404 });
         
          throw new HttpException({ status: HttpStatus.UNAUTHORIZED, message: 'Username or password is invalid' }, HttpStatus.UNAUTHORIZED);
           
          }
        
          const payload = {

            image : userData.avatar,
            email : userData.email,
            sub : userData.id,
            username : userData.name,
            token : userData.token



          }
     
          const accessToken = this.jwtService.sign(payload);

          return {
             'expires_in': 3600,
             'access_token': accessToken,
             'core_token': userData.token,
             'core_token1': 'static',
             'user_info': payload,
             'user_data': userData.data,
             'status': 200
          };

        });
    }

    public async register(user: User): Promise<any>{
        return this.userService.create(user)
    }


}
