import { ThreeModule } from '@daxur-studios/three';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JetRoutingModule } from './jet-routing.module';
import { JetComponent } from './jet.component';

@NgModule({
  declarations: [JetComponent],
  imports: [CommonModule, JetRoutingModule, ThreeModule],
})
export class JetModule {}
