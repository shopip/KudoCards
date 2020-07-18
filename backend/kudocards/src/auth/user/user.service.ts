import { Injectable, Inject  } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../Entity/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class UserService {

    constructor(
        @Inject('USERS_REPOSITORY')
        private userRepository: Repository<User>,
    ){

    }

    async findByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({
            
            where: {
                email: email
            },
            select: ['id','avatar','email','name','data','token']
            
        });

    }

    async findByEmailPasword (email : string, password : string) : Promise<User> {

        password  = crypto.createHmac('sha256', password).digest('hex');
        return await this.userRepository.findOne({

            where: {
                email : email,
                password: password

            },
            select : ['id','email','name','avatar']

        });

    }

    async findById(id: number): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                id: id,
            }
        });
    }

    async create(user: User): Promise<User> {
       
        user = this.userRepository.create(user);
        user = await this.userRepository.save(user);
        
        delete user.password ;
        return user;
    }

    async update(user: User): Promise<User> {
       
      
        user = await this.userRepository.save(user);
        
        delete user.password ;
        return user;
    }


}
