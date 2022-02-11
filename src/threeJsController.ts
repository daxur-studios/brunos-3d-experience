// Option 2: Import just the parts you need.
import {
  AxesHelper,
  Clock,
  MeshMatcapMaterial,
  PerspectiveCamera,
  Scene,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import gsap from 'gsap';

export type textureConfig = {
  path: string;
  texture: Texture | null;
};
export type texturesConfig = {
  [name: string]: textureConfig;
};

/**
 * Measure Frame Rate Per Second
 *
 * HOW TO USE: create new MeasureFPS on init, and add measureFPS.atTick() inside your tick function
 *
 * use measureFPS.FPS to display current FPS
 */
export class MeasureFPS {
  constructor(private displayIntervalMS: number) {}

  public FPS: number = 60;

  public prevNow = performance.now();
  private displayTime = performance.now();

  atTick() {
    const now = performance.now();

    const fps = 1 / ((now - this.prevNow) / 1000);

    if (now - this.displayTime >= this.displayIntervalMS) {
      this.displayTime = now;
      this.FPS = Math.round(fps);
    }

    this.prevNow = now;
  }
}

type sizes = {
  width: number;
  height: number;
};
type cursor = {
  x: number;
  y: number;
};

type resizeConfig = {
  resizeable: boolean;
  evalWidth?: string;
  evalHeight?: string;
};

type cameraConfig = {
  hasCamera: boolean;
  fov?: number;
  near?: number;
  far?: number;
  position?: Vector3;
};

/**
 * Basic Three Js Controller, with camera and FPS measurer
 *
 *
 * use measureFPS.FPS to display current FPS
 */
export class ThreeJsEnvironment {
  measureFPS = new MeasureFPS(this.fpsInterval);

  scene!: Scene;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  textureLoader!: TextureLoader;

  controls?: OrbitControls;

  cursor: cursor = {
    x: 0,
    y: 0,
  };

  //  canvas?: HTMLElement | null;

  reqFrameId: number = 0;

  constructor(
    public sizes: sizes,
    private fpsInterval: number,
    private resizeConfig: resizeConfig,
    private cameraConfig: cameraConfig,
    public canvas: HTMLCanvasElement
  ) {
    this.createCamera();
  }

  createCamera() {
    if (this.cameraConfig.hasCamera) {
      // create camera
      this.camera = new PerspectiveCamera(
        this.cameraConfig.fov || 50,
        this.sizes.width / this.sizes.height,
        this.cameraConfig.near || 0.1,
        this.cameraConfig.far || 1000
      );

      this.camera.position.z = 3;
    }
  }

  async init3D(cameraControlType: 'OrbitControls') {
    this.canvas.addEventListener('mousemove', (e) => {
      this.onMouseMove(e);
    });
    window.addEventListener('resize', (e) => {
      this.onResize(e);
    });

    // create scene
    this.scene = new Scene();

    //  this.canvas = document.getElementById('threeJsCanvas');

    // create orbit controls
    if (cameraControlType == 'OrbitControls' && this.canvas) {
      this.controls = new OrbitControls(this.camera, this.canvas);
      this.controls.enableDamping = true;

      this.controls.enablePan = false; //disable move camera around with right click
      console.warn('OrbitControls', this.controls, this.canvas);
    }

    // create rendered
    this.renderer = new WebGLRenderer({
      alpha: true,
      canvas: this.canvas as any,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.sizes.width, this.sizes.height);

    //  document.body.appendChild(this.renderer.domElement);

    // GLTFLoader

    // create textureLoaded - only need one
    this.textureLoader = new TextureLoader();

    //const texturesToLoad = ['assets/matcaps/pastelBlueMatcap.png','assets/matcaps/clayMatcap.jpg'];

    const textures: texturesConfig = {
      pastelTealMatcap: {
        path: 'assets/matcaps/Skeleton-Invert.png',
        texture: null,
      },
    };
    const texturePromises: Promise<any>[] = [];

    for (const key in textures) {
      texturePromises.push(
        new Promise((r) => {
          this.textureLoader.load(textures[key].path, (x) => {
            textures[key].texture = x;
            r(x);
          });
        })
      );
    }

    await Promise.all(texturePromises);

    // load 3d model
    if (false) {
      const thyrMaterial = new MeshMatcapMaterial({
        matcap: textures.pastelTealMatcap.texture,
      }); // matcap texture material

      const modelLoader = new GLTFLoader();

      modelLoader.load('assets/models/tealThyr.glb', (model) => {
        console.warn({ model: model });

        model.scene.scale.set(0.03, 0.03, 0.03);
        //   model.scene.position.x = -2;
        model.scene.position.y = -0.6;
        model.scene.rotateY(90);

        const t = model.scene.children[0];

        this.camera.lookAt(t.position);

        (t as any).material = thyrMaterial;

        this.scene.add(model.scene);

        gsap.fromTo(
          this.scene.scale,
          { x: 0, y: 0, z: 0, duration: 1 },
          { z: 1, y: 1, x: 1, delay: 1 }
        );
      });
    }

    this.renderer.render(this.scene, this.camera);

    this.tick();
  }

  clock: Clock = new Clock();
  tick() {
    this.reqFrameId = window.requestAnimationFrame(() => {
      this.tick();
    });

    this.customTick();

    this.controls?.update();

    // const elapsedTime = this.clock.getElapsedTime();

    // this.scene.rotation.y = elapsedTime / 5 - 1.4; add to after super.tick(); on other classes;

    this.renderer.render(this.scene, this.camera);

    this.measureFPS.atTick();
  }

  customTick() {
    // KEEP EMPTY -> replace with custom function in ngOnInit page
  }

  destroy(): void {
    window.cancelAnimationFrame(this.reqFrameId);

    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);

    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.canvas?.parentNode?.removeChild(this.canvas);
  }

  onMouseMove(e: MouseEvent) {
    this.cursor.x = (e.offsetX / this.sizes.width) * 2 - 1;
    this.cursor.y = -((e.offsetY / this.sizes.height) * 2 - 1);

    console.log(this.cursor, e);
  }

  onResize(e: UIEvent) {
    if (this.resizeConfig.resizeable) {
      this.sizes.width = this.resizeConfig.evalWidth
        ? eval(this.resizeConfig.evalWidth)
        : window.innerWidth;
      this.sizes.height = this.resizeConfig.evalHeight
        ? eval(this.resizeConfig.evalHeight)
        : window.innerHeight;

      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      this.renderer.setSize(this.sizes.width, this.sizes.height, true);
    }
  }
}

/**
 * Basic Three Js Controller, with camera and FPS measurer
 *
 * HOW TO USE: create new MeasureFPS on init, and add measureFPS.atTick() inside your tick function
 *
 * use measureFPS.FPS to display current FPS
 */
export class BasicThreeJsController extends ThreeJsEnvironment {
  constructor(
    public sizes: sizes,
    fpsInterval: number,
    resizeConfig: resizeConfig,
    cameraConfig: cameraConfig,
    canvas: HTMLCanvasElement
  ) {
    super(sizes, fpsInterval, resizeConfig, cameraConfig, canvas);
  }

  init(): void {
    this.init3D('OrbitControls');
  }
}

export class Basic3DWithRaycaster extends ThreeJsEnvironment {
  constructor(
    public sizes: sizes,
    fpsInterval: number,
    resizeConfig: resizeConfig,
    cameraConfig: cameraConfig,
    canvas: HTMLCanvasElement
  ) {
    super(sizes, fpsInterval, resizeConfig, cameraConfig, canvas);
  }
}
