export class LoginResponseDTO {

    // // tslint:disable-next-line: variable-name
    // access_token: string ;
    // // tslint:disable-next-line: variable-name
    // user_data: string;
    // // tslint:disable-next-line: variable-name
    // expires_in: number ;

    // // tslint:disable-next-line: variable-name
    // user_info: string;

        // tslint:disable-next-line: variable-name
        expires_in: number;
        // tslint:disable-next-line: variable-name
        access_token: string;

        // tslint:disable-next-line: variable-name
        core_token: string;
        // tslint:disable-next-line: variable-name
        user_info: UserInfo;
        // tslint:disable-next-line: variable-name
        user_data: UserData[];
        status: number;


}



export interface UserInfo {
        email: string;
        sub: number;
        username: string;
    }

export interface Pivot {
        team_id: number;
        model_id: number;
        model_type: string;
    }

export interface User {
        name: string;
        first_name: string;
        last_name: string;
        email: string;
        phone?: any;
        alias?: any;
        date_of_birth?: Date;
        job_title?: any;
        country?: any;
        skype?: any;
        online?: boolean;
        team_id: number;
        user_id: number;
        scrum_role_id: string;
        scrum_developer_role_id?: any;
        model_type: string;
        status: string;
        pivot: Pivot;
    }

export interface Company {
        id: number;
        name: string;
        email: string;
        phone?: any;
        description?: any;
        address?: any;
        active: boolean;
        created_by: string;
        created_model: string;
        updated_by: string;
        updated_model: string;
        deleted_by?: any;
        deleted_model?: any;
        created_at: Date;
        updated_at: Date;
        deleted_at?: any;
    }

export interface TeamUnit {
        id: number;
        company_id: number;
        name: string;
        description?: any;
        active: boolean;
        created_by: string;
        created_model: string;
        updated_by: string;
        updated_model: string;
        deleted_by?: any;
        deleted_model?: any;
        created_at: Date;
        updated_at: Date;
        deleted_at?: any;
    }

export interface Team {
        id: number;
        name: string;
        company_id: number;
        unit_id: number;
        users: User[];
        company: Company;
        unit: TeamUnit;
    }

export interface Sprints {
        id: number;
        name: string;

    }
export interface SprintResponseDTO {
    data: Sprints[];
}


export interface Unit {
        id: number;
        name: string;
        company_id: number;
        teams: Team[];
    }

export interface UserData {
        id: number;
        name: string;
        units: Unit[];
    }

export interface KudoTypeItems {
        id: number;
        name: string;
        color: string;
        icon: string;
    }

export interface TeamItems {

        id: number ;
        teamName: string ;

}

export interface AutoCompleteUser {
        email: string;
        sub: number;
        username: string;
    }





