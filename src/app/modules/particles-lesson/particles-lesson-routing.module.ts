import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticlesLessonComponent } from './particles-lesson.component';

const routes: Routes = [{ path: '', component: ParticlesLessonComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParticlesLessonRoutingModule { }
