import { Component, OnDestroy, OnInit } from '@angular/core';
import { coolNoise } from 'src/assets/shaders/coolNoise/coolNoise';
import { ThreeJsWorld } from 'src/app/controllers/three/ThreeJsWorld.controller';
import {
  BufferAttribute,
  FileLoader,
  Mesh,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  RawShaderMaterial,
  ShaderMaterial,
  SphereBufferGeometry,
  TorusKnotGeometry,
} from 'three';
import { hexToRgb } from 'src/app/helpers/colorHelpers';

//import vst from '../../../../assets/shaders/vertexShaderTest';
//import fst from '../../../../assets/shaders/fragmentShaderTest';

@Component({
  selector: 'app-shaders-lesson',
  templateUrl: './shaders-lesson.component.html',
  styleUrls: ['./shaders-lesson.component.css'],
})
export class ShadersLessonComponent implements OnInit, OnDestroy {
  e!: ThreeJsWorld;
  gui!: dat.GUI;

  constructor() {}

  ngOnDestroy(): void {
    this.e.destroy();
    this.gui.destroy();
  }

  async ngOnInit() {
    // debug

    const dat = await import('dat.gui');
    this.gui = new dat.GUI();

    // draco lesson

    const canvas = document.getElementById('threeCanvas') as HTMLCanvasElement;

    this.e = new ThreeJsWorld(
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

    this.e.initWorld('OrbitControls');

    this.initGui();
    this.initShadersLesson();
  }

  generate() {
    this.e.scene.clear();
    this.initShadersLesson();
  }

  guiParams = {
    scale: 5,
    color1: '#ffeb3b',
    color2: '#e91e63',
    sharpness: 2,
  };

  async initGui() {
    this.gui
      .add(this.guiParams, 'scale', 0.01, 30, 0.01)
      // .onChange(() => this.generate())
      .onFinishChange(() => this.generate());

    this.gui.addColor(this.guiParams, 'color1').onFinishChange(() => {
      this.generate();
    });
    this.gui.addColor(this.guiParams, 'color2').onFinishChange(() => {
      this.generate();
    });

    this.gui
      .add(this.guiParams, 'sharpness', 0.01, 100, 0.01)
      .onFinishChange(() => {
        this.generate();
      });
  }

  async initShadersLesson() {
    const folder = 'Simplex 3D Noise';
    //  const folder='3D Cubic Noise';

    const noseTestV = await (
      await fetch('assets/shaders/' + folder + '/vertex.glsl')
    ).text();
    const noseTestFragment = await (
      await fetch('assets/shaders/' + folder + '/fragment4D.glsl')
    ).text();

    const sphereGeo = new SphereBufferGeometry(1, 30, 30);

    const randoms = new Float32Array(sphereGeo.attributes.position.count);
    randoms.forEach((r, i) => {
      randoms[i] = Math.random();
    });

    sphereGeo.setAttribute('aRandom', new BufferAttribute(randoms, 1));

    // console.warn(sphereGeo);
    console.debug(hexToRgb(this.guiParams.color1));
    const shaderMaterialTest = new ShaderMaterial({
      vertexShader: noseTestV as any as string,
      fragmentShader: noseTestFragment as any as string,
      uniforms: {
        scale: { value: this.guiParams.scale },
        color1: { value: hexToRgb(this.guiParams.color1) },
        color2: { value: hexToRgb(this.guiParams.color2) },
        sharpness: { value: this.guiParams.sharpness },
        time: this.e.uniforms.time as any,
      },
    });

    const planeMesh = new Mesh(sphereGeo, shaderMaterialTest);

    //this.e.scene.add(orb);

    this.e.scene.add(planeMesh);

    //const coolNoiseTest = coolNoise();
    //console.warn(coolNoiseTest);
  }
}
