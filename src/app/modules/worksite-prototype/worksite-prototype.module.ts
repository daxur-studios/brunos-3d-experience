import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorksitePrototypeRoutingModule } from './worksite-prototype-routing.module';
import { WorksitePrototypeComponent } from './worksite-prototype.component';


@NgModule({
  declarations: [
    WorksitePrototypeComponent
  ],
  imports: [
    CommonModule,
    WorksitePrototypeRoutingModule
  ]
})
export class WorksitePrototypeModule { }
