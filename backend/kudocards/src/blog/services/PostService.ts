import { Repository } from 'typeorm';


import { Injectable, Inject } from "@nestjs/common";
import { Observable, from } from 'rxjs';
import { Post } from '../../Entity/post.entity';
import { CreatePostDto } from '../DTO/CreatePostDto';



@Injectable()
export class PostService {

    constructor(
        @Inject('POSTS_REPOSITORY')
        private postRepository: Repository<Post>,
      ) {


      }
    
    public async  findAllFromDB(): Promise<Post[]>  {
        
        return this.postRepository.find();

    }

  
   
    public create(createPostDto : CreatePostDto) : Promise<CreatePostDto> {
        

        return this.postRepository.save(createPostDto);

    }
   

    public findAll(): Observable<Post[]>  {
        
        
        return from(this.postRepository.find());
    }


}