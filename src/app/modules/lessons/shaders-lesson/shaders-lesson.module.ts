import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShadersLessonRoutingModule } from './shaders-lesson-routing.module';
import { ShadersLessonComponent } from './shaders-lesson.component';


@NgModule({
  declarations: [
    ShadersLessonComponent
  ],
  imports: [
    CommonModule,
    ShadersLessonRoutingModule
  ]
})
export class ShadersLessonModule { }
