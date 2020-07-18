export class UserListResponseDTO {
        data: UserItem[];
}

export interface UserItem {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    alias: string;
    email: string;
    phone: string;
    address?: any;
    profile_image: string;
    date_of_birth: string;
    job_title: string;
    country: string;
    skype?: any;
    active: number;
}