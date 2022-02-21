import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModularBuildingComponent } from './modular-building.component';

const routes: Routes = [{ path: '', component: ModularBuildingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModularBuildingRoutingModule { }
