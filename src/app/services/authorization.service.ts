import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { CognitoCallback } from '../models/cognito-callback';
import { environment } from '../../environments/environment';

const poolData = {
  UserPoolId: environment.cognitoUserPoolId, // Your user pool id here
  ClientId: environment.cognitoClientId // Your client id here  
};

const userPool = new CognitoUserPool(poolData);

@Injectable()
export class AuthorizationService {
  static identityPoolId: string = environment.cognitoIdentityPoolId;
  cognitoUser: any;
  authToken: string | null;
  configObservable = new Subject<boolean>();
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  
  constructor(
    private cookieService: CookieService
  ) {
    this.inItAuth();
  }

  emitConfig(val) {
    this.configObservable.next(val);
  }

  inItAuth() {
    const cookieObject = this.cookieService.get('mlosc');
    if (cookieObject) {
      const { token, email } = JSON.parse(cookieObject);
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
  
      const userData = {
        Username : email,
        Pool : userPool
      };
  
      const cognitoUser = new CognitoUser(userData);
      this.cognitoUser = cognitoUser;
      this.generateUserSession(cognitoUser, email);
    }
  }

  generateUserSession(cognitoUser: CognitoUser, email: string) {
    this.loggedIn.next(true);
    cognitoUser.getSession((err, result) => {
      if (result) {
        // Get Token for AWS Cognito Creds
        const token = result.getIdToken().getJwtToken();
        const cookieObject = {
          token,
          email
        };
        // Setting cookie to expire 1 hour from now
        const oneHourFromNow = new Date;
        oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
        // Store Token in Cookies
        this.cookieService.set(
          'mlosc',
          JSON.stringify(cookieObject),
          oneHourFromNow,
          '/',
          environment.cookieDomain, 
          environment.cookieSecure,
          "Strict"
        );

        this.emitConfig(true);
      }
    });
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
    this.cognitoUser = cognitoUser;
    
    return Observable.create(observer => {
      this.cognitoUser.authenticateUser(authenticationDetails, {
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
          this.loggedIn.next(true);
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
    const { token } = JSON.parse(this.cookieService.get('mlosc'));
    return token;
  }

  getAuthenticatedUser() {
    // gets the current user from the local storage
    if (this.isLoggedIn()) {
      return userPool.getCurrentUser() || this.cognitoUser;
    }
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