import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShadersLessonComponent } from './shaders-lesson.component';

const routes: Routes = [{ path: '', component: ShadersLessonComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShadersLessonRoutingModule { }
