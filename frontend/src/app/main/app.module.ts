import { PlayKudoComponent } from './../play-kudo/play-kudo.component';
import { SsoComponent } from './../sso/sso.component';
import { DeferLoadDirective } from './defer-load.directive';
import { LoggedInDataService } from './../shared/LoggedInDataService';
import { KudoModule } from './../kudo/KudoModule';
import { AuthInterceptor } from './../httpinterceptor/auth-interceptor';
import { LoginComponent } from './../login/login.component';
import { AuthGuard } from './../guards/auth.guard';
import { AuthService } from './../shared/auth.service';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CreatePostComponent } from '../dialog/createposts/CreatePostComponent';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonImportsModule } from '../commonimports/common-imports/common-imports.module';
import { PlayKudoOptionComponent } from '../dialog/playkudo/PlayKudoOptionComponent';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketBG } from '../shared/socket.service';


const config: SocketIoConfig = { url: 'http://localhost:3001/chat', options: { token : 'abc'} };


@NgModule({
  declarations: [
    AppComponent,
    CreatePostComponent,
    PlayKudoOptionComponent,
    LoginComponent,
    DeferLoadDirective,
    SsoComponent,
    PlayKudoComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    KudoModule,
    HttpClientModule,
    CommonImportsModule,
    SocketIoModule.forRoot(config)

  ],
  exports: [DeferLoadDirective],
  entryComponents: [
    CreatePostComponent,
    PlayKudoOptionComponent
  ],
  providers: [OverlayModule, AuthService, AuthGuard, LoggedInDataService,SocketBG,
   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
