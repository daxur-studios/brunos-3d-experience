import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ThreeWorld, ThreeWorldOptions } from '@daxur-studios/three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.css'],
})
export class PlanetsComponent implements OnInit {
  worldOptions: ThreeWorldOptions = {
    sizes: {
      height: 1000,
      width: 1200,
    },
    environmentConfig: {
      fpsInterval: 500,
      WebGLRendererAlpha: true,
    },
    cameraConfig: {
      hasCamera: true,
    },
    resizeConfig: {
      resizable: false,
    },
    gltfLoader: new GLTFLoader(),
  };

  w!: ThreeWorld;

  @ViewChild('threeCanvas', { static: true }) threeCanvas!: ElementRef;

  constructor() {}

  onWorld(world: ThreeWorld) {
    this.w = world;
    this.initPlanetLesson();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.w.destroy();
  }

  initPlanetLesson() {}
}
