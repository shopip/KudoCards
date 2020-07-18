import { storageConfig } from './../shared/storageconfig';
import { apiEndPoints } from './../shared/apiendpoints';
import { environment } from './../../environments/environment';
import { LoginResponseDTO, Company, UserData } from './../DTO/LoginResponseDTO';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  startValidation = false;
  validEmail = true ;
  company: UserData = null;
  loginResponse: LoginResponseDTO;
  errorResponse = {
    error : false ,
    message : ''

  };
  btnOpts: MatProgressButtonOptions = {
    active: false,
    text: 'Login',
    buttonColor: 'primary',
    barColor: 'primary',
    spinnerColor: 'accent',
    spinnerSize: 19,
    raised: true,
    stroked: false,
    fullWidth: true,
    mode: 'indeterminate',
    value: 0,
    customClass: 'text-white',
    disabled: false,

  };
  btnSubmitOpts: MatProgressButtonOptions = {
    active: false,
    text: 'Submit',
    buttonColor: 'primary',
    barColor: 'primary',
    spinnerColor: 'accent',
    spinnerSize: 19,
    raised: false,
    stroked: false,
    fullWidth: true,
    mode: 'indeterminate',
    value: 0,
    customClass: 'text-white',
    disabled: false,

  };

  constructor(private http: HttpClient, private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/posts']);
    }
  }


  closeAlert(): void {
    console.log('error clicked');
    this.clearErrorObject();
  }

  chooseCompany(): void {



    const payload = {
      id: this.company.id,
      name: this.company.name,

    };

    this.btnSubmitOpts.active = true;

    this.auth.setToken(this.loginResponse.access_token);

    this.http.post<LoginResponseDTO>( environment.apiUrl + apiEndPoints.setToken, payload)
    .subscribe({
      next: data => {

         this.auth.setData(storageConfig.company, JSON.stringify(this.company));
         this.auth.setData(storageConfig.userInfo,  JSON.stringify(this.loginResponse.user_info));
         this.auth.setToken(data.access_token);
         this.auth.setCoreToken(this.loginResponse.core_token);
         this.auth.setData(storageConfig.sso, '0');
         this.auth.setSSOLogin(false);
         this.router.navigate(['/posts']);

      },
      error: error => {
        console.log(error.error.message);
        console.log(error.error);
        this.auth.clearItem(storageConfig.storageKey);
        this.errorResponse.error = true ;
        this.errorResponse.message = error.error.message ? error.error.message : 'Error in Selecting Company' ;
        this.btnSubmitOpts.active = false;

      }
  });

  }

  onEmailChange(newValue) {
    const validEmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (validEmailRegEx.test(newValue)) {
        this.validEmail = true;
        console.log('valid email');
    }else {
      this.validEmail = false;
      console.log('invalid email');
    }

  }

  onSubmit(form: NgForm) {
    const values = form.value;

    if (form.valid)
    {
    const payload = {
      email: values.username,
      password: values.password
    };

    this.clearErrorObject();

    this.btnOpts.active = true;
    this.btnOpts.active = true;

    this.http.post<LoginResponseDTO>( environment.apiUrl + apiEndPoints.login, payload)
    .subscribe({
      next: data => {

        this.loginResponse = data ;



        this.btnOpts.active = false;



        if (data.user_data.length === 1)
        {
         this.company = this.loginResponse.user_data[0] as UserData;
         this.chooseCompany();
        }





      },
      error: error => {
        console.log(error.error.message);
        this.errorResponse.error = true ;
        this.errorResponse.message = error.error.message ? error.error.message : 'Invalid Credentials' ;
        this.btnOpts.active = false;

      }
  });


    }
    else
    {
      this.startValidation = true;
    }





  }


  private clearErrorObject() {

    this.errorResponse.error = false;
    this.errorResponse.message = '';
  }
}
