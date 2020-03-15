import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from "../../services/authorization.service";
import { Observable } from 'rxjs';
import { AWSError } from '../../models/aws-error';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})

export class LoginFormComponent implements OnInit {
  state$: Observable<object>;
  emailVerificationMessage: boolean = false;
  errorMessage: string;
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private auth: AuthorizationService,
    private router: Router
  ) {}

  @Input() error: string | null;

  ngOnInit() {}

  login() {
    const email = this.form.value.email;
    const password = this.form.value.password;
    
    this.auth.signIn(email, password, this).subscribe((data) => {
      this.router.navigateByUrl('/');
    }, (error)=> {
      this.error = new AWSError(error.message).message || error.message;
      this.emailVerificationMessage = true;
    });   
  }

  cognitoCallback(error: Error, result: any) {
    if (error.message != null) { //error
        if (error.message === 'User needs to set password.') {
            console.log("redirecting to set new password");
            this.router.navigate(['/newPassword'], { 
              state: { 
                data: { 
                  currentUserEmail: this.form.value.email,
                  currentUserPassword: this.form.value.password
                }
              }
            });
        } else {
          this.errorMessage = new AWSError(error.message).message;
        }
    } else { //success
        this.router.navigate(['/upload']);
    }
  }

}
