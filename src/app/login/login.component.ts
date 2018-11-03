import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) { 
    console.log('from LoginComponent', auth.isAuthenticated);
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [
          Validators.required,
          Validators.email
        ]         
      ],
      password: ['', [
          Validators.required
        ]
      ]
    });

    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

 formErrors = {
    'email': '',
    'password': '',
    'invalidCredentials': ''
  };

  validationMessages = {
    'email': {
      'required':      'Email is required.',
      'email':         'Email must be a valid email'
    },
    'password': {
      'required':      'Password is required.',
    }
  };

  logout() {
    this.auth.logOut();
  }

  login() {
    let creds = this.loginForm.value;
    this.auth.emailLogin(creds.email, creds.password)
      .then(user => {
        console.log('component level then', user);
        this.router.navigate(['register']);
      })
      .catch(error => {
        console.log('component level error', error);
      });
    // console.log('DEBUG', this.loginForm.get('email').errors);
  }
}
