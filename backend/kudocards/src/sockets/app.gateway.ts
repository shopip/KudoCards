import { join } from 'path';
import { CreateHistoryDto } from './../DTO/CreateHistoryDTO';
import { HistoryService } from './../kudo/history.service';
import { SocketStateService } from './socketstate.service';
import { AuthService } from './../auth/auth/auth.service';
import { SocketMessage, SocketWheel } from './../DTO/SocketDTO';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WsResponse, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';



@WebSocketGateway({ namespace: '/chat'})
export class AppGateway implements OnGatewayInit,OnGatewayConnection,OnGatewayDisconnect {
 
  public userListChannel = 'userList';
  public gameStatChannel = 'gameState';

  constructor(private auth: AuthService,private socketState: SocketStateService, private history : HistoryService){


  }

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('initialized');
   
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Diconnected : ${client.id}`);
    const sprintId = this.socketState.remove(client.id);
    this.logger.log(`Client Now :  ${JSON.stringify(this.socketState.getAllUser().userList.length)}`);
    this.wss.to(`${sprintId}`).emit(`${this.userListChannel}-${sprintId}`,JSON.stringify(this.socketState.getAllSprintUser(sprintId)));
    

  }


  handleConnection(client: Socket, ...args: any[]) {
   
    const user = this.auth.validateToken(client.handshake.query?.token);
    if (user)
    {
    const sprintId = client.handshake.query?.sprint;
    if (sprintId)
    user.sprint = sprintId ;
    // this.logger.log(`Client Connected : ${user.username} : ${sprintId}`);
    this.socketState.add(client.id,user);
    
    
  
   
    }
    else {
      client.disconnect ();
    }
    
  }

  @SubscribeMessage('getOnlineUsers')
  handleUserListRequest(client: Socket, text: SocketMessage) : void {
    console.log(text);
    
    this.wss.emit(`${this.userListChannel}-${text.uniqueId}`,this.socketState.getAllUser());
    //return { event: 'msgToClient', data:  text};
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(client: Socket, sprintId: number) : void {
    

    client.leave(`${sprintId}`);

   
  }

  @SubscribeMessage('setCurrentSprint')
  setCurrentSprint(client: Socket, sprintId: number) : void {
    const user = this.socketState.get(client.id);
    user.sprint = sprintId ;
    client.join(`${sprintId}`);
    this.socketState.add(client.id,user);


    this.wss.to(`${sprintId}`).emit(`${this.userListChannel}-${sprintId}`,JSON.stringify(this.socketState.getAllSprintUser(sprintId)));
    client.emit (`${this.gameStatChannel}-${sprintId}`,this.socketState.getGameInfo(`${sprintId}`));

   
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: SocketMessage) : void {
    
   
    this.logger.log(`swheel : sprint : ${text.uniqueId}  : ${text.msg} : ${text.msg.id} `);
    text.msg.history.companyId = this.socketState.get(client.id).company.id;
    this.history.create(text.msg.history);
    this.socketState.gameHistoryChanged(text.uniqueId,`${text.msg.history.userId}`);
   // this.logger.log(`current game stat ${this.socketState.getGameInfo(text.uniqueId).currentWinner}`);
    
    
    const room = 'msgToClient-' + text.uniqueId;
   
    this.wss.to(text.uniqueId).emit(room,text.msg);
    //return { event: 'msgToClient', data:  text};
  }
}
