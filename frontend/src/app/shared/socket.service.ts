import { environment } from 'src/environments/environment';
import { Injectable, NgModule } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from './auth.service';

@Injectable()
export class SocketBG extends Socket {


    // const config: SocketIoConfig = { url: 'http://localhost:3001/chat', options: {} };
    constructor(private auth: AuthService) {

        super({ url: `${environment.apiUrl}chat`, options: { query: { token : auth.getToken(),
        sprint : auth.getCurrentBoardByUser().sprint.id } } });

        console.log(`sprint in socket query ${ auth.getCurrentBoardByUser().sprint.id}`);


    }

}
