import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import {
  AuthService
} from '../auth.service';
import {
  UserCredebtials
} from '../UserCredentials';
import {
  Router
} from '@angular/router';


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
  ) {}

  ngOnInit() {
    this.regForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      username: ['', [
        Validators.required,
        Validators.minLength(4)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      cPassword: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });

    this.regForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }


  // Updates validation state on form changes.
  onValueChanged(data ? : any) {
    if (!this.regForm) {
      return;
    }
    const form = this.regForm;
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
    'username': '',
    'password': '',
    'cPassword': '',
    'invalidReg': ''
  };

  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email'
    },
    'username': {
      'required': 'Username is required',
      'minlength': 'Username must be at least 4 characters'
    },
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password must be at least 6 characters.'
    },
    'cPassword': {
      'required': 'Passwor confirmation is required.',
      'minlength': 'Password confirmation must be at least 6 characters.'
    }
  };

  signup() {
    let userCreds: UserCredebtials;
    let regInputs: any = this.regForm.value;

    if (regInputs.password === regInputs.cPassword) {
      userCreds = regInputs;

      this.auth.emailSignUp(userCreds)
        .then(user => {
          this.router.navigate(['chat']);
        })
        .catch(error => {
          this.formErrors.invalidReg = "Something went woring. Try again.";
          console.error(error);
        })
    } else {
      this.formErrors.invalidReg = "Passwords didn't match. Try again.";
    }
  }

}
