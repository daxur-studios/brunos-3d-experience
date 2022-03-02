import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DracoLessonRoutingModule } from './draco-lesson-routing.module';
import { DracoLessonComponent } from './draco-lesson.component';


@NgModule({
  declarations: [
    DracoLessonComponent
  ],
  imports: [
    CommonModule,
    DracoLessonRoutingModule
  ]
})
export class DracoLessonModule { }
