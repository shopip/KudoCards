import { AgiliboService } from '../helpers/agilibo/agilibo.service';

import { QueryParams } from './../DTO/AgiliboResponseDTO';
import { CreateKudoDto } from './../DTO/CreateKudoDto';
import { Kudo } from './../Entity/kudo.entity';
import { Injectable, Inject } from '@nestjs/common';
import { Repository, Like, In, Any } from 'typeorm';
import { Observable, from } from 'rxjs';


@Injectable()
export class KudoService {

    constructor(
        @Inject('KUDO_REPOSITORY')
        private kudoRepository: Repository<Kudo>,
        private readonly agiliboService : AgiliboService
      ) {


      }

    public async findAllTeams (): Promise<Kudo[]>{

        return this.kudoRepository.createQueryBuilder('kudo')
        .where ('kudo.team != 0')
        .select(['DISTINCT (kudo.team) AS team', 'kudo.teamName AS teamName'])
        .orderBy("kudo.teamName", "ASC")
        .getRawMany();

    }

    
    public async  findAllFromDB(id : number , queryParams : QueryParams): Promise<Kudo[]>  {
       
        

        const whereClause = {

            companyId: id,
            fromEmail: Like(`%${queryParams.fromEmail}%`),
            toEmail: Like(`%${queryParams.toEmail}%`),
            content: Like(`%${queryParams.query}%`),
            kudoId: queryParams.kudoId,
            team:  (queryParams.teams) ? In ([queryParams.teams.split(',')]) : '',
            sprint : queryParams.sprintId
            
           
        };

       

        if (!queryParams.fromEmail) delete whereClause.fromEmail;
        if (!queryParams.toEmail) delete whereClause.toEmail;
        if (!queryParams.query) delete whereClause.content;
        if (!queryParams.kudoId) delete whereClause.kudoId;
        if (!queryParams.sprintId) delete whereClause.sprint;
        if (!queryParams.teams || queryParams.teams.length == 0)  delete whereClause.team;




        console.log(queryParams);
       
        return this.kudoRepository.find(
            {
                where  : whereClause,
                order: {
                    id: "DESC"
                },
                skip : queryParams.skip ?  queryParams.skip : 0 ,
                take : queryParams.take ? queryParams.take : 10 
            }
        );

    }

    public findAllCompanyUserFromAgilibo(id : number , token : string, queryParams : QueryParams) : Promise<CreateKudoDto> {
        
        return this.agiliboService.agiliboUserByCompany(id,token,queryParams.query);

    }

    public findAllSprintsByUserFromAgilibo( token : string, queryParams : QueryParams) : Promise<CreateKudoDto> {
        
        return this.agiliboService.agiliboSprintsByUser(queryParams.teamId,token);

    }

   
    public create(createKudoDto : CreateKudoDto) : Promise<CreateKudoDto> {
        
        return this.kudoRepository.save(createKudoDto);

    }
   

    public findAll(): Observable<Kudo[]>  {
        
        return from(this.kudoRepository.find());

    }


}
