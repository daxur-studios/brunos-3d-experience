import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SvgLessonRoutingModule } from './svg-lesson-routing.module';
import { SvgLessonComponent } from './svg-lesson.component';
import { SvgComponent } from './svg/svg.component';
import { MyCustomCircleComponent } from './my-custom-circle/my-custom-circle.component';
import { SvgGraphComponent } from './svg-graph/svg-graph.component';
import { MyCustomShapeComponent } from './my-custom-shapre/my-custom-shapre.component';
import { SvgToolbarComponent } from './svg-toolbar/svg-toolbar.component';
import { SvgToolbarBackgroundComponent } from './svg-toolbar/svg-toolbar-background/svg-toolbar-background.component';

@NgModule({
  declarations: [
    SvgLessonComponent,
    SvgComponent,
    MyCustomCircleComponent,
    SvgGraphComponent,
    MyCustomShapeComponent,
    SvgToolbarComponent,
    SvgToolbarBackgroundComponent,
  ],
  imports: [CommonModule, SvgLessonRoutingModule],
})
export class SvgLessonModule {}
