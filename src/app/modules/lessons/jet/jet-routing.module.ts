import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JetComponent } from './jet.component';

const routes: Routes = [{ path: '', component: JetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JetRoutingModule {}
