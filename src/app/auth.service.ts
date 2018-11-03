import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { auth } from 'firebase';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState: any = null;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router
  ) { 
    afAuth.auth.onAuthStateChanged((user) => {
      this.authState = user;
    });
  }

  get isAuthenticated(): boolean {
    return this.authState !== null;
  }

  get currentUserId(): string {
    return this.isAuthenticated ? this.authState.uid : '';
  }

  async emailSignUp(email: string, password: string) {
    try {
      const user = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      this.authState = user;
      this.updateUserData();
    } catch (error) {
      return console.log(error);
    }
  }

  async emailLogin(email: string, password: string) {
    try {
      const auth = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      this.authState = auth.user;
      console.log('DEBUG1: ', this.authState !== null);
      console.log('DEBUG2: ', this.isAuthenticated);
      this.updateUserData();

      return Promise.resolve(auth);
    } catch (error) {
      console.log('service level error: ', error);
      return Promise.reject(error);
    }
  }

  logOut() {
    return this.afAuth.auth.signOut()
      .then((user) => {
        this.router.navigate(['login']);
      })
      .catch(error => console.log(error));
  }

  /* HELPERS */
  private updateUserData(): void {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features
    let userId: string = this.currentUserId;

    let path = `users/${userId}`; // Endpoint on firebase
    let data = {
      _id: userId,
      email: this.authState.email,
      username: this.authState.displayName
    }

    this.db.object(path).update(data)
      .catch(error => console.log(error));

  }
}
