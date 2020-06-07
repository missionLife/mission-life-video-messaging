import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

   loggedIn: boolean = false;
  $loggedIn: Observable<boolean>

  constructor(
    private auth: AuthorizationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.$loggedIn = this.auth.isUserLoggedIn;
    this.$loggedIn.subscribe((isLoggedIn) => {
      this.loggedIn = isLoggedIn;
    });
  }

  logOut() {
    this.auth.logOut();
    this.router.navigate(['/login']);
    return;
  }

}
