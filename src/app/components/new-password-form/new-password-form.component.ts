import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoUserService, NewPasswordUser } from '../../services/cognito-user.service';
import { AuthorizationService } from '../../services/authorization.service';
import { CookieService } from 'ngx-cookie-service';

const INVALID_CREDENTIALS_ERROR_MESSAGES = {
  'Incorrect username or password.': 'Incorrect Old Password',
  'Password does not conform to policy: Password must have uppercase characters': 'Password must have uppercase characters',
  'Password does not conform to policy: Password must have lowercase characters': 'Password must have lowercase characters',
  'Password does not conform to policy: Password must have numeric characters': 'Password must have numeric characters',
  'Password does not conform to policy: Password not long enough': 'Password not long enough',
};

@Component({
  selector: 'app-new-password-form',
  templateUrl: './new-password-form.component.html',
  styleUrls: ['./new-password-form.component.scss']
})

export class NewPasswordFormComponent implements OnInit {
  username: string;
  newPasswordUser: NewPasswordUser;
  errorMessage: string;
  form: FormGroup = new FormGroup({
    existingPassword: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private auth: AuthorizationService,
    private cognitoUserService: CognitoUserService,
    private cookieService: CookieService,
    private router: Router,
  ) { }

  ngOnInit() {
    const currentUser = this.auth.getAuthenticatedUser();
    const token = this.cookieService.get('mlosc');
    this.username = currentUser.username;
    if (currentUser && token) {
      this.router.navigate(['/upload']);
    }
  }

  registerNewPassword() {
    this.errorMessage = null;
    this.newPasswordUser = {
      username: this.username,
      existingPassword: this.form.value.existingPassword,
      password: this.form.value.password
    };

    this.cognitoUserService.newPassword(this.newPasswordUser, this);
  }

  cognitoCallback(error: Error, result: any) {
    if (error != null) { //error
      this.errorMessage = INVALID_CREDENTIALS_ERROR_MESSAGES[error.message] || error.message;
    } else { //success
      this.router.navigate(['/upload']);
    }
  }
}
