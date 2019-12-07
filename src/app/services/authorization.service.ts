import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

const poolData = {
  UserPoolId: 'us-east-2_laC3yucNE', // Your user pool id here
  ClientId: '55kupjfu7vnn7ogu57p3h7psmd' // Your client id here  
};

const userPool = new CognitoUserPool(poolData);

let that: any;

@Injectable()
export class AuthorizationService {
  static identityPoolId: string = 'us-east-2:3245f703-bac7-4103-ab98-32a027009afa';
  cognitoUser: any;
  authToken: string | null;
  
  constructor(
    private cookieService: CookieService,
    private router: Router
  ) {
    that = this;
    this.inItAuth();
  }

  inItAuth() {
    this.authToken = this.cookieService.get('mlosc');
    if (this.authToken) {
      const awsCredentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:3245f703-bac7-4103-ab98-32a027009afa',
        Logins: {
          'cognito-idp.us-east-2.amazonaws.com/us-east-2_laC3yucNE': this.authToken
        },
      }, {
        region: 'us-east-2'
      });
  
      AWS.config.update({
        region: 'us-east-2',
        credentials: awsCredentials
      });
    }
  }

  signIn(
    email: string,
    password: string
  ) { 
    const authenticationData = {
      Username : email,
      Password : password,
    };
    
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username : email,
      Pool : userPool
    };

    const cognitoUser = new CognitoUser(userData);
    
    return Observable.create(observer => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {

          cognitoUser.getSession(function(err, result) {
            if (result) {
              
              // Get Token for AWS Cognito Creds
              that.authToken = result.getIdToken().getJwtToken();

              // Setting cookie to expire 1 hour from now
              const oneHourFromNow = new Date;
              oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
              // Store Token in Cookies
              that.cookieService.set('mlosc', that.authToken, oneHourFromNow);

              // Add the User's Id Token to the Cognito credentials login map.
              const awsCredentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-2:3245f703-bac7-4103-ab98-32a027009afa',
                Logins: {
                  'cognito-idp.us-east-2.amazonaws.com/us-east-2_laC3yucNE': that.authToken
                },
              }, {
                region: 'us-east-2'
              });

              AWS.config.update({
                region: 'us-east-2',
                credentials: awsCredentials
              });
            }
          });
          observer.next(result);
          observer.complete();
        },
        onFailure: function(err) {
          console.log(err);
          observer.error(err);
        },
        newPasswordRequired: function(result) {
          observer.next();
          observer.complete();
        }
      });
    });
  }

  isLoggedIn() {
    return userPool.getCurrentUser() != null && this.authToken;
  }

  getAuthenticatedUser() {
    // gets the current user from the local storage
    return userPool.getCurrentUser() || this.cognitoUser;
  }

  logOut() {
    this.getAuthenticatedUser().signOut();
    this.cookieService.delete('mlosc');
    this.authToken = null;
    this.cognitoUser = null;
  }

}