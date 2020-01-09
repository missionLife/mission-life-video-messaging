import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-auth-view',
  templateUrl: './auth-view.component.html',
  styleUrls: ['./auth-view.component.scss']
})
export class AuthViewComponent implements OnInit {
  newPassword: boolean = false;
  constructor(
    private auth: AuthorizationService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    const currentUser = this.auth.getAuthenticatedUser();
    const token = this.cookieService.get('mlosc');
    
    if (currentUser && token) {
      console.log('You are logged in!.  Redirecting to Upload Page');
      this.router.navigate(['/upload']);
    }
    
    if (this.router.url.includes('newPassword')) {
      this.newPassword = true;
    }
  }

}
