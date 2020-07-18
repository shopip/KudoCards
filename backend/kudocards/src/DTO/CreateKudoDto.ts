export class CreateKudoDto {

    public companyId: number ;
    public title: string;
    public kudoType: string;
    public kudoId: number;
    public content: string ;
    public fromEmail: string;
    public fromName: string;
    public fromImage: string;
    public toImage: string;
    public toName: string;
    public toEmail: string;
    public team: number ;
    public teamId: number ;
    public teamName: string;
    public sprint: number ;
    public sprintName: string;



}

export class KudoTypeDTO {

    public id: number ;
    public title: string;
    public color: string;
    public icon: string ;



}