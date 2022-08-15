import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ThreeWorld, ThreeWorldOptions } from '@daxur-studios/three';
import { ThreeJsWorld } from 'src/app/controllers/three/ThreeJsWorld.controller';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-jet',
  templateUrl: './jet.component.html',
  styleUrls: ['./jet.component.css'],
})
export class JetComponent implements OnInit {
  worldOptions: ThreeWorldOptions = {
    sizes: {
      height: 600,
      width: 800,
    },
    environmentConfig: {
      fpsInterval: 500,
      WebGLRendererAlpha: true,
    },
    cameraConfig: {
      hasCamera: true,
    },
    resizeConfig: {
      resizable: true,
      evalHeight: '600',
      evalWidth: '800',
    },
    gltfLoader: new GLTFLoader(),
  };

  w!: ThreeWorld;

  @ViewChild('threeCanvas', { static: true }) threeCanvas!: ElementRef;

  constructor() {}

  onWorld(world: ThreeWorld) {
    this.w = world;
    this.initJetLesson();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.w.destroy();
  }

  async initJetLesson() {
    /*
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
*/
    this.w.initWorld('OrbitControls', { intensity: 0.95 });

    const jetGltf = await this.w.options.gltfLoader!.loadAsync(
      'assets/models/jet/jet.glb'
    );

    console.debug('jet!', jetGltf);
    this.w.scene.add(jetGltf.scene);
  }
}
