import { History } from './../Entity/history.entity';
import { Connection } from 'typeorm';


export const historyProviders = [
  {
    provide: 'HISTORY_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(History),
    inject: ['DATABASE_CONNECTION'],
  },
];