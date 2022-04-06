import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProceduralFlowerLessonComponent } from './procedural-flower-lesson.component';

const routes: Routes = [
  { path: '', component: ProceduralFlowerLessonComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProceduralFlowerLessonRoutingModule {}
