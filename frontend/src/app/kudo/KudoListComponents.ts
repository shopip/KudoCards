import { PlayKudoOptionComponent } from './../dialog/playkudo/PlayKudoOptionComponent';
import { UserData } from '../DTO/LoginResponseDTO';
import { AuthService } from '../shared/auth.service';

import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from '../dialog/createposts/CreatePostComponent';
import { LoggedInDataService } from '../shared/LoggedInDataService';



@Component({
    selector: 'app-kudo-list',
    templateUrl: 'kudo.html'
})

export class KudoListComponent {

    company: UserData  ;
    ssoLogin = false;
    public createOpen = false;
    public playOpen = false;


  constructor(public matDialog: MatDialog, private auth: AuthService ,
              private loggedIndData: LoggedInDataService){

    this.company = this.auth.getCompany();
    this.ssoLogin = this.loggedIndData.getIfSSOLogin(this.auth);
    console.log(`company name : ${this.company.name}`);

  }

    public logout() {

        this.auth.logout ();
    }

    public showCreateDialog() {
      if (this.createOpen) {
      return ;
      }
      this.createOpen = true ;
      const cDialog =  this.matDialog.open(CreatePostComponent, {

         width: '80%',

        });

      cDialog.afterClosed().subscribe(() => {this.createOpen = false; });
     }

     public showPlayDialog() {
       if (this.playOpen)
       {
         return ;
       }
       this.playOpen = true ;
       const cDialog  = this.matDialog.open(PlayKudoOptionComponent, {
       maxWidth: '400px',
       width: '80%',

      });

       cDialog.afterClosed().subscribe(() => {this.playOpen = false; });
   }
}
