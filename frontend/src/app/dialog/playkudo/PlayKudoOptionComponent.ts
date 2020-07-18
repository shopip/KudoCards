import { PlayKudoDTO } from './../../DTO/PlayKudoDTO';
import { Router } from '@angular/router';
import { QueryParams } from './../../DTO/QueryParamDTO';
import { PostService } from './../../kudo/Posts/services/PostService';
import { ApiConfig } from './../../kudo/Posts/services/ApiConfig';
import { LoggedInDataService } from './../../shared/LoggedInDataService';
import { UserListResponseDTO, UserItem } from './../../DTO/UserListResponseDTO';
import { environment } from './../../../environments/environment';
import { KudoTypeItems, AutoCompleteUser, Team, Sprints, TeamItems } from './../../DTO/LoginResponseDTO';
import { KudoType } from './../../shared/kudoconfig';
import { AuthService } from './../../shared/auth.service';
import { PostListItem } from './../../kudo/Posts/services/dataModel/PostListItem';

import { CreatePostDto } from './../../kudo/Posts/services/dataModel/CreatePostDto';

import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, Validators, FormGroupDirective, FormGroup, FormBuilder } from '@angular/forms';
import {finalize, debounceTime, tap, switchMap, map} from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
import { MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { forEach } from 'lodash';
import { storageConfig } from 'src/app/shared/storageconfig';





@Component({
    selector: 'app-create-play-kudo',
    templateUrl: 'PlayKudoOption.html'
})


export class PlayKudoOptionComponent implements OnInit {

    public isLoading = false ;


    public teams: Team[];
    public sprintsList: Sprints[];
    public myForm: FormGroup;

    constructor(private dialogRef: MatDialogRef <PlayKudoOptionComponent>, private postService: PostService ,
                private loggedUser: LoggedInDataService, private authService: AuthService , private snackBar: MatSnackBar,
                private http: HttpClient, private fb: FormBuilder, private router: Router) { }
    ngOnInit(): void {

        const userData = this.loggedUser.getSelectedCompanyInfo(this.authService);
        this.teams = [];

        userData.units.forEach((unit) => {

          unit.teams.forEach((team) => {
            this.teams.push(team); });


        }) ;

        this.setupUserDataLoad();

    }

    getTeamWiseSprintData(id) {


        const queryParams = {} as QueryParams ;

        queryParams.teamId = id ;
        console.log(queryParams);
        this.isLoading = true ;


        this.postService.getAllSprints(queryParams).subscribe( (sprintItems) => {

            this.sprintsList = sprintItems.data ;
            this.isLoading = false ;

          }, (error) => {

            this.isLoading = false;
          } );




      }

      setupUserDataLoad() {

        this.myForm = this.fb.group({


            team: ['', Validators.required],
            teamId: '',
            teamName: '',
            sprintItem: ['', Validators.required],
            sprint: '',
            sprintName: '',

          });


        this.myForm.valueChanges.pipe(
            map((value) => {

                value.title = value.kudoType ? value.kudoType.title : '';
                value.teamName = value.team ? value.team.name : '';
                value.teamId = value.team ? value.team.id : '';
                value.sprint = value.sprintItem ? value.sprintItem.id : 0 ;
                value.sprintName = value.sprintItem ? value.sprintItem.name : '';

            })
        ).subscribe( value => console.log(value));


    }

    public teamChanged() {

      this.getTeamWiseSprintData(this.myForm.get('team').value.id);

    }

    onSubmit() {

        console.log (this.myForm.value);
        
        if (this.myForm.valid)
        {
            this.dialogRef.close();
            let kudoDTO : PlayKudoDTO = {} as PlayKudoDTO ;
            kudoDTO.team = this.myForm.value.team ;
            kudoDTO.sprint = this.myForm.value.sprintItem;
            this.authService.setData(storageConfig.playKudo,JSON.stringify(kudoDTO));

            this.router.navigate(['/playkudo']);

        }
        else
        {
            console.log ('invalid');

        }


    }


}
