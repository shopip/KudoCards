export class CreateHistoryDto {

    userId: number;
    userName: string;
    imageUrl: string;
    sprintId: number;
    teamId: number;
    companyId: number;


}

export class HistoryDto {

    userId: number;
    userName: string;
    imageUrl: string;
    sprintId: number;
    teamId: number;
    companyId: number;
    createdAt: string;


}
