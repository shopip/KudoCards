export class AgiliboResponseDTO {

    public userKey: string ;
    public name: string;
    public userEmail: string ;
    public profileImage : string ;
    public token: string ;
    public companies: string ;



}

export interface AgiliboTokenDTO {
    userKey: number;
    name: string;
    userEmail: string;
    token: string;
    companyKey: number;
    profileImage : string ;
    companyName: string;
    companies : string ;
}

export interface AgiliboTokenResponseDTO {
    data: AgiliboTokenResponseDTO;
}


export interface UserData {
    id: number;
    name: string;
    units: Unit[];
}

export interface Unit {
    id: number;
    name: string;
    company_id: number;
    teams: Team[];
}

export interface Team {
    id: number;
    name: string;
    company_id: number;
    unit_id: number;
}

export interface QueryParams {
    take: number;
    skip: number;
    query: string;
    fromEmail: string;
    toEmail: string;
    kudoId: number;
    teamId: string ;
    teams: string;
    sprintId: number;
   
}

export interface TokenDTO {

    token : string 
}

