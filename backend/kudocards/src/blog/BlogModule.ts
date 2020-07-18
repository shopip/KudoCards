import { DatabaseModule } from './../database/database.module';
import { PostController } from './PostController';
import { PostService } from './services/PostService';
import { Module } from '@nestjs/common';
import { postsProviders } from '../Providers/posts.provider';





@Module({
  imports: [DatabaseModule],
  controllers: [
      PostController
  ],
  providers: [PostService,
    ...postsProviders],
})
export class BlogModule {}
