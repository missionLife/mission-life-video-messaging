import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CognitoCallback } from '../models/cognito-callback';

const poolData = {
  UserPoolId: 'us-east-2_laC3yucNE', // Your user pool id here
  ClientId: '55kupjfu7vnn7ogu57p3h7psmd' // Your client id here  
};

const userPool = new CognitoUserPool(poolData);

@Injectable()
export class AuthorizationService {
  static identityPoolId: string = 'us-east-2:3245f703-bac7-4103-ab98-32a027009afa';
  cognitoUser: any;
  authToken: string | null;
  configObservable = new Subject<boolean>();
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  
  constructor(
    private cookieService: CookieService,
    private router: Router
  ) {
    this.inItAuth();
  }

  emitConfig(val) {
    this.configObservable.next(val);
  }

  inItAuth() {
    const that = this;
    const token = this.cookieService.get('mlosc');

    let awsCredentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-2:3245f703-bac7-4103-ab98-32a027009afa',
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

    if (token) {
      this.loggedIn.next(true);
    }
    
    const cognitoUser = this.cognitoUser;
    if (cognitoUser) {
      cognitoUser.getSession(function(err, result) {
        if (result) {
          // Get Token for AWS Cognito Creds
          const token = result.getIdToken().getJwtToken();
          
          // Setting cookie to expire 1 hour from now
          const oneHourFromNow = new Date;
          oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
          // Store Token in Cookies
          that.cookieService.set(
            'mlosc',
            token,
            oneHourFromNow,
            '/',
            'd1s3z7p9p47ieq.cloudfront.net', 
            true, 
            "Strict"
          );
  
          const refreshToken = result.getRefreshToken();
          
          const needsRefresh = ( < AWS.CognitoIdentityCredentials > AWS.config.credentials).needsRefresh();
          
          if (needsRefresh) {
            cognitoUser.refreshSession(refreshToken, (err, session) => {
              if(err) {
                console.log(err);
              } else {
                const newToken = session.getIdToken().getJwtToken();
                that.authToken = newToken;
                
                ( <any> AWS.config.credentials ).params.Logins[
                  'cognito-idp.us-east-2.amazonaws.com/us-east-2_laC3yucNE'
                ] = newToken;

                try {
                  awsCredentials.clearCachedId();
                  ( < AWS.CognitoIdentityCredentials > AWS.config.credentials).refresh((err)=> {
                    if (err) {
                      console.log(err);
                    } else {
                      that.emitConfig(true);
                    }
                  });
                } catch (e) {
                  console.log('There was an error in the Authorization Service: ', e);
                }
              }
            });
          }
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
    this.cognitoUser = cognitoUser;
    
    return Observable.create(observer => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          this.loggedIn.next(true);
          this.inItAuth();
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
    return this.cookieService.get('mlosc');
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