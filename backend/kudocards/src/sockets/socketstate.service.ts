import { SocketUsersList, GameInfo } from './../DTO/SocketDTO';
import { UserInfo } from './../DTO/UserInfoDTo';
import { Injectable } from "@nestjs/common";

@Injectable()
export class SocketStateService {
  private socketState = new Map<string, UserInfo>();
  private socketGameState = new Map<string, GameInfo>();

  public add(socketId: string, user: UserInfo): boolean {
    delete user.token ;
    this.socketState.set(socketId, user);
 
    return true
  }

  public addGameInfo(sprint: string, game: GameInfo): boolean {
    
    
    this.socketGameState.set(sprint, game);
 
    return true
  }

  public removeGameInfo(sprint: string): boolean {
    
    
    this.socketGameState.delete(sprint);
 
    return true
  }



  public remove(socketId: string): number {
   
    try {

        const sprint = this.socketState.get(socketId).sprint;
        this.socketState.delete(socketId);
        this.checkForLastUSerInSprint(sprint);
        return sprint;
   
    } catch (error) {
       return 0;
        }
 
 
    
  }

  async checkForLastUSerInSprint (sprint : number) {

    const currentUserLength = this.getAllSprintUser(sprint).userList.length;
    if (currentUserLength == 0)
    {

      this.removeGameInfo(`${sprint}`);

    }

  }

  public get(socketId: string): UserInfo {
    
    return this.socketState.get(socketId) || null;

  }

  public getGameInfo(sprint: string): GameInfo {
    
    return this.socketGameState.get(sprint) || null;

  }

  public gameHistoryChanged(sprint: string, winner: string) {
    
    let gameinfo =  this.getGameInfo(sprint);
    if (!gameinfo)
    gameinfo = {} as GameInfo ;
    gameinfo.currentWinner = winner ;
    this.addGameInfo(sprint,gameinfo);

  }

  public getAllUser() : SocketUsersList {
    

    const all : SocketUsersList = {} as SocketUsersList ; 
    all.userList = [];
    this.socketState.forEach(user => all.userList.push(user))

    return all ;


  }

   public getAllSprintUser(sprint: number) : SocketUsersList {
    

    const all : SocketUsersList = {} as SocketUsersList ; 
    all.userList = [];
    this.socketState.forEach(user => {
        if (user.sprint === sprint)
        all.userList.push(user)
    })

    return all ;


  }
 

  
}