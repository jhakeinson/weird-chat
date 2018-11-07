import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, ObjectUnsubscribedError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatboxGuardService {

  constructor(
    private auth: AuthService,
    private router: Router,
    private ar: ActivatedRoute
  ) { }

  canActivate(): Observable < boolean > | boolean {

    return this.auth.getAuthenticated.pipe(
      map(user => {
        if ( user )  {
          this.auth.changeAuthState(user);

          return true;
        }

        this.router.navigate(['login']);

        return false;
      }));
  }
}
