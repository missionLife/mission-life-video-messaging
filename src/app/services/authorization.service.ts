import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoRefreshToken } from 'amazon-cognito-identity-js';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CognitoCallback } from '../models/cognito-callback';
import { environment } from '../../environments/environment';

const poolData = {
  UserPoolId: environment.cognitoUserPoolId, // Your user pool id here
  ClientId: environment.cognitoClientId // Your client id here  
};

const userPool = new CognitoUserPool(poolData);

@Injectable()
export class AuthorizationService {
  awsCredentials: AWS.CognitoIdentityCredentials;
  static identityPoolId: string = environment.cognitoIdentityPoolId;
  cognitoUser: any;
  authToken: string | null;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  
  constructor(
    private cookieService: CookieService
  ) {
    this.inItAuth();
  }

  inItAuth() {
    const cookie = this.cookieService.get('mlosc');
    if (cookie) {
      const { token, email } = JSON.parse(this.cookieService.get('mlosc'));
      const userData = {
        Username : email,
        Pool : userPool
      };
      this.setCredentials(token);
      const cognitoUser = new CognitoUser(userData);
      this.generateUserSession(cognitoUser, email);
    }
  }

  setCredentials(token: string) {
    let awsCredentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: environment.cognitoIdentityPoolId,
      Logins: {
        'cognito-idp.us-east-2.amazonaws.com/us-east-2_laC3yucNE': token
      },
    }, {
      region: 'us-east-2'
    });

    AWS.config.update({
      region: 'us-east-2',
      credentials: awsCredentials
    });
    this.awsCredentials = awsCredentials;
    try {
      awsCredentials.clearCachedId();
      ( < AWS.CognitoIdentityCredentials > AWS.config.credentials).refresh((err)=> {
        if (err) {
          console.log(err);
        } else {
          console.log('####### Success');
        }
      });
    } catch (e) {
      console.log('There was an error in the Authorization Service: ', e);
    }
    return awsCredentials;
  }

  generateUserSession(cognitoUser: CognitoUser, email: string) {
    
    cognitoUser.getSession((err, result) => {
      if (result) {
        // Get Token for AWS Cognito Creds
        const token = result.getIdToken().getJwtToken();
        this.setCredentials(token);
        const refreshToken = result.getRefreshToken();
        
        // Setting cookie to expire 1 hour from now
        const oneHourFromNow = new Date;
        oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
        // Store Token in Cookies
        this.cookieService.set(
          'mlosc',
          JSON.stringify({
            token,
            email,
            refreshToken
          }),
          oneHourFromNow,
          '/',
          '', 
          environment.cookieSecure,
          "Strict"
        );
        this.loggedIn.next(true);
      } else {
        this.generateRefreshSession(cognitoUser)
      }
    });
  }

  generateRefreshSession(cognitoUser: CognitoUser) {
    const needsRefresh = ( < AWS.CognitoIdentityCredentials > AWS.config.credentials);
      if (needsRefresh && needsRefresh.needsRefresh()) {
        const { email, refreshToken } = JSON.parse(this.cookieService.get('mlosc'));
        const refreshTokenInstance = new CognitoRefreshToken({ RefreshToken: refreshToken.token });
        cognitoUser.refreshSession(refreshTokenInstance, (err, session) => {
          if(err) {
            console.log(err);
          } else {
            const newToken = session.getIdToken().getJwtToken();
            this.setCredentials(newToken);
            this.loggedIn.next(true);
          }
        });
      }
  }

  signIn(
    email: string,
    password: string,
    callback: CognitoCallback
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
        onSuccess: (result) => {
          this.generateUserSession(cognitoUser, email);
          observer.next(result);
          observer.complete();
        },
        onFailure: (err) => {
          console.log(err);
          observer.error(err);
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          callback.cognitoCallback(new Error(`User needs to set password.`), null);
          observer.complete();
        }
      });
    });
  }

  isLoggedIn() {
    return this.loggedIn.value;
  }

  get isUserLoggedIn(){
    return this.loggedIn.asObservable();
  } 

  getAuthToken() {
    const cookie = this.cookieService.get('mlosc');
    if (cookie) {
      const { token } = JSON.parse(cookie);
      return token;
    }
  }

  getAuthenticatedUser() {
    // gets the current user from the local storage
    return userPool.getCurrentUser() || this.cognitoUser;
  }

  logOut() {
    const user = this.getAuthenticatedUser();
    if (user) {
      user.signOut();
    }
    this.cookieService.delete('mlosc');
    this.authToken = null;
    this.cognitoUser = null;
    this.loggedIn.next(false);
  }

}