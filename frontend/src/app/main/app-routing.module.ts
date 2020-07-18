import { PlayKudoComponent } from './../play-kudo/play-kudo.component';
import { SsoComponent } from './../sso/sso.component';
import { KudoListComponent } from '../kudo/KudoListComponents';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from '../kudo/Posts/list/PostListComponents';
import { AuthGuard } from '../guards/auth.guard';
import { LoginComponent } from '../login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'kudo',
    pathMatch: 'full'
  },
  {
    path: 'kudo',
    component: KudoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'playkudo',
    component: PlayKudoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'sso',
    component: SsoComponent
  },
  {
    path: '**',
    redirectTo: 'kudo'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
