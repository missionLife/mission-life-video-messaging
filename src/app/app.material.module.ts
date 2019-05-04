import {MatProgressSpinnerModule, MatSelectModule, MatButtonModule} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [MatSelectModule, MatProgressSpinnerModule, MatButtonModule],
  exports: [MatSelectModule, MatProgressSpinnerModule, MatButtonModule],
})
export class AppMaterialModule { }
