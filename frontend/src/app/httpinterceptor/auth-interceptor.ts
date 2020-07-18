import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = req.url.startsWith(environment.apiUrl) ? this.auth.getToken() :
    req.url.startsWith(environment.coreApiUrl) ? this.auth.getCoreToken() : '';

    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // send cloned request with header to the next handler.
   // return next.handle(authReq);

    return next.handle(authReq)
   .pipe(catchError((err: any) => {

        if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              if (this.auth.isLoggedIn())
                 {
                   this.auth.logout();
                 }

            }

            return throwError(err);
        }

        return new Observable<HttpEvent<any>>();
    }));





  }
}
