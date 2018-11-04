import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { UserCredebtials } from './UserCredentials';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCreds: UserCredebtials;
  
  authState: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router
  ) { 
    let self = this;
  //  this.authState = 'Test 1';
    afAuth.auth.onAuthStateChanged((user) => {
      console.log('inside onAuthStateChanged', this.authState);
      this.authState = user;
      console.log('inside onAuthStateChanged 2', this.authState);
    });
  }

  get isAuthenticated(): boolean {
    return <boolean> this.authState;
  }

  get currentUserId(): string {
    return this.isAuthenticated ? this.authState.uid : '';
  }

  async emailSignUp(userCreds: UserCredebtials) {
    try {
      const auth = await this.afAuth.auth.createUserWithEmailAndPassword(userCreds.email, userCreds.password);
      this.userCreds = userCreds;
      this.authState = auth.user;
      this.updateUserData();

      return Promise.resolve(auth.user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async emailLogin(email: string, password: string) {
    try {
      const auth = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      this.authState = auth.user;

      return Promise.resolve(auth);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  logOut() {
    return this.afAuth.auth.signOut()
      .then((user) => {
        this.router.navigate(['login']);

        return Promise.resolve(user);
      })
      .catch(error => {
        console.log('Log out opeeration failed: ${error}.')
      
        Promise.reject(error);
      });
  }

  /* HELPERS */
  private updateUserData(): void {
    // Writes user name and email to realtime db
    let userId: string = this.currentUserId;

    let path = `users/${userId}`; // Endpoint on firebase
    let data = {
      _id: userId,
      email: this.userCreds.email,
      username: this.userCreds.username
    }

    this.db.object(path).update(data)
      .catch(error => console.log(error));

  }
}
