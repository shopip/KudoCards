import { History } from './../Entity/history.entity';
import { AgiliboService } from '../helpers/agilibo/agilibo.service';

import { QueryParams } from './../DTO/AgiliboResponseDTO';
import { Injectable, Inject } from '@nestjs/common';
import { Repository, Like, In, Any } from 'typeorm';

import { CreateHistoryDto } from '../DTO/CreateHistoryDTO';


@Injectable()
export class HistoryService {

    constructor(
        @Inject('HISTORY_REPOSITORY')
        private historyRepository: Repository<History>,
        private readonly agiliboService : AgiliboService
      ) {


      }

    public create(createHistoryDTO : CreateHistoryDto) : Promise<CreateHistoryDto> {
        
        return this.historyRepository.save(createHistoryDTO);

    }

    public async  findAllFromDB(id : number , queryParams : QueryParams): Promise<History[]>  {

        const whereClause = {

            companyId: id,
            sprintId: queryParams.sprintId,
            teamId:  (queryParams.teamId) ? queryParams.teamId : '',
            
           
        };

        return this.historyRepository.find(
            {
                where  : whereClause,
                order: {
                    id: "DESC"
                },
                skip : queryParams.skip ?  queryParams.skip : 0 ,
                take : queryParams.take ? queryParams.take : 100 
            }
        );

    }

   
    

 


}
