export interface QueryParams {
    take: number;
    skip: number;
    query: string;
    fromEmail: string;
    toEmail: string;
    teamId: string;
    teams: Array<number>;
    sprintId: number ;

}
