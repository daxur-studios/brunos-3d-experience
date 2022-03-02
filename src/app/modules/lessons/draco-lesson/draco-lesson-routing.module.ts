import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DracoLessonComponent } from './draco-lesson.component';

const routes: Routes = [{ path: '', component: DracoLessonComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DracoLessonRoutingModule { }
