import { Kudo } from '../Entity/kudo.entity';
import { CreateHistoryDto } from './CreateHistoryDTO';
import { UserInfo } from './UserInfoDTo';
export class SocketWheel {

    id: number;
    history: CreateHistoryDto;

}



export class SocketUsersList {

    userList: UserInfo [] ;
   

}

export class GameInfo {

    currentWinner : string ;
    postList : Kudo[];
   

}

export class SocketMessage {

    uniqueId: string ;
    msg: SocketWheel ;

}