import { AgiliboResponseDTO } from '../../DTO/AgiliboResponseDTO';
import { AgiliboTokenResponseDTO, AgiliboTokenDTO } from './../../DTO/AgiliboResponseDTO';
import { apiconfig } from './../../config/apiconfig';
import { Injectable, HttpService } from '@nestjs/common';
import { map, tap } from 'rxjs/operators';


@Injectable()
export class AgiliboService {


    constructor(private http  : HttpService) {

    }

    agiliboLogin(email : string, password : string) : Promise<AgiliboResponseDTO> {
        const data = {
            username : email,
            password : password,
        }
        return this.http.post(`${apiconfig.coreUrl}${apiconfig.login}`,data)
            .pipe(
                map(response => response.data.data)
            ).toPromise()
            .catch(() => {
                
               return null;
            });     
    }

    agiliboLoginByToken(token : string) : Promise<AgiliboTokenDTO> {
        const data = {
            token : token
        }
        return this.http.post(`${apiconfig.coreUrl}${apiconfig.tokenLogin}`,data)
            .pipe(
                map(response => response.data.data)
            ).toPromise()
            .catch(() => {
                
               return null;
            });     
    }

    agiliboUserByCompany(company:number,token:string, query : string) :  Promise<any>  {

        if (!query) query = '';
        const url = `${apiconfig.coreUrl}${apiconfig.userList}?company_id=${company}&q=1&per_page=5&order_by=id&order_direction=desc&page=1&q=${query}`;
        return this.http.get(url,{headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }})
        .pipe(map(response => response.data)).toPromise()
        .catch((error)=> {
            console.log(error);
            return null ;
        });

       
    }

    agiliboSprintsByUser(teamid : string,token:string) :  Promise<any>  {

        if (!teamid) teamid = '';
        const url = `${apiconfig.coreUrl}${apiconfig.sprintList}${teamid}?q=sprint&per_page=100&order_by=id&order_direction=desc`;
        console.log(url);
        return this.http.get(url,{headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }})
        .pipe(map(response => response.data), tap((response)=> {console.log(response.data)})).toPromise()
        .catch((error)=> {
            console.log(error);
            return null ;
        });

       
    }


}
