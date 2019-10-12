import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthViewComponent } from './components/auth-view/auth-view.component';
import { UploadViewComponent } from './components/upload-view/upload-view.component';

const routes: Routes = [
  { path: 'login', component: AuthViewComponent },
  { path: '**', component: UploadViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
