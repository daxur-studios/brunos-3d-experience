import { Component, OnInit } from '@angular/core';

// Option 2: Import just the parts you need.
import {
  AxesHelper,
  BoxGeometry,
  Clock,
  Mesh,
  MeshBasicMaterial,
  MeshMatcapMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  Scene,
  Texture,
  TextureLoader,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MeasureFPS } from './fps';

export type textureConfig = {
  path: string;
  texture: Texture | null;
};
export type texturesConfig = {
  [name: string]: textureConfig;
};

@Component({
  selector: 'app-dev-test',
  templateUrl: './dev-test.component.html',
  styleUrls: ['./dev-test.component.css'],
})
export class DevTestComponent implements OnInit {
  measureFPS = new MeasureFPS(500);

  box?: Mesh;
  box2?: Mesh;

  scene!: Scene;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  textureLoader!: TextureLoader;

  controls?: OrbitControls;

  clock: Clock = new Clock();
  delta = 0;
  interval = 1 / 60; // 60 fps

  cursor = {
    x: 0,
    y: 0,
  };

  sizes = {
    width: window.innerWidth - 450,
    height: window.innerHeight - 150,
  };

  canvas?: HTMLElement | null;

  constructor() {}

  async initThree(cameraControlType: 'OrbitControls' | 'coded') {
    // create scene
    this.scene = new Scene();

    this.canvas = document.getElementById('threeJsCanvas');

    // create camera
    this.camera = new PerspectiveCamera(
      50,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    );

    this.camera.position.z = 3;

    // create orbit controls
    if (cameraControlType == 'OrbitControls' && this.canvas) {
      this.controls = new OrbitControls(this.camera, this.canvas);
      this.controls.enableDamping = true;

      this.controls.enablePan = false; //disable move camera around with right click
      console.warn('OrbitControls', this.controls, this.canvas);
    } else if (cameraControlType == 'coded') {
      // create free camera?
      window.addEventListener('mousemove', (e) => {
        this.onMouseMove(e);
      });
      window.addEventListener('resize', (e) => {
        this.onResize(e);
      });
    }

    // create rendered
    this.renderer = new WebGLRenderer({
      alpha: true,
      canvas: this.canvas as any,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.sizes.width, this.sizes.height);

    document.body.appendChild(this.renderer.domElement);

    // GLTFLoader

    // create textureLoaded - only need one
    this.textureLoader = new TextureLoader();

    //const texturesToLoad = ['assets/matcaps/pastelBlueMatcap.png','assets/matcaps/clayMatcap.jpg'];

    const textures: texturesConfig = {
      pastelMatcap: {
        path: 'assets/matcaps/pastelBlueMatcap.png',
        texture: null,
      },
      pastelTealMatcap: {
        path: 'assets/matcaps/Skeleton-Invert.png',
        texture: null,
      },
      pastelGreenMatcap: {
        path: 'assets/matcaps/pastelGreenMatcap.png',
        texture: null,
      },
      clayMatcap: {
        path: 'assets/matcaps/clayMatcap.jpg',
        texture: null,
      },
      metalMatcap: {
        path: 'assets/matcaps/metalMatcap.jpg',
        texture: null,
      },
      thyrMatcap: {
        path: 'assets/matcaps/normalMatcap.png',
        texture: null,
      },
    };
    const texturePromises: Promise<any>[] = [];

    for (const key in textures) {
      texturePromises.push(
        new Promise((r) => {
          this.textureLoader.load(textures[key].path, (x) => {
            console.warn('im loaded!', x);
            textures[key].texture = x;
            r(x);
          });
        })
      );
    }

    await Promise.all(texturePromises);
    /*
    const pastelTexture: Texture = await new Promise((r) => {
      this.textureLoader.load('assets/matcaps/pastelBlueMatcap.png', (x) => {
        console.warn('im loaded!', x);
        r(x);
      });
    });

    console.warn(pastelTexture);
*/
    //create test box
    const geometry = new BoxGeometry(1, 1, 1);

    // const material = new MeshBasicMaterial({ color: '#2196f3' }); // Simple color material
    const material = new MeshMatcapMaterial({
      matcap: textures.pastelMatcap.texture,
    }); // matcap texture material

    this.box = new Mesh(geometry, material);
    this.box.rotation.y = Math.PI / 4;
    this.box.rotation.z = Math.PI / 4;
    this.scene.add(this.box);

    // create axes helper
    const axesHelper = new AxesHelper(5);
    this.box.add(axesHelper);

    // create another box
    {
      const MClay = new MeshMatcapMaterial({
        matcap: textures.clayMatcap.texture,
      }); // matcap texture material

      this.box2 = new Mesh(new OctahedronGeometry(1, 2), MClay);
      this.box2.rotation.y = Math.PI / 4;
      this.box2.rotation.z = Math.PI / 4;

      this.box2.position.x = 2;
      this.scene.add(this.box2);
    }
    // create third  box
    {
      const MClay = new MeshMatcapMaterial({
        matcap: textures.clayMatcap.texture,
      }); // matcap texture material

      const b = new Mesh(new TorusGeometry(), MClay);
      b.rotation.y = Math.PI / 4;
      b.rotation.z = Math.PI / 4;

      b.position.x = -2;
      this.scene.add(b);
    }

    // load 3d model
    {
      const thyrMaterial = new MeshMatcapMaterial({
        matcap: textures.pastelTealMatcap.texture,
      }); // matcap texture material

      const modelLoader = new GLTFLoader();

      modelLoader.load('assets/models/tealThyr.glb', (model) => {
        console.warn({ model: model });

        model.scene.scale.set(0.05, 0.05, 0.05);

        (model.scene.children[0] as any).material = thyrMaterial;

        this.scene.add(model.scene);
      });
    }

    this.renderer.render(this.scene, this.camera);

    this.tick();
  }

  tick() {
    window.requestAnimationFrame(() => {
      this.tick();
    });

    this.delta += this.clock.getDelta();

    this.rotateTest();

    //  this.cameraTest('aroundObject');
    this.controls?.update();

    if (this.delta > this.interval) {
      // The draw or time dependent code are here
      //   this.renderer.render(this.scene, this.camera);
      this.delta = this.delta % this.interval;
    }
    this.renderer.render(this.scene, this.camera);
    this.measureFPS.atTick();
  }

  cameraTest(type: 'translateInSpace' | 'aroundObject') {
    // translate move camera
    if (type == 'translateInSpace') {
      this.camera.position.x = this.cursor.x * 2;
      this.camera.position.y = this.cursor.y * 2;
    } else if (type == 'aroundObject') {
      // roate camera around object
      this.camera.position.x = Math.sin(this.cursor.x * Math.PI * 2) * 10;
      this.camera.position.z = Math.cos(this.cursor.x * Math.PI * 2) * 10;
      this.camera.position.y = this.cursor.y * 8;

      this.camera.lookAt(this.box?.position || new Vector3());
    }

    this.camera.lookAt(this.box?.position || new Vector3());
  }

  rotateTest() {
    if (this.box) {
      this.box.rotation.y += 0.01;
    }
    if (this.box2) {
      const elapsedTime = this.clock.getElapsedTime();
      this.box2.rotation.x = elapsedTime;
    }
  }

  onMouseMove(e: MouseEvent) {
    this.cursor.x = e.clientX / this.sizes.width - 0.5;
    this.cursor.y = -(e.clientY / this.sizes.height - 0.5);
  }

  onResize(e: UIEvent) {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.setSize(this.sizes.width, this.sizes.height, true);
  }

  ngOnInit(): void {
    this.initThree('OrbitControls');
  }

  ngOnDestroy(): void {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);
  }
}
