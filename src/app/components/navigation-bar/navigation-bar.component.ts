import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  constructor(
    private auth: AuthorizationService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logOut() {
    console.log('logging out')
    this.auth.logOut();
    this.router.navigate(['/login']);
    return;
  }

}
