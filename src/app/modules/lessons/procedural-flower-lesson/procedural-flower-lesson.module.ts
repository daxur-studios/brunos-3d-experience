import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProceduralFlowerLessonRoutingModule } from './procedural-flower-lesson-routing.module';
import { ProceduralFlowerLessonComponent } from './procedural-flower-lesson.component';


@NgModule({
  declarations: [
    ProceduralFlowerLessonComponent
  ],
  imports: [
    CommonModule,
    ProceduralFlowerLessonRoutingModule
  ]
})
export class ProceduralFlowerLessonModule { }
