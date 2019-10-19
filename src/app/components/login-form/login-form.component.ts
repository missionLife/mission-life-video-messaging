import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from "../../services/authorization.service";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  emailVerificationMessage: boolean = false;

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private auth: AuthorizationService,
    private _router: Router
  ) {}

  @Input() error: string | null;

  ngOnInit() {}

  login() {
    const email = this.form.value.email;
    const password = this.form.value.password;
    
    this.auth.signIn(email, password).subscribe((data) => {
      console.log('the DATA', data);
      this._router.navigateByUrl('/');
    }, (error)=> {
      this.error = error.message;
      this.emailVerificationMessage = true;
      
    });   
  }

}
