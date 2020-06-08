import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthorizationService } from './services/authorization.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthorizationService,
    private cookieService: CookieService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const cookie = this.cookieService.get('mlosc');
    if (cookie) {
      const currentUser = this.auth.getAuthenticatedUser();
      const { token } = JSON.parse(cookie);
      if (currentUser && token) {
        return true;
      }
    }
    // If the user is not logged in, force redirect to login page
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}