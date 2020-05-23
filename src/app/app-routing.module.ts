import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthViewComponent } from './components/auth-view/auth-view.component';
import { UploadViewComponent } from './components/upload-view/upload-view.component';
import { ResetPasswordFormComponent } from './components/reset-password-form/reset-password-form.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: AuthViewComponent
  },
  {
    path: 'newPassword',
    component: AuthViewComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent
  },
  {
    path: 'upload',
    component: UploadViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: UploadViewComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
