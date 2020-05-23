import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const RESET_PASSWORD_URL = '';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent implements OnInit {
  success: boolean;
  errorMessage: string;
  username = new FormControl('', [Validators.required, Validators.email]);
  form: FormGroup = new FormGroup({
    username: this.username
  });
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
  }

  resetPassword() {
    if (this.username.valid) {
      const username = this.form.controls.username.value.toLowerCase();
      const subject = encodeURIComponent(`Reset Password Request`);
      const body = encodeURIComponent(`Hi Admin, the User - ${username}, is requesting a password reset.`);

      window.location.href = `
        mailto:admin@missionlifechange.org?subject=${subject}&body=${body}
      `;

      this.success = true;
      this.errorMessage = null;
    } else if (this.username.errors.required) {
      this.errorMessage = 'Username is required';
    } else if (this.username.errors.email) {
      this.errorMessage = 'Username must be a valid email'; 
    }
  }

  backToLogin() {
    this.router.navigate(['/login'])
  }
}
