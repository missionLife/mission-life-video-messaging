import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { AuthorizationService } from './services/authorization.service';
import { ReachService } from './services/reach.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { S3Service } from './services/s3.service';



import { AppMaterialModule } from './app.material.module';
import { RecorderComponent } from './recorder/recorder-component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { AuthViewComponent } from './components/auth-view/auth-view.component';
import { UploadViewComponent } from './components/upload-view/upload-view.component';



@NgModule({
  declarations: [
    AppComponent,
    RecorderComponent,
    LoginFormComponent,
    NavigationBarComponent,
    AuthViewComponent,
    UploadViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppMaterialModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    ReachService,
    S3Service,
    AuthorizationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
