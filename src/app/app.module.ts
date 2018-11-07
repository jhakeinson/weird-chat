import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './auth.service';
import { MessagesComponent } from './messages/messages.component';
import { ChatboxGuardService } from './services/chatbox-guard.service';

/* Routers */
const appRoutes: Routes = [
  { 
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [AuthGuardService]
  },
  { 
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'chat',
    component: ChatboxComponent,
    canActivate: [ChatboxGuardService]
  },
  {
    path: 'chat/:chatTitle',
    component: ChatboxComponent,
    canActivate: [ChatboxGuardService]
  },
  { 
    path: '**', 
    redirectTo: "/login"
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChatboxComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [ AuthService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
