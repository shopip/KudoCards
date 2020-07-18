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





@Component({
    selector: 'app-create-post-dialog',
    templateUrl: 'createPostDialog.html'
})


export class CreatePostComponent implements OnInit {

    public isLoading = false ;
    public newPostModel: CreatePostDto = {} as CreatePostDto;
    public kudoType: [];
    validEmail = true ;
    public companyName = '';
    public teams: Team[];
    public sprintsList: Sprints[];
    public myForm: FormGroup;

    public searchUserControl = new FormControl('');
    public filteredUsers: any;
    public isALoading = false;
    public errorMsg: string;
    public userSelected: UserItem ;


    constructor(private dialogRef: MatDialogRef <CreatePostComponent>, private postService: PostService ,
                private loggedUser: LoggedInDataService, private authService: AuthService , private snackBar: MatSnackBar,
                private http: HttpClient, private fb: FormBuilder) { }

    ngOnInit() {

        this.newPostModel = new CreatePostDto();
        this.kudoType = (KudoType.kudos as []) ;
        this.companyName = this.authService.getCompany().name ;
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

      this.postService.getAllSprints(queryParams).subscribe( (sprintItems) => {

          this.sprintsList = sprintItems.data ;

        });




    }

    setupUserDataLoad() {

        this.myForm = this.fb.group({
            toName: ['', Validators.required],
            search: this.searchUserControl,
            toEmail: new FormControl('', [Validators.email, Validators.required]),
            kudoType: ['', Validators.required],
            content: ['', Validators.required],
            title: '',
            team: '',
            teamId: 0,
            teamName: '',
            sprintItem: '',
            sprint: 0,
            sprintName: '',
            toImage: new FormControl('')

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

        // this.searchMoviesCtrl.valueChanges.subscribe(x => {
        //     console.log('title value changed');
        //     console.log(x);
        //  });

        this.searchUserControl.valueChanges
      .pipe(
        debounceTime(500),
        tap((value) => {
          this.errorMsg = '';
          this.filteredUsers = [];
          this.isALoading = true;
          console.log (value);
        }),
        switchMap(value => this.http.get<UserListResponseDTO>(this.getUserListUrl(value))
          .pipe(
            finalize(() => {
              this.isALoading = false;
            }),
          )
        )
      )
      .subscribe(data => {
        if (data === undefined) {

          this.filteredUsers = [];
        } else {
          this.errorMsg = '';
          this.filteredUsers = data.data;
        }

      });

    }

    public teamChanged() {

      this.getTeamWiseSprintData(this.myForm.get('team').value.id);

    }

    getUserListUrl(query): string {

        return environment.apiUrl + ApiConfig.userList + '?query=' + query;
    }

    searchOptionSelected(value) {

        this.userSelected = value ;
        this.myForm.get('toName').setValue(this.userSelected.name);
        this.myForm.get('toEmail').setValue(this.userSelected.email);

    }



    removeUser() {
        this.userSelected = null ;
        this.myForm.get('toName').setValue('');
        this.myForm.get('toEmail').setValue('');
        this.searchUserControl.setValue(null);
    }

    displayFn(value){


        return value ? value : '';

      }

  onEmailChange(newValue) {
    const validEmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (validEmailRegEx.test(newValue)) {
        this.validEmail = true;
        console.log('valid email');
    }else {
      this.validEmail = false;
      console.log('invalid email');
    }

  }



    openSnackBar(message: string) {

        this.snackBar.open(message, '', {
            duration: 3000,
            horizontalPosition: 'end' ,
            verticalPosition: 'bottom',
          });

    }

    onSubmit() {

           console.log(this.myForm.value);
           if (this.myForm.valid)
           {
               if (this.userSelected) {
                 this.myForm.get('toImage').setValue(this.userSelected.profile_image);
               }
               this.isLoading = true ;
               console.log(this.myForm.value);
               this.postService.createPost(this.myForm.value)
               .pipe(finalize (() => this.isLoading = false))
               .subscribe((newPost: PostListItem) => {

                if (newPost)
                {
                    const list = this.postService.getPostListSubject().getValue();
                    list.unshift(newPost);
                    this.postService.getPostListSubject().next(_.cloneDeep(list));
                    this.dialogRef.close();
                    this.openSnackBar('KUDO CARD POSTED');
                }

               });


           }

    }
}
