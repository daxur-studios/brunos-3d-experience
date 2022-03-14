import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevTestComponent } from './modules/dev-test/dev-test.component';
import { CSS3DLessonComponent } from './modules/lessons/css3-d-lesson/css3-d-lesson.component';
import { DracoLessonComponent } from './modules/lessons/draco-lesson/draco-lesson.component';
import { ShadersLessonComponent } from './modules/lessons/shaders-lesson/shaders-lesson.component';
import { ModularBuildingComponent } from './modules/modular-building/modular-building.component';
import { ParticlesLessonComponent } from './modules/particles-lesson/particles-lesson.component';
import { RaycastLessonComponent } from './modules/raycast-lesson/raycast-lesson.component';

const routes: Routes = [
  {
    path: 'dev-test',
    loadChildren: () =>
      import('./modules/dev-test/dev-test.module').then((m) => m.DevTestModule),
    component: DevTestComponent,
  },
  {
    path: 'worksitePrototype',
    loadChildren: () =>
      import('./modules/worksite-prototype/worksite-prototype.module').then(
        (m) => m.WorksitePrototypeModule
      ),
  },
  {
    path: 'raycast-lesson',
    component: RaycastLessonComponent,
    loadChildren: () =>
      import('./modules/raycast-lesson/raycast-lesson.module').then(
        (m) => m.RaycastLessonModule
      ),
  },
  {
    path: 'particles-lesson',
    component: ParticlesLessonComponent,
    loadChildren: () =>
      import('./modules/particles-lesson/particles-lesson.module').then(
        (m) => m.ParticlesLessonModule
      ),
  },
  {
    component: ModularBuildingComponent,
    path: 'modularBuilding',
    loadChildren: () =>
      import('./modules/modular-building/modular-building.module').then(
        (m) => m.ModularBuildingModule
      ),
  },
  {
    path: 'draco-lesson',
    component: DracoLessonComponent,
    loadChildren: () =>
      import('./modules/lessons/draco-lesson/draco-lesson.module').then(
        (m) => m.DracoLessonModule
      ),
  },
  {
    path: 'CSS3D-lesson',
    component: CSS3DLessonComponent,
    loadChildren: () =>
      import('./modules/lessons/css3-d-lesson/css3-d-lesson.module').then(
        (m) => m.CSS3DLessonModule
      ),
  },
  {
    path: 'shaders-lesson',
    component: ShadersLessonComponent,
    loadChildren: () =>
      import('./modules/lessons/shaders-lesson/shaders-lesson.module').then(
        (m) => m.ShadersLessonModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
