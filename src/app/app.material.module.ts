import {MatProgressSpinnerModule, MatSelectModule, MatButtonModule, MatProgressBarModule, MatChipsModule} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [MatSelectModule, MatProgressSpinnerModule, MatButtonModule, MatProgressBarModule, MatChipsModule],
  exports: [MatSelectModule, MatProgressSpinnerModule, MatButtonModule, MatProgressBarModule, MatChipsModule],
})
export class AppMaterialModule { }
