import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RaycastLessonComponent } from './raycast-lesson.component';

const routes: Routes = [{ path: '', component: RaycastLessonComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RaycastLessonRoutingModule { }
