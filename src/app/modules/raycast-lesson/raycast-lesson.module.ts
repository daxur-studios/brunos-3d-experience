import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RaycastLessonRoutingModule } from './raycast-lesson-routing.module';
import { RaycastLessonComponent } from './raycast-lesson.component';


@NgModule({
  declarations: [
    RaycastLessonComponent
  ],
  imports: [
    CommonModule,
    RaycastLessonRoutingModule
  ]
})
export class RaycastLessonModule { }
