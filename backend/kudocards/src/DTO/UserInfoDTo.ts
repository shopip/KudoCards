export interface UserInfo {
    email: string;
    sub: number;
    username: string;
    company :  CompanyInfo;
    image : string;
    sprint : number ;
    token : string ;
    
}

export interface CompanyInfo {
    id: number;
    name: string;
    
}