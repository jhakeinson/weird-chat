import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private auth: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable < boolean > | boolean {

    return this.auth.getAuthenticated.pipe(
      map(user => {
        if ( user && (state.url !== '/chat') ) {
          this.auth.changeAuthState(user);
          this.router.navigate(['chat']);
          return false;
        }

        if( !user && (state.url === '/chat') ) {
          this.router.navigate(['login']);
          return false;
        }

        return true;
      }));
  }
}
