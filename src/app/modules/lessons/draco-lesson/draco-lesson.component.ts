import { Component, OnInit } from '@angular/core';
import { ThreeJsEnvironment } from 'src/threeJsController';
import * as dat from 'dat.gui';
import {
  AmbientLight,
  DirectionalLight,
  DoubleSide,
  HemisphereLight,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  PointLight,
} from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

@Component({
  selector: 'app-draco-lesson',
  templateUrl: './draco-lesson.component.html',
  styleUrls: ['./draco-lesson.component.css'],
})
export class DracoLessonComponent implements OnInit {
  e!: ThreeJsEnvironment;
  gui!: dat.GUI;

  gltfLoader = new GLTFLoader();

  constructor() {}

  ngOnInit(): void {
    // debug
    this.gui = new dat.GUI();
    const gui = this.gui;

    // raycast lesson

    const canvas = document.getElementById('dracoCanvas') as HTMLCanvasElement;

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
    this.initDracoLesson();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.e.destroy();
    this.gui.destroy();
  }

  initDracoLesson() {
    /**
     * create floor
     */
    const floor = new PlaneGeometry(50, 50, 1, 1);
    const floorMat = new MeshStandardMaterial({ color: '#9e9e9e' });

    const floorMesh = new Mesh(floor, floorMat);

    floorMesh.receiveShadow = true;

    floorMesh.material.side = DoubleSide;

    floorMesh.rotateX(Math.PI / 2);
    floorMesh.position.y = -1.7;

    this.e.scene.add(floorMesh);

    /**
     * create light
     */

    this.e.renderer.shadowMap.enabled = true;

    const light = new PointLight(undefined, 0.5);
    light.position.y = 4;
    light.position.x = 8;
    light.visible = true;

    light.castShadow = true;

    this.e.scene.add(light);

    const ambientLight = new AmbientLight(undefined, 0.2);
    this.e.scene.add(ambientLight);

    const hemiLight = new HemisphereLight('#e6f4ff', 0x001221, 1);
    this.e.scene.add(hemiLight);

    const directionalLight = new DirectionalLight(undefined, 0.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.radius = 10;
    directionalLight.position.set(2, 0.25, 0);

    //directionalLight.castShadow = true;

    // this.e.scene.add(directionalLight);

    /**
     * Add basic uncompressed mesh
     */
    this.gltfLoader.load('assets/models/columnUnCompressed.glb', (gltf) => {
      gltf.scene.castShadow = true;
      gltf.scene.children[0].castShadow = true;
      console.warn(gltf);
      this.e.scene.add(gltf.scene);
    });

    /**
     *  CREATE DRACO LOADER
     */

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('assets/draco/'); // use Web Assembly version

    this.gltfLoader.setDRACOLoader(dracoLoader);

    /**
     * Test loading a compressed model
     */
    this.gltfLoader.load('assets/models/columnCompressed.glb', (gltf) => {
      //gltf.scene.castShadow = true;
      gltf.scene.children[0].castShadow = true;
      console.warn(gltf);
      gltf.scene.position.x = -4;
      gltf.scene.position.z = -4;
      this.e.scene.add(gltf.scene);

      //   const mat = new MeshStandardMaterial({ color: '#9e9e9e' });
      const mesh: Mesh = gltf.scene.children[0] as Mesh;

      const dummy = new Object3D();

      const instancedColumn = new InstancedMesh(
        mesh.geometry,
        mesh.material,
        600
      );
      instancedColumn.castShadow = true;

      this.e.scene.add(instancedColumn);

      for (var i = 0; i < instancedColumn.count; i++) {
        // we add 200 units of distance (the width of the section) between each.
        var xStaticPosition = -20 + i * 1.5;
        dummy.position.set(xStaticPosition, -1.7, 4);
        dummy.updateMatrix();
        instancedColumn.setMatrixAt(i, dummy.matrix);
      }
      instancedColumn.instanceMatrix.needsUpdate = true;

      // this.e.scene.add(instancedColumn);
    });
  }
}
