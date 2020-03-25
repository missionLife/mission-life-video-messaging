import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoUserService } from '../../services/cognito-user.service';
import { NewPasswordUser } from '../../models/new-password-user';
import { AuthorizationService } from '../../services/authorization.service';
import { CookieService } from 'ngx-cookie-service';
import { AWSError } from '../../models/aws-error';
import { MustMatch } from '../../validators/must-match';

@Component({
  selector: 'app-new-password-form',
  templateUrl: './new-password-form.component.html',
  styleUrls: ['./new-password-form.component.scss']
})

export class NewPasswordFormComponent implements OnInit {
  username: string;
  newPasswordUser: NewPasswordUser;
  errorMessage: string;
  form: FormGroup;

  constructor(
    private auth: AuthorizationService,
    private cognitoUserService: CognitoUserService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      newPassword: new FormControl(''),
      confirmPassword: new FormControl('')
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
    const currentUser = this.auth.getAuthenticatedUser();
    const token = this.cookieService.get('mlosc');
    this.username = currentUser.username;
    if (currentUser && token) {
      this.router.navigate(['/upload']);
    }
  }

  registerNewPassword() {
    if (this.form.invalid) {
      if (this.form.controls.confirmPassword.errors.mustMatch) {
        this.errorMessage = 'Passwords must match';
      }
      return;
    }

    const currentPassword = window.history.state.data.currentUserPassword;
    this.errorMessage = null;

    this.newPasswordUser = {
      username: this.username,
      existingPassword: currentPassword,
      password: this.form.value.newPassword
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
