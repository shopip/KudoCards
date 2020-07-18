import { storageConfig } from './storageconfig';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { UserData, UserInfo } from '../DTO/LoginResponseDTO';


@Injectable()
export class LoggedInDataService {




   getSelectedCompanyInfo(auth: AuthService): UserData {

       return auth.getCompany() ;
   }

   getIfSSOLogin(auth: AuthService): boolean {

    return auth.getIfSSOLogin();
}

   getLoggedinuserInfo(auth: AuthService): UserInfo {
    return JSON.parse(auth.getData(storageConfig.userInfo)) as UserInfo ;
}

}
