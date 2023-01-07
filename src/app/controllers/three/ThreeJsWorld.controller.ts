// Option 2: Import just the parts you need.
import {
  AmbientLight,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  Uniform,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

//import gsap from 'gsap';

import { Ticker } from './ticker';
//import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { BehaviorSubject } from 'rxjs';
import { MeasureFPS } from './MeasureFPS';
import { InteractiveObjectManager } from 'src/app/modules/lessons/raycast-lesson/InteractiveObjectManager';

//import type * as gsap from 'gsap';

import type { gsap } from 'gsap';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

type sizes = {
  width: number;
  height: number;
};
type cursor = {
  x: number;
  y: number;
};

type environmentConfig = {
  WebGLRendererAlpha: boolean;
  fpsInterval: number;
};

type resizeConfig = {
  resizable: boolean;
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

type worldEvents = {
  // click$: BehaviorSubject<{ x: number; y: number } | null>;
  onClickSubscribers: Map<any, { onClick: () => void; [any: string]: any }>;
};

/**
 * Basic Three Js Scene & Renderer & Camera & Orbit Controller, as wel las FPS measurer
 *
 *
 * use measureFPS.FPS to display current FPS
 */
export class ThreeJsWorld {
  measureFPS = new MeasureFPS(this.environmentConfig.fpsInterval);

  scene!: Scene;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  textureLoader!: TextureLoader;

  // gltfLoader?: GLTFLoader;
  // dracoLoader?: DRACOLoader;

  controls?: OrbitControls;

  cursor: cursor = {
    x: 0,
    y: 0,
  };

  uniforms: { [key: string]: Partial<Uniform> } = { time: { value: 0 } };

  //  canvas?: HTMLElement | null;

  // reqFrameId: number = 0;

  constructor(
    public sizes: sizes,
    private environmentConfig: environmentConfig,

    private resizeConfig: resizeConfig,
    private cameraConfig: cameraConfig,
    public canvas: HTMLCanvasElement,
    public gltfLoader?: GLTFLoader
  ) {
    this.createCamera();

    /**
     *  CREATE DRACO LOADER
     */
    if (this.gltfLoader) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('assets/draco/'); // use Web Assembly version
      this.gltfLoader!.setDRACOLoader(dracoLoader);
    }
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

  /**
   * Starts the ticker function (requestAnimationFrame)
   *
   * Adds Orbit controls? TO DO: implement other way of camera controls
   *
   * Adds event listeners, such as mouse move and resize,
   *
   * Creates TextrureLoader
   *
   * Inits WebGL renderer
   *
   * @param cameraControlType - implement player class and remove from here??
   */
  async initWorld(
    cameraControlType: 'OrbitControls',
    ambientLightConfig?: { intensity: number }
  ) {
    this.canvas.addEventListener('mousemove', (e) => {
      this.onMouseMove(e);
    });

    this.canvas.addEventListener('click', (e) => {
      this.onClick(e);
    });

    window.addEventListener('resize', (e) => {
      this.onResize(e);
    });

    // create scene
    this.scene = new Scene();

    if (ambientLightConfig) {
      this._ambientLightConfig = ambientLightConfig;
      this.addAmbientLighting();
    }

    //  this.canvas = document.getElementById('threeJsCanvas');

    // create orbit controls
    if (cameraControlType == 'OrbitControls' && this.canvas) {
      this.controls = new OrbitControls(this.camera, this.canvas);
      this.controls.enableDamping = true;

      this.controls.enablePan = false; //disable move camera around with right click
      //  console.warn('OrbitControls', this.controls, this.canvas);
    }

    // create rendered
    this.renderer = new WebGLRenderer({
      alpha: this.environmentConfig.WebGLRendererAlpha,
      canvas: this.canvas as any,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.sizes.width, this.sizes.height);

    //  document.body.appendChild(this.renderer.domElement);

    // GLTFLoader

    // create textureLoaded - only need one
    this.textureLoader = new TextureLoader();

    this.renderer.render(this.scene, this.camera);

    this.tick();
  }

  private _ambientLightConfig?: { intensity: number };
  private _ambientLight?: AmbientLight;
  /**
   * Adds lighting for pysical materials
   */
  addAmbientLighting() {
    if (this._ambientLight) {
      this._ambientLight.intensity = 0;
      this._ambientLight.visible = false;
      this._ambientLight.layers.toggle(0);

      this.scene.remove(this._ambientLight);
      this._ambientLight = null as any;
    }
    this._ambientLight = new AmbientLight(
      undefined,
      this._ambientLightConfig?.intensity
    );
    this.scene.add(this._ambientLight);
  }

  ticker = new Ticker();

  tick() {
    this.renderer.setAnimationLoop(() => {
      this.tick();
    });

    // this.reqFrameId = window.requestAnimationFrame(() => {
    //   this.tick();
    // });

    this.customTick();

    this.uniforms.time.value = this.ticker.clock.getElapsedTime();

    this.ticker.tickerFunctions.forEach((fn) => {
      fn();
    });

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
    //  window.cancelAnimationFrame(this.reqFrameId);

    this.renderer.setAnimationLoop(null);

    window.removeEventListener('resize', this.onResize);

    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('click', this.onClick);

    this.camera.clear();

    this.scene.clear();
    /*
    if (this.dracoLoader) {
      this.dracoLoader.dispose();
      this.dracoLoader = undefined;
    }
*/
    if (this.gltfLoader) {
      this.gltfLoader.dracoLoader?.dispose?.();
      this.gltfLoader = undefined;
    }

    //this.scene.ch

    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.canvas?.parentNode?.removeChild(this.canvas);
  }

  onMouseMove(e: MouseEvent) {
    this.cursor.x = (e.offsetX / this.sizes.width) * 2 - 1;
    this.cursor.y = -((e.offsetY / this.sizes.height) * 2 - 1);
  }

  onClick(e: MouseEvent) {
    if (this._interactiveObjectManager) {
      this._interactiveObjectManager.onClick();
    }
  }

  onResize(e: UIEvent) {
    if (this.resizeConfig.resizable) {
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

  _interactiveObjectManager?: InteractiveObjectManager;
  getInteractiveObjectManager() {
    if (!this._interactiveObjectManager) {
      this._interactiveObjectManager = new InteractiveObjectManager(this);
    }
    return this._interactiveObjectManager;
  }

  _gsap?: typeof gsap;
  /**
   * imports gsap asynchronously
   */
  async getGsap() {
    if (!this._gsap) {
      this._gsap = (await import('gsap')).gsap;
    }

    return this._gsap;
  }
}
