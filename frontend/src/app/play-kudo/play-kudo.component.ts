import { CreateHistoryDto, HistoryDto } from './../DTO/CreateHistoryDTO';
import { PlayKudoDTO } from './../DTO/PlayKudoDTO';
import { AuthService } from 'src/app/shared/auth.service';
import { UserItem } from './../DTO/UserListResponseDTO';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { NgxWheelComponent, TextOrientation, TextAlignment } from 'ngx-wheel';
import { Router } from '@angular/router';
import { QueryParams } from '../DTO/QueryParamDTO';
import { TeamItems, User } from '../DTO/LoginResponseDTO';
import { PostService } from '../kudo/Posts/services/PostService';
import { PostListItem } from '../kudo/Posts/services/dataModel/PostListItem';
import { storageConfig } from '../shared/storageconfig';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { GameInfo, SocketMessage, SocketUsersList, SocketWheel } from '../DTO/SocketDto';
import { SocketBG } from '../shared/socket.service';
import { Subscription } from 'rxjs';





export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  type: DivType ;
}

export interface CurrentScreenType {
  type: Devicetype;
}



export enum DivType {
    wheel,
    user,
    card,
    history,
}

export enum Devicetype {
  Large,
  Medium,
  Small

}


@Component({
  selector: 'app-play-kudo',
  templateUrl: './play-kudo.component.html',
  styleUrls: ['./play-kudo.component.css']
})
export class PlayKudoComponent implements OnInit, OnDestroy {

  @ViewChild(NgxWheelComponent, { static: false }) wheel;
  seed = [...Array(12).keys()];
  idToLandOn: any;
  items: any[];
  textOrientation: TextOrientation = TextOrientation.HORIZONTAL;
  textAlignment: TextAlignment = TextAlignment.OUTER;

  public isWheelSpinning = false ;

  public selectedUser: User ;


  queryParam: QueryParams = {} as QueryParams;
  public allDataLoaded  = false ;
  public filterTeams: TeamItems[];

  public filterReceive = false ;
  public filterSend = false ;

  public playKudoDTO: PlayKudoDTO ;
  public userListChannel = 'userList';
  public gameStatChannel = 'gameState';


  public tiles: Tile[];
  public curScreenType: CurrentScreenType = {} as CurrentScreenType;
  public postListItems: PostListItem[] = [];
  public historyListItems: HistoryDto[] = [];

  public subscriptionList: Subscription [] = [];




  lgTiles: Tile[]  = [
    {text: 'One', cols: 5, rows: 6, color: 'lightblue', type: DivType.wheel},
    {text: 'Two', cols: 1, rows: 16, color: 'lightgreen', type: DivType.user},
    {text: 'Three', cols: 1, rows: 9, color: 'lightpink', type: DivType.history},
    {text: 'Four', cols: 4, rows: 9, color: '#DDBDF1', type:  DivType.card},
  ];

  mdTile: Tile[]  = [
    {text: 'Two', cols: 6, rows: 2, color: 'lightgreen', type: DivType.user},
      {text: 'One', cols: 6, rows: 8, color: 'lightblue', type: DivType.wheel},

      {text: 'Four', cols: 6, rows: 8, color: '#DDBDF1', type: DivType.card},
      {text: 'Three', cols: 6, rows: 8, color: 'lightpink', type: DivType.history},
  ];



  public users: UserItem [] = [];

  constructor(public breakpointObserver: BreakpointObserver, private router: Router, private postService: PostService,
              private authService: AuthService, private socket: SocketBG) {



  }

  ngOnInit(): void {


    this.playKudoDTO = JSON.parse(this.authService.getData(storageConfig.playKudo)) as PlayKudoDTO;



    this.tiles = this.lgTiles ;
    this.curScreenType.type = Devicetype.Large ;

    this.observeForBreakPoints ();


    const colors = ['#e69525', '#197b36'];
    this.items = [];



    for (const [key, item] of this.playKudoDTO.team.users.entries()) {

    const wheelItem =  {
        fillStyle: colors[key % 2],
        text: item.first_name,
        id: item.user_id,
        textFillStyle: 'white',
        textFontSize: '12'
      };

    this.items.push(wheelItem);

     }


    this.sendCurrentSprint();

    this.getHistoryItems ();

    this.subscriptionList.push(this.subscribeForOnlineUsers());

    this.subscriptionList.push(this.subscribeForGameState());

    this.subscriptionList.push(this.getMessage());







  }

  subscribeForOnlineUsers(): Subscription{

    const event = `${this.userListChannel}-${this.playKudoDTO.sprint.id}`;
    return this.socket
    .fromEvent(event)
    .pipe(map((data) => `${data}`)).subscribe((data) => {

      const currentOnlineList = JSON.parse(data) as SocketUsersList;
      console.log(currentOnlineList.userList);
      this.changeOnlineUserData(currentOnlineList);

    });

  }
  changeOnlineUserData(currentOnlineList: SocketUsersList) {

    this.playKudoDTO.team.users.forEach ( user => {

      const tmp = currentOnlineList.userList.find(x => x.email === user.email) ;

      user.online = tmp ? true : false ;

    });


  }


  sendWheelMessage(msg: SocketMessage){


  this.socket.emit('msgToServer', msg);

  }

  sendCurrentSprint(){


    this.socket.emit('setCurrentSprint', this.playKudoDTO.sprint.id);
  }

