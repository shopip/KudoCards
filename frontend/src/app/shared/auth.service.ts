import { PlayKudoDTO } from './../DTO/PlayKudoDTO';
import { storageConfig } from './storageconfig';
import { map } from 'rxjs/operators';
import { UserData } from './../DTO/LoginResponseDTO';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Object } from 'lodash';

@Injectable()
export class AuthService {

  public ssoLogin = false ;

  constructor(private router: Router) { }

  setToken(token: string) {
    localStorage.setItem(storageConfig.storageKey, token);
  }

  setCoreToken(token: string) {
    localStorage.setItem(storageConfig.coreStorageKey, token);
  }

  setData(key: string, token: string) {
    localStorage.setItem(key, token);
  }

  getIfSSOLogin() {

    return this.ssoLogin ;

  }

  setSSOLogin(sso: boolean) {

    this.ssoLogin = sso ;
  }


  getData(key: string) {
    return localStorage.getItem(key);
  }

  getToken() {

    return localStorage.getItem(storageConfig.storageKey);
  }
  getCoreToken() {

    return localStorage.getItem(storageConfig.coreStorageKey);
  }

  isLoggedIn() {

    return this.getToken() !== null;
  }

  clearItem(key: string) {
    localStorage.removeItem(key);
  }

  clearAll() {
    console.log('clearing all');
    localStorage.clear();
  }

  logout() {
    console.log('logging out');
    localStorage.removeItem(storageConfig.storageKey);
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getCompany(): UserData {

    const storedData = this.getData(storageConfig.company);
    const json = JSON.parse(storedData) as UserData;
    return json ;

  }

  getCurrentBoardByUser(): PlayKudoDTO{

    return JSON.parse(this.getData(storageConfig.playKudo)) as PlayKudoDTO || null;


  }

}
