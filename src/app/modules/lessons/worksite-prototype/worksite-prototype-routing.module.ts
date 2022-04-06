import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorksitePrototypeComponent } from './worksite-prototype.component';

const routes: Routes = [{ path: '', component: WorksitePrototypeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorksitePrototypeRoutingModule { }
