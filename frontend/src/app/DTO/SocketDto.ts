import { PostListItem } from './../kudo/Posts/services/dataModel/PostListItem';
import { CreateHistoryDto } from './CreateHistoryDTO';
import { UserInfo } from './LoginResponseDTO';

export class SocketWheel {

    id: number;
    history: CreateHistoryDto;

}

export class SocketMessage {

    uniqueId: string ;
    msg: SocketWheel ;

}


export class GameInfo {

    currentWinner: number ;
    postList: PostListItem[];

}


export class SocketUsersList {

    userList: UserInfo [] ;


}
