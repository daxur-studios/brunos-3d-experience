import { Component, OnInit } from '@angular/core';
import { ThreeJsEnvironment } from 'src/threeJsController';
import {
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  Raycaster,
  SphereGeometry,
  Vector3,
} from 'three';

import * as dat from 'dat.gui';

@Component({
  selector: 'app-raycast-lesson',
  templateUrl: './raycast-lesson.component.html',
  styleUrls: ['./raycast-lesson.component.css'],
})
export class RaycastLessonComponent implements OnInit {
  e!: ThreeJsEnvironment;
  gui!: dat.GUI;

  constructor() {}

  ngOnInit(): void {
    // debug
    this.gui = new dat.GUI();
    const gui = this.gui;

    // raycast lesson

    const canvas = document.getElementById(
      'raycastCanvas'
    ) as HTMLCanvasElement;

    this.e = new ThreeJsEnvironment(
      { height: 600 ?? window.innerHeight, width: 800 ?? window.innerWidth },
      { fpsInterval: 500, WebGLRendererAlpha: true },
      {
        resizeable: true,
        evalHeight: '600', //'window.innerHeight',
        evalWidth: '800', //'window.innerWidth',
      },
      {
        hasCamera: true,
      },
      canvas
    );

    this.e.init3D('OrbitControls');

    const redMat = new MeshBasicMaterial({ color: 'red' });
    const blueMat = new MeshBasicMaterial({ color: 'blue' });
    blueMat.wireframe = true;
    const greenMat = new MeshBasicMaterial({ color: 'green' });

    const normalMat = new MeshNormalMaterial();
    normalMat.flatShading = true;

    const sphere = new SphereGeometry();

    sphere.scale(0.5, 0.5, 0.5);

    const s1 = new Mesh(sphere, redMat);
    s1.position.x = 0;
    const s2 = new Mesh(sphere, redMat);
    s2.position.x = 2;
    const s3 = new Mesh(sphere, redMat);
    s3.position.x = -2;

    this.e.scene.add(s1, s2, s3);

    gui.add(s1.position, 'z').min(-3).max(3).step(0.01).name('s1 z');
    gui.add(blueMat, 'wireframe');

    const rayCaster = new Raycaster();

    const rayOrigin = new Vector3(-3, 0, 0);
    const rayDirection = new Vector3(10, 0, 0);
    rayDirection.normalize();

    rayCaster.set(rayOrigin, rayDirection);

    const intersect = rayCaster.intersectObject(s1);
    const intersects = rayCaster.intersectObjects([s1, s2, s3]);

    console.log(intersect);
    console.log(intersects);

    const rayCasterForMouse = new Raycaster();
    // rayCasterForMouse.setFromCamera(this.e.cursor, this.e.camera);

    const test = [s1, s2, s3];

    console.warn(this.e);

    this.e.customTick = () => {
      const time = this.e.clock.getElapsedTime();
      s1.position.y = Math.sin(time * 1.3) * 1.5;
      s2.position.y = Math.sin(time * 0.6) * 1.5;
      s3.position.y = Math.sin(time * 0.9) * 1.5;

      for (const x of test) {
        x.material = redMat;
      }
      const intersects = rayCaster.intersectObjects(test);
      for (const x of intersects) {
        (x.object as Mesh).material = blueMat;
      }

      rayCasterForMouse.setFromCamera(this.e.cursor, this.e.camera);
      const intersectsMouse = rayCasterForMouse.intersectObjects(test);

      for (const x of intersectsMouse) {
        (x.object as Mesh).material = normalMat;
      }
    };
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.e.destroy();
    this.gui.destroy();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }
}
