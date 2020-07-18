import { Kudo } from './../Entity/kudo.entity';
import { Connection } from 'typeorm';


export const kudoProviders = [
  {
    provide: 'KUDO_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Kudo),
    inject: ['DATABASE_CONNECTION'],
  },
];