import { Component, OnInit } from '@angular/core';
import { coolNoise } from 'src/assets/shaders/coolNoise/coolNoise';
import { ThreeJsWorld } from 'src/threeJsController';
import {
  BufferAttribute,
  FileLoader,
  Mesh,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  RawShaderMaterial,
  ShaderMaterial,
  TorusKnotGeometry,
} from 'three';

//import vst from '../../../../assets/shaders/vertexShaderTest';
//import fst from '../../../../assets/shaders/fragmentShaderTest';

@Component({
  selector: 'app-shaders-lesson',
  templateUrl: './shaders-lesson.component.html',
  styleUrls: ['./shaders-lesson.component.css'],
})
export class ShadersLessonComponent implements OnInit {
  e!: ThreeJsWorld;
  gui!: dat.GUI;

  constructor() {}

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

    this.initShadersLesson();
  }

  async initShadersLesson() {
    //

    // const testShader = require('../../../../assets/shaders/test.glsl');
    /*
    const vst = await import(
      '../../../../assets/shaders/vertexShaderTest.glsl'
    );
    const fst = await import(
      '../../../../assets/shaders/fragmentShaderTest.glsl'
    );
*/

    const fkoff = new FileLoader();
    const vst = await fkoff.loadAsync(
      '../../../../assets/shaders/test/vertexShaderTest.glsl'
    );
    const fst = await fkoff.loadAsync(
      '../../../../assets/shaders/test/fragmentShaderTest.glsl'
    );

    const noseTestV = await fkoff.loadAsync(
      '../../../../assets/shaders/3D Cubic Noise/vertex.glsl'
    );

    const noseTestFragment = await fkoff.loadAsync(
      '../../../../assets/shaders/3D Cubic Noise/fragment.glsl'
    );
    //const xaxa = await fkoff.loadAsync('../../../../assets/shaders/xaxa.glsl');

    console.warn(fst, vst);
    //   const vst = require('../../../../assets/shaders/vertexShaderTest.glsl');
    //   const fst = require('../../../../assets/shaders/fragmentShaderTest.glsl');

    // shaderMaterialTest.wireframe = true;

    //const basicMaterial = new MeshBasicMaterial();

    //const torus = new Mesh(new TorusKnotGeometry(), shaderTestMaterial);

    const planeGeo = new PlaneBufferGeometry(2, 2, 100, 100);

    const randoms = new Float32Array(planeGeo.attributes.position.count);
    randoms.forEach((r, i) => {
      randoms[i] = Math.random();
    });

    planeGeo.setAttribute('aRandom', new BufferAttribute(randoms, 1));

    console.warn(planeGeo);

    const shaderMaterialTest = new ShaderMaterial({
      vertexShader: noseTestV as any as string,
      fragmentShader: noseTestFragment as any as string,
    });

    const planeMesh = new Mesh(planeGeo, shaderMaterialTest);

    //this.e.scene.add(orb);

    this.e.scene.add(planeMesh);

    const coolNoiseTest = coolNoise();
    console.warn(coolNoiseTest);
  }
}
