import { Component, OnInit } from '@angular/core';
import { ThreeJsEnvironment } from 'src/threeJsController';
import * as dat from 'dat.gui';
import {
  AmbientLight,
  AxesHelper,
  BackSide,
  BoxBufferGeometry,
  BoxGeometry,
  DirectionalLight,
  DoubleSide,
  HemisphereLight,
  InstancedMesh,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
} from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { TempleInnerBlock as TIB, workSlot } from './_templeInnerBlock';
import { CircleOfClouds } from './_circleOfClouds';
import { TempleStart as TS } from './_templeStart';
import { SkyBox } from './_skyBox';
import { degToRad } from 'three/src/math/MathUtils';
import { workBlocks } from './BrunosPreviousWorks';
import { TempleStars } from './_stars';

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

    // draco lesson

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
        far: 10000,
      },
      canvas
    );

    this.e.init3D('OrbitControls');
    this.initDracoLesson();

    const axesHelper = new AxesHelper(50);
    this.e.scene.add(axesHelper);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.e.destroy();
    this.gui.destroy();
  }

  async initDracoLesson() {
    this.e.camera.position.y = 1.7;
    this.e.camera.position.x = 18;
    this.e.camera.position.z = 0;

    /**
     * Add skybox
     */
    const skybox = new SkyBox(this.e, 1000);
    this.e.scene.add(skybox.mesh);
    // this.generateSkybox();

    /**
     * create floor
     */
    // const floor = new PlaneGeometry(20, 6, 1, 1);
    const templeMat = new MeshStandardMaterial({ color: '#9e9e9e' });

    //  const floorMesh = new Mesh(floor, floorMat);

    //   floorMesh.visible = false;
    //  floorMesh.receiveShadow = true;

    //  floorMesh.material.side = DoubleSide;

    //   floorMesh.rotateX(Math.PI / 2);
    //   floorMesh.position.y = 0.01;

    //   this.e.scene.add(floorMesh);

    /**
     * create light
     */

    this.e.renderer.shadowMap.enabled = true;

    const light = new PointLight(undefined, 0.5);

    light.position.set(0, 10, 0);

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

    /*  this.gltfLoader.load('assets/models/columnUnCompressed.glb', (gltf) => {
      gltf.scene.castShadow = true;
      gltf.scene.children[0].castShadow = true;
      console.warn(gltf);
      this.e.scene.add(gltf.scene);
    });
*/
    /**
     *  CREATE DRACO LOADER
     */

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('assets/draco/'); // use Web Assembly version

    this.gltfLoader.setDRACOLoader(dracoLoader);

    /**
     * Test loading a compressed model
     */

    const colGltf = await this.gltfLoader.loadAsync(
      'assets/models/templeColumn.glb'
    );
    const baseColMesh: Mesh = colGltf.scene.children[0] as Mesh;

    // this.e.scene.add(instancedColumn);

    /**
     * Test create work blocks
     */
    const TIBCenterOffset =
      (TIB.outerWidth * workBlocks.length) / 2 - TIB.outerWidth / 2;

    workBlocks.forEach((blockData, i) => {
      const workBlock = new TIB.MeshBuilder(
        blockData,
        this.e,
        this.gltfLoader,
        TS.columnCount * 2 * TS.columnWidth,
        templeMat,
        colGltf.scene.children[0] as Mesh
      );

      workBlock.mesh.position.set(
        i * TIB.outerWidth * -1 + TIBCenterOffset,
        (TIB.floorHeight * -1) / 2,
        0
      );

      this.e.scene.add(workBlock.mesh);
    });

    /**
     * Test loading in roof
     */
    const roofGltf = await this.gltfLoader.loadAsync(
      'assets/models/RoofV2.glb'
    );
    console.warn(roofGltf);
    const baseRoofMesh = roofGltf.scene.children[0] as Mesh;

    const templeStart = new TS.MeshBuilder(
      templeMat,
      baseColMesh,
      baseRoofMesh
    );

    const baseTempleStartOffset =
      (workBlocks.length * TIB.outerWidth) / 2 + templeStart.outerWidth / 2;

    templeStart.mesh.position.set(-baseTempleStartOffset, 0, 0);
    this.e.scene.add(templeStart.mesh);

    const templeEnd = new TS.MeshBuilder(templeMat, baseColMesh, baseRoofMesh);
    templeEnd.mesh.rotateY(degToRad(180));
    templeEnd.mesh.position.set(baseTempleStartOffset, 0, 0);
    this.e.scene.add(templeEnd.mesh);

    /**
     * Add circle of clouds
     */

    //  const x = Math.floor((2 * Math.PI * (baseTempleStartOffset + 2)) / 12);

    const clouds = new CircleOfClouds(
      `assets/images/cloud1.png`,
      5,
      baseTempleStartOffset + 3,
      this.e
    );
    clouds.mesh.position.set(0, 2, 0);
    this.e.scene.add(clouds.mesh);
    clouds.animate();

    const clouds2 = new CircleOfClouds(
      `assets/images/cloud2.png`,
      5,
      baseTempleStartOffset + 11,
      this.e
    );
    clouds2.mesh.position.set(0, 3, 0);
    this.e.scene.add(clouds2.mesh);

    clouds2.animate();

    const stars = new TempleStars(this.e, 5000, 5.05, 50, 500);
    this.e.scene.add(stars.mesh);
  }
}
