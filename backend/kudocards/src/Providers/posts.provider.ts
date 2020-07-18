
import { Connection } from 'typeorm';
import { Post } from '../Entity/post.entity';

export const postsProviders = [
  {
    provide: 'POSTS_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Post),
    inject: ['DATABASE_CONNECTION'],
  },
];