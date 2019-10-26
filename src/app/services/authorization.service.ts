import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { CognitoIdentityCredentials, AWSError } from 'aws-sdk'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

const poolData = {
  UserPoolId: 'us-east-2_laC3yucNE', // Your user pool id here
  ClientId: '55kupjfu7vnn7ogu57p3h7psmd' // Your client id here  
};

const userPool = new CognitoUserPool(poolData);

@Injectable()
export class AuthorizationService {
  static identityPoolId: string = 'us-east-2:3245f703-bac7-4103-ab98-32a027009afa';
  cognitoUser: any;
  cognitoAwsCredentials: CognitoIdentityCredentials;
  static userPoolLoginKey: string = `cognito-idp.us-east-2.amazonaws.com/us-east-2_laC3yucNE`;
  
  constructor() {}

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
              console.log('You are now logged in.');
        
              // Add the User's Id Token to the Cognito credentials login map.
              AWS.config.update({
                region: 'us-east-2',
                credentials: new AWS.CognitoIdentityCredentials({
                  IdentityPoolId: 'us-east-2:3245f703-bac7-4103-ab98-32a027009afa',
                  Logins: {
                    'cognito-idp.us-east-2.amazonaws.com/us-east-2_laC3yucNE': result.getIdToken().getJwtToken()
                  },
                }, {
                  region: 'us-east-2'
                })
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
    return userPool.getCurrentUser() != null;
  }

  getAuthenticatedUser() {
    // gets the current user from the local storage
    return userPool.getCurrentUser() || this.cognitoUser;
  }

  logOut() {
    this.getAuthenticatedUser().signOut();
    this.cognitoUser = null;
  }

}