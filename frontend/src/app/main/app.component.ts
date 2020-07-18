import { CreatePostComponent } from './../dialog/createposts/CreatePostComponent';
import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Kudo Cards';

  constructor(public matDialog: MatDialog){}

  public showCreateDialog() {
     this.matDialog.open(CreatePostComponent, {

      width: '80%',

     });
  }

}
