import { forEach } from 'lodash';
import { TeamItems, Team } from './../../../DTO/LoginResponseDTO';
import { PostListItem } from './../services/dataModel/PostListItem';
import { QueryParams } from './../../../DTO/QueryParamDTO';
import { LoggedInDataService } from './../../../shared/LoggedInDataService';

import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subject, pipe, of, from } from 'rxjs';

import { PostService } from '../services/PostService';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/auth.service';
import { debounceTime, distinctUntilChanged, distinct, tap, mergeMap, toArray, map, pluck } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FormControl } from '@angular/forms';




@Component({
    selector: 'app-post-list',
    templateUrl: 'postList.html',
})

export class PostListComponent implements OnInit, OnDestroy {

    public displayedColumns: string [] = ['id', 'title', 'subTitle'];
    public model: string;
    public teamFilterControl = new FormControl();
    public selectedTeam: TeamItems;
    public modelChanged: Subject<string> = new Subject<string>();
    colorProp = '#e69525';
    queryParam: QueryParams = {} as QueryParams;
    public allDataLoaded  = false ;
    public filterTeams: TeamItems[];

    public filterReceive = false ;
    public filterSend = false ;
    public searchQuery = '';


    constructor(private postService: PostService, private spinner: NgxSpinnerService, private loggedUser: LoggedInDataService,
                private auth: AuthService) {
                    this.modelChanged.pipe(
                        debounceTime(300),
                        distinctUntilChanged())
                        .subscribe((model) => {
                            this.model = model;
                            this.changeDataOnFilter();
                        });

                }

    ngOnInit() {
        this.filterTeams = [] as TeamItems[];
        this.getDataFromServer();
      //  this.setFilterCompanyData();
        this.teamFilterControl.valueChanges.pipe(tap (()=> {

            console.log('changing filter');
            this.changeDataOnFilter ();
        })).subscribe();


    }

    setFilterCompanyData() {

        this.postService.getPostListSubject().subscribe((value) => {
            this.filterTeams = [] as TeamItems[];
            if (value != null) {
         from (value).pipe(map (
            (val) => {

                const tempItems = {} as TeamItems;
                tempItems.teamName = val.teamName ;
                tempItems.id = val.team ;

                return tempItems ;
            }

             ), distinct(

            item => item.id


                 )).subscribe(val => {
                    if (val.teamName.length > 0) {
                    this.filterTeams.push(val);
                    }
                }); }

        });

    }

    ngOnDestroy() {

        this.modelChanged.unsubscribe();
      }

    searchChanged(text: string) {
        this.modelChanged.next(text);
    }

    async getDataFromServer() {
        this.queryParam = {} as QueryParams;
        this.queryParam.take = 10;
        this.queryParam.skip = 0  ;

        if (this.filterSend) { this.queryParam.fromEmail = this.loggedUser.getLoggedinuserInfo(this.auth).email ; }
        if (this.filterReceive) { this.queryParam.toEmail = this.loggedUser.getLoggedinuserInfo(this.auth).email ; }
        if (this.model && this.model.length > 0) {this.queryParam.query = this.model ; }
        // if (this.selectedTeam && this.selectedTeam.id > 0) {this.queryParam.teamId = this.selectedTeam.id ; }
        if (this.teamFilterControl.value) {
            console.log('team filtered');
            this.queryParam.teams = [] ;
            this.teamFilterControl.value.forEach(filteredTeamId  => {
                this.queryParam.teams.push(filteredTeamId.team);
            });



        }

        console.log(this.queryParam);



        this.postService.getAllPostListItems(this.queryParam).subscribe((postListItems) => {
            this.postService.getPostListSubject().next(postListItems);

        });

        if (this.filterTeams.length === 0)
        {
            this.postService.getAllPostListTeams(this.queryParam).subscribe((teamItems) => {
                this.filterTeams = teamItems ;

            });
        }

    }



    filterSendChanged() {

        this.filterSend = !this.filterSend ;
        this.changeDataOnFilter();
    }

    filterReceiveChanged() {

        this.filterReceive = ! this.filterReceive ;
        this.changeDataOnFilter();
    }

    changeDataOnFilter() {

        this.allDataLoaded = false ;
        this.getDataFromServer();

    }


     public updatePostList() {
        this.queryParam.take = 10;
        this.queryParam.skip = this.postService.getPostListSubject().getValue() ?
        this.postService.getPostListSubject().getValue().length : 0  ;
        this.postService.getAllPostListItems(this.queryParam).subscribe((postListItems) => {

            if (postListItems.length < 10)
            {
                this.allDataLoaded = true ;
            }
            this.postService.getPostListSubject().getValue().push(...postListItems);

            this.spinner.hide();

        });

    }

    public getPostList(): Observable<PostListItem[]> {


            return this.postService.getPostListSubject().asObservable();

    }

    public onScroll() {

        if (!this.allDataLoaded)
        {
        this.updatePostList();
        this.spinner.show();
        }
    }
}
