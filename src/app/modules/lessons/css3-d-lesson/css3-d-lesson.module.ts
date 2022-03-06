import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CSS3DLessonRoutingModule } from './css3-d-lesson-routing.module';
import { CSS3DLessonComponent } from './css3-d-lesson.component';


@NgModule({
  declarations: [
    CSS3DLessonComponent
  ],
  imports: [
    CommonModule,
    CSS3DLessonRoutingModule
  ]
})
export class CSS3DLessonModule { }
