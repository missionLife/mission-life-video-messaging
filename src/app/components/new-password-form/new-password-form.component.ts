import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoUserService, NewPasswordUser } from '../../services/cognito-user.service';
import { AuthorizationService } from '../../services/authorization.service';
import { CookieService } from 'ngx-cookie-service';

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
    console.log('currentUser: ', currentUser);
    console.log('token: ', token);
    this.username = currentUser.username;
    console.log('the current username: ', this.username);
    if (currentUser && token) {
      this.router.navigate(['/upload']);
    }
  }

  registerNewPassword() {
    console.log(this.newPasswordUser);
    this.errorMessage = null;
    this.newPasswordUser = {
      username: this.username,
      existingPassword: this.form.value.existingPassword,
      password: this.form.value.password
    };

    console.log('the new user object: ', this.newPasswordUser);
    this.cognitoUserService.newPassword(this.newPasswordUser, this);
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
      this.errorMessage = message;
      console.log("result cognitoCallback New Password Form: " + JSON.stringify(this.errorMessage));
    } else { //success
      console.log(`success cognitoCallback New Password Form Result: ${result}`);
      this.router.navigate(['/upload']);
    }
  }
}
