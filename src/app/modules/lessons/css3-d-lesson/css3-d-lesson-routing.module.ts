import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CSS3DLessonComponent } from './css3-d-lesson.component';

const routes: Routes = [{ path: '', component: CSS3DLessonComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CSS3DLessonRoutingModule { }
