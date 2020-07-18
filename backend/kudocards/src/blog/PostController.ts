import { CreatePostDto } from './DTO/CreatePostDto';
import { PostService } from './services/PostService';
import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { Post as PostItem } from '../Entity/post.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostController {

    constructor(private postService : PostService) {

    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll() : Promise<PostItem[]> {
        // return this.postService.findAll();
        return this.postService.findAllFromDB();

    }

    @Post()
    create(@Body() createPostDto : CreatePostDto) : Promise<CreatePostDto> {
        // return this.postService.findAll();
        
     return  this.postService.create(createPostDto);

    }



}