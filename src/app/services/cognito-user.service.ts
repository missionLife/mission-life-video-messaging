import { Injectable } from "@angular/core";
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk";
import { CognitoCallback } from '../services/authorization.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthorizationService } from './authorization.service';

const poolData = {
  UserPoolId: 'us-east-2_laC3yucNE', // Your user pool id here
  ClientId: '55kupjfu7vnn7ogu57p3h7psmd' // Your client id here  
};

const userPool = new CognitoUserPool(poolData);

export class NewPasswordUser {
  username: string;
  existingPassword: string;
  password: string;
}

@Injectable()
export class CognitoUserService {

  authToken: string;

  constructor(
    private auth: AuthorizationService,
    private cookieService: CookieService
  ) {}

  newPassword(newPasswordUser: NewPasswordUser, callback: CognitoCallback): void {
    const that = this;

    let authenticationData = {
        Username: newPasswordUser.username,
        Password: newPasswordUser.existingPassword,
    };
    let authenticationDetails = new AuthenticationDetails(authenticationData);

    let userData = {
        Username: newPasswordUser.username,
        Pool: userPool
    };

    let cognitoUser = new CognitoUser(userData);
    
    cognitoUser.authenticateUser(authenticationDetails, {
      newPasswordRequired: function (userAttributes, requiredAttributes) {
        // User was signed up by an admin and must provide new
        // password and required attributes, if any, to complete
        // authentication.
        // the api doesn't accept this field back
        delete userAttributes.email_verified;

        cognitoUser.completeNewPasswordChallenge(newPasswordUser.password, requiredAttributes, {
          onSuccess: function (result) {
            that.auth.inItAuth();
            that.auth.configObservable.subscribe((value) => {
              if (value) {
                callback.cognitoCallback(null, userAttributes);
              }
            });
          },
          onFailure: function (err) {
            callback.cognitoCallback(err, null);
          }
        });
      },
      onSuccess: function (result) {
        callback.cognitoCallback(null, result);
      },
      onFailure: function (err) {
        callback.cognitoCallback(err, null);
      }
    });
  }
}