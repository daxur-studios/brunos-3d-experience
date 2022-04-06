import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParticlesLessonRoutingModule } from './particles-lesson-routing.module';
import { ParticlesLessonComponent } from './particles-lesson.component';


@NgModule({
  declarations: [
    ParticlesLessonComponent
  ],
  imports: [
    CommonModule,
    ParticlesLessonRoutingModule
  ]
})
export class ParticlesLessonModule { }
