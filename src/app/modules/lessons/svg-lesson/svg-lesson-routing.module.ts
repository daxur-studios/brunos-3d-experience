import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SvgLessonComponent } from './svg-lesson.component';

const routes: Routes = [{ path: '', component: SvgLessonComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SvgLessonRoutingModule { }
