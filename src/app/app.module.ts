import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {ReachService} from './services/reach.service';
import { AppMaterialModule } from './app.material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RecorderComponent } from './recorder/recorder-component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AWSService } from './services/aws.service';

@NgModule({
  declarations: [
    AppComponent,
    RecorderComponent
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
  providers: [ReachService, AWSService],
  bootstrap: [AppComponent]
})
export class AppModule { }