  getMessage() : Subscription {



    this.socket.connect();

    const room = 'msgToClient-' + this.playKudoDTO.sprint.id;

    return this.socket
        .fromEvent(room)
        .pipe(map((data) => data)).subscribe((data: SocketWheel) => {

          console.log(`wheel rcvd : id :  ${data.id} : ${data.history.sprintId}  : current sprint ${this.playKudoDTO.sprint.id} : `);
          this.doSpinTheWheel(data.id);

        });




   }

   subscribeForGameState(): Subscription {
    this.socket.connect();

    const room = `${this.gameStatChannel}-${this.playKudoDTO.sprint.id}` ;

    return this.socket
        .fromEvent(room)
        .pipe(map((data) => data)).subscribe((data: GameInfo) => {

          if (data) {
            console.log(data);
            console.log(data.currentWinner);
            this.setupInitialGameState(data.currentWinner);
          }

        });


   }

   ngOnDestroy(): void {

    this.subscriptionList.forEach(subscription => subscription.unsubscribe);
    this.socket.disconnect();
   }

  addToHistory(){

    const wheelHistory: CreateHistoryDto = {} as CreateHistoryDto ;
    wheelHistory.userId = this.selectedUser.user_id;
    wheelHistory.userName = this.selectedUser.name;
    wheelHistory.imageUrl = '';
    wheelHistory.sprintId = this.playKudoDTO.sprint.id ;
    wheelHistory.teamId = this.playKudoDTO.team.id ;

    console.log(wheelHistory);

    // this.postService.createWheelHistory(wheelHistory).subscribe(() => {
    //   this.getHistoryItems();
    // });


  }

  getHistoryItems() {
    const hqueryParam = {} as QueryParams;
    hqueryParam.teamId = `${this.playKudoDTO.team.id}` ;
    hqueryParam.sprintId = this.playKudoDTO.sprint.id ;
    this.postService.getAllWheelItems(hqueryParam).subscribe((items) => {

      this.historyListItems = items ;

    });

  }
  observeForBreakPoints() {

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe( (state: BreakpointState) => {


      if (state.breakpoints[Breakpoints.XSmall]) {

           this.tiles = this.mdTile ;
           this.curScreenType.type = Devicetype.Medium ;
      }
      if (state.breakpoints[Breakpoints.Small]) {

           this.tiles = this.mdTile ;
           this.curScreenType.type = Devicetype.Medium ;
      }
      if (state.breakpoints[Breakpoints.Medium]) {

           this.tiles = this.lgTiles ;
           this.curScreenType.type = Devicetype.Large ;
      }
      if (state.breakpoints[Breakpoints.Large]) {

         this.tiles = this.lgTiles;
         this.curScreenType.type = Devicetype.Large ;
      }
      if (state.breakpoints[Breakpoints.XLarge]) {

        this.tiles = this.lgTiles;
        this.curScreenType.type = Devicetype.Large ;

      }
    });
  }

  public change() {


  }

  reset() {
    this.wheel.reset();
  }
  before() {
    this.isWheelSpinning = true ;
  }

  async spin(prize) {

    this.idToLandOn = prize;
    await new Promise(resolve => setTimeout(resolve, 0));
    this.wheel.spin();
  }

  after() {

    this.isWheelSpinning = false ;
    this.getDataFromServer();
    this.getHistoryItems();

  }

  goHome() {

    this.router.navigate(['/kudo']);

  }

  doSpinTheWheel(id: number) {



     this.selectedUser = this.playKudoDTO.team.users[id];
     this.reset ();
     this.spin(this.selectedUser.user_id);



  }

  setupInitialGameState(id: number) {


    console.log('fetching data for game stat sync');
    this.selectedUser = this.playKudoDTO.team.users.find(x => x.user_id == id);
    this.getDataFromServer();



 }

  spinTheWheel() {

    const socketMsg: SocketMessage = {} as SocketMessage ;
    const socketData: SocketWheel = {} as SocketWheel ;
    socketData.id = Math.floor(Math.random() * this.playKudoDTO.team.users.length) ;
    socketMsg.uniqueId = `${this.playKudoDTO.sprint.id}`;
    const wheelHistory: CreateHistoryDto = {} as CreateHistoryDto ;
    const tmpSelectedUser = this.playKudoDTO.team.users[socketData.id];
    wheelHistory.userId = tmpSelectedUser.user_id;
    wheelHistory.userName = tmpSelectedUser.name;
    wheelHistory.imageUrl = '';
    wheelHistory.sprintId = this.playKudoDTO.sprint.id ;
    wheelHistory.teamId = this.playKudoDTO.team.id ;

    socketData.history = wheelHistory ;

    socketMsg.msg = (socketData) ;

    this.sendWheelMessage(socketMsg);
    // this.selectedUser = this.playKudoDTO.team.users[];
    // this.reset ();
   // this.spin(this.selectedUser.user_id);



  }

  async getDataFromServer() {

    this.queryParam = {} as QueryParams;
    this.queryParam.take = 10;
    this.queryParam.skip = 0  ;
    this.queryParam.toEmail = this.selectedUser.email ;
    this.queryParam.sprintId = this.playKudoDTO.sprint.id;
    console.log(this.queryParam);



    this.postService.getAllPostListItems(this.queryParam).subscribe((postListItems) => {

      this.postListItems = postListItems ;

    });



}




}
