import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanetsRoutingModule } from './planets-routing.module';
import { PlanetsComponent } from './planets.component';
import { ThreeModule } from '@daxur-studios/three';

@NgModule({
  declarations: [PlanetsComponent],
  imports: [CommonModule, PlanetsRoutingModule, ThreeModule],
})
export class PlanetsModule {}
