import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserCredebtials } from '../UserCredentials';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  regForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.regForm = this.fb.group({
      email: ['', [
          Validators.required,
          Validators.email
        ]         
      ],
      username: ['', [
          Validators.required,
          Validators.minLength(3)
        ]         
      ],
      password: ['', [
          Validators.required
        ]
      ],
      cPassword: ['', [
          Validators.required
        ]
      ]
    })
  }

  signup() {
    let userCreds: UserCredebtials;
    let regInputs: any = this.regForm.value;

    if(regInputs.password === regInputs.cPassword) {
      userCreds = regInputs;

      this.auth.emailSignUp(userCreds)
        .then(user => {
          this.router.navigate(['chat']);
        })
        .catch(error => {
          console.error(error);
        })
    } else {
      alert("Passwords didn't match.");
    }
  }

}
