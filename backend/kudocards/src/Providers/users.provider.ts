import { Connection } from 'typeorm';
import { User } from '../Entity/user.entity';

export const usersProviders = [
  {
    provide: 'USERS_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: ['DATABASE_CONNECTION'],
  },
];