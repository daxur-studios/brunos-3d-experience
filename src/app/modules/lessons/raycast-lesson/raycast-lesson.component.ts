import { Component, OnInit } from '@angular/core';
import { randomBetween } from 'src/app/helpers/randomFunctions';
import { ThreeJsWorld } from 'src/app/controllers/three/ThreeJsWorld.controller';
import {
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  Raycaster,
  SphereGeometry,
  Vector3,
} from 'three';
import { InteractiveParticle } from './InteractiveParticle';
import { InteractiveObjectManager } from './InteractiveObjectManager';

@Component({
  selector: 'app-raycast-lesson',
  templateUrl: './raycast-lesson.component.html',
  styleUrls: ['./raycast-lesson.component.css'],
})
export class RaycastLessonComponent implements OnInit {
  w!: ThreeJsWorld;
  gui!: dat.GUI;

  constructor() {}

  async ngOnInit() {
    // debug
    const dat = await import('dat.gui');
    this.gui = new dat.GUI();
    const gui = this.gui;

    // raycast lesson

    const canvas = document.getElementById(
      'raycastCanvas'
    ) as HTMLCanvasElement;

    this.w = new ThreeJsWorld(
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

    this.w.initWorld('OrbitControls');

    this.w.camera.position.z = 10;

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

    this.w.scene.add(s1, s2, s3);

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

    console.warn(this.w);

    this.w.customTick = () => {
      const time = this.w.ticker.clock.getElapsedTime();
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

      rayCasterForMouse.setFromCamera(this.w.cursor, this.w.camera);
      const intersectsMouse = rayCasterForMouse.intersectObjects(test);

      for (const x of intersectsMouse) {
        (x.object as Mesh).material = normalMat;
      }
    };

    this.clickableParticleTest();
  }

  async clickableParticleTest() {
    console.debug('wtf?');

    const clickManager = this.w.getInteractiveObjectManager(); // new InteractiveObjectManager(this.w);

    console.debug(clickManager);
    /**
     * Generate large amount of clickable particles, that run efficiently with raycast, without looping through every single item
     */
    const texture = await this.w.textureLoader.loadAsync(
      'assets/particles/clickableParticle.png'
    );

    const count = 50;
    for (let i = 0; i < count; i++) {
      const clickableParticle = new InteractiveParticle(clickManager, texture, {
        baseColor: new Float32Array([0.9, 0.2, 0.3]),
        hoverColor: new Float32Array([1, 1, 1]),
      });

      const distMultiplier = 25;

      clickableParticle.position.set(
        randomBetween(-1, 1, false) * distMultiplier,
        randomBetween(-1, 1, false) * distMultiplier,
        randomBetween(-1, 1, false) * distMultiplier
      );

      clickableParticle.onClick = async () => {
        // move orbit controls to center particle?
        console.debug('clickableParticle onclick!');
        // clickableParticle.destroy();
        const p = clickableParticle.position;
        const gsap = await this.w.getGsap();

        if (this.w.controls) {
          gsap.to(this.w.controls.target, {
            x: p.x,
            y: p.y,
            z: p.z,
            onStart: () => {
              if (this.w?.controls) {
                this.w.controls.minDistance = this.w.controls.getDistance();
                this.w.controls.maxDistance = this.w.controls.getDistance();
                this.w.controls.enableZoom = false;
              }
            },
            onComplete: () => {
              if (this.w?.controls) {
                this.w.controls.minDistance = 0.1;
                this.w.controls.maxDistance = Infinity;
                this.w.controls.enableZoom = true;
              }
            },
          });
        }

        //   this.w.controls?.target.set(p.x, p.y, p.z);
      };

      this.w.scene.add(clickableParticle);
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.w.destroy();
    this.gui.destroy();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }
}
