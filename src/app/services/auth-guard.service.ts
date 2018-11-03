import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  canActivate(): boolean {
    if(this.auth.isAuthenticated) {
      this.router.navigate(['chat']);
      return false;
    }

    return true;
  }
}
