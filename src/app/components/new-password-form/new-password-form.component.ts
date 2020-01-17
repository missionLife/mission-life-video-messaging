import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoUserService } from '../../services/cognito-user.service';
import { NewPasswordUser } from '../../models/new-password-user';
import { AuthorizationService } from '../../services/authorization.service';
import { CookieService } from 'ngx-cookie-service';
import { AWSError } from '../../models/aws-error';

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
      this.errorMessage = new AWSError(error.message).message || error.message;
    } else { //success
      this.router.navigate(['/upload']);
    }
  }
}
