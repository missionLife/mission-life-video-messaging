import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
// import { AuthorizationService } from './services/authorization.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    // private authorizationService: AuthorizationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const currentUser = this.authorizationService.cognitoUser;
    if (true) {
      return true;
    }

    // If the user is not logged in, force redirect to login page
    // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    // return false;
  }
}