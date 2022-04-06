import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevTestComponent } from './dev-test.component';

const routes: Routes = [{ path: '', component: DevTestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevTestRoutingModule {}
