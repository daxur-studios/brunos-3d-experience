import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevTestRoutingModule } from './dev-test-routing.module';
import { DevTestComponent } from './dev-test.component';

@NgModule({
  declarations: [DevTestComponent],
  imports: [CommonModule, DevTestRoutingModule],
})
export class DevTestModule {}
