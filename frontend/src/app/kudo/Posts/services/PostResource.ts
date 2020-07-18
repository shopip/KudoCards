import { environment } from 'src/environments/environment';
import { CreateHistoryDto, HistoryDto } from './../../../DTO/CreateHistoryDTO';
import { TeamItems, Sprints, SprintResponseDTO } from './../../../DTO/LoginResponseDTO';
import { QueryParams } from './../../../DTO/QueryParamDTO';
import { CreatePostDto } from './dataModel/CreatePostDto';
import { ApiConfig } from './ApiConfig';
import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostListItem } from './dataModel/PostListItem';

@Injectable({providedIn: 'root'})
export class PostResource {
    private readonly URL = environment.apiUrl + 'kudo';

    constructor(private httpClient: HttpClient) { }

    public findAll(queryParam: QueryParams): Observable<PostListItem[]> {

        let params = new HttpParams();
        Object.keys(queryParam).map(k => {
           params = params.set (k, queryParam[k]);
        });
        return this.httpClient.get<PostListItem[]>(this.URL, {params});
    }

    public findAllTeams(queryParam: QueryParams): Observable<TeamItems[]> {

        let params = new HttpParams();
        Object.keys(queryParam).map(k => {
           params = params.set (k, queryParam[k]);
        });
        return this.httpClient.get<TeamItems[]>(`${this.URL}/teams`, {params});
    }

    public findAllSprints(queryParam: QueryParams): Observable<SprintResponseDTO> {

        let params = new HttpParams();
        Object.keys(queryParam).map(k => {
           params = params.set (k, queryParam[k]);
        });
        return this.httpClient.get<SprintResponseDTO>(`${this.URL}/sprintlist`, {params});
    }

    public findAllWheelHistory(queryParam: QueryParams): Observable<HistoryDto[]> {

        let params = new HttpParams();
        Object.keys(queryParam).map(k => {
           params = params.set (k, queryParam[k]);
        });
        return this.httpClient.get<HistoryDto[]>(`${this.URL}/kudowheelhistory`, {params});
    }


    public create(createPostDto: CreatePostDto): Observable<CreatePostDto> {
        return this.httpClient.post<CreatePostDto>(this.URL + '/create', createPostDto);
    }

    public createWheelHistory(createHistoryDTO: CreateHistoryDto): Observable<CreateHistoryDto> {
        return this.httpClient.post<CreateHistoryDto>(this.URL + '/createkudohistory', createHistoryDTO);
    }

}
