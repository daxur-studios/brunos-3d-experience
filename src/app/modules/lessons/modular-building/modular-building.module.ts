import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModularBuildingRoutingModule } from './modular-building-routing.module';
import { ModularBuildingComponent } from './modular-building.component';


@NgModule({
  declarations: [
    ModularBuildingComponent
  ],
  imports: [
    CommonModule,
    ModularBuildingRoutingModule
  ]
})
export class ModularBuildingModule { }
