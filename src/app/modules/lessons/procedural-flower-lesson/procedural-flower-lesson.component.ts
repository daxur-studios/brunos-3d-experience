import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ThreeJsWorld } from 'src/app/controllers/three/ThreeJsWorld.controller';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ProceduralPetal } from './classes/ProceduralPetal';

@Component({
  selector: 'app-procedural-flower-lesson',
  templateUrl: './procedural-flower-lesson.component.html',
  styleUrls: ['./procedural-flower-lesson.component.css'],
})
export class ProceduralFlowerLessonComponent implements OnInit {
  w!: ThreeJsWorld;

  @ViewChild('threeCanvas', { static: true }) threeCanvas!: ElementRef;
  //gui!: dat.GUI;

  constructor() {}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.w.destroy();
  }

  /**
   * Aim of this lesson is to procedurally generate 3D flowers based on parameters
   */
  ngOnInit(): void {
    this.initFlower();
  }

  async initFlower() {
    /**
     * init world
     */

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
      this.threeCanvas.nativeElement as HTMLCanvasElement,
      new GLTFLoader()
    );

    this.w.initWorld('OrbitControls');

    /**
     * create petal
     */
    const petal = new ProceduralPetal(this.w, {
      flowerType: 'daisy',
      petalColors: ['red', 'blue'],
      petalCount: 12,
    });
    await petal.generateMesh(false);
    this.w.scene.add(petal.mesh);
  }
}
