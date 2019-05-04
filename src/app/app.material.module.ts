import {MatFormFieldModule, MatSelectModule} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [MatFormFieldModule, MatSelectModule],
  exports: [MatFormFieldModule, MatSelectModule],
})
export class AppMaterialModule { }
