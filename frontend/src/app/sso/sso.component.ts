import { catchError } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { environment } from 'src/environments/environment';
import { LoginResponseDTO } from '../DTO/LoginResponseDTO';
import { apiEndPoints } from '../shared/apiendpoints';
import { storageConfig } from '../shared/storageconfig';

@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: []
})
export class SsoComponent implements OnInit {

   ssoToken = '' ;
   loginResponse: LoginResponseDTO;



  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private auth: AuthService,private router: Router) {

  }

  ngOnInit(): void {



    this.activatedRoute.queryParams.subscribe(params => {

      this.ssoToken = params.token;
      if (!this.ssoToken)
      {
        this.router.navigate(['/login']);
      }
      this.doSSoLogin();

    });

  }

  doSSoLogin() {

    const payload = {

      token : this.ssoToken

    };

    this.http.post<LoginResponseDTO>( environment.apiUrl + apiEndPoints.validateToken, payload)
    .subscribe({
      next: data => {

        this.auth.clearAll();

        this.loginResponse = data ;


        this.auth.setData(storageConfig.sso, '1');
        this.auth.setSSOLogin(true);

        this.auth.setData(storageConfig.company, JSON.stringify(this.loginResponse.user_data));
        this.auth.setData(storageConfig.userInfo,  JSON.stringify(this.loginResponse.user_info));
        this.auth.setToken(data.access_token);
        this.auth.setCoreToken(this.loginResponse.core_token);
        this.router.navigate(['/posts']);


      },
      error: error => {

        this.router.navigate(['/login']);
      }

    });


  }

}
