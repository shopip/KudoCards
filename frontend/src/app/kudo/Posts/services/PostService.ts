import { CreateHistoryDto, HistoryDto } from './../../../DTO/CreateHistoryDTO';
import { TeamItems, Sprints, SprintResponseDTO } from './../../../DTO/LoginResponseDTO';
import { QueryParams } from './../../../DTO/QueryParamDTO';
import { CreatePostDto } from './dataModel/CreatePostDto';
import { PostResource } from './PostResource';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { PostListItem } from './dataModel/PostListItem';

@Injectable()
export class PostService {

    private postListsSubject: BehaviorSubject<PostListItem[]> = new BehaviorSubject(null);

    constructor(private postResource: PostResource) { }

    public getPostListSubject(): BehaviorSubject<PostListItem[]> {

        return this.postListsSubject ;

    }

    public getAllPostListItems(queryParam: QueryParams): Observable<PostListItem[]>{
        return this.postResource.findAll(queryParam);
    }

    public getAllPostListTeams(queryParam: QueryParams): Observable<TeamItems[]>{
        return this.postResource.findAllTeams(queryParam);
    }

    public getAllSprints(queryParam: QueryParams): Observable<SprintResponseDTO>{
        return this.postResource.findAllSprints(queryParam);
    }

    public getAllWheelItems(queryParam: QueryParams): Observable<HistoryDto[]>{
        return this.postResource.findAllWheelHistory(queryParam);
    }

    public createPost(createPostDto: CreatePostDto): Observable<CreatePostDto>{
        return this.postResource.create(createPostDto);
    }

    public createWheelHistory(createHistoryDTO: CreateHistoryDto): Observable<CreateHistoryDto>{
        return this.postResource.createWheelHistory(createHistoryDTO);
    }



}
