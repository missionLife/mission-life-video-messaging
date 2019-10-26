import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-auth-view',
  templateUrl: './auth-view.component.html',
  styleUrls: ['./auth-view.component.scss']
})
export class AuthViewComponent implements OnInit {

  constructor(
    private auth: AuthorizationService,
    private router: Router
  ) { }

  ngOnInit() {
    const currentUser = this.auth.getAuthenticatedUser();
    
    if (currentUser) {
      console.log('You are logged in!.  Redirecting to Upload Page');
      this.router.navigate(['/upload']);
    }
  }

}
