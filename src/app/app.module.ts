import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReachService} from './services/reach.service';
import { AppMaterialModule } from './app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecorderComponent } from './recorder/recorder-component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { S3Service } from './services/s3.service';
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
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [ReachService, S3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
