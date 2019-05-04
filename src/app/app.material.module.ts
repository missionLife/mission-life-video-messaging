import {MatFormFieldModule, MatProgressSpinnerModule, MatSelectModule} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule],
  exports: [MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule],
})
export class AppMaterialModule { }
