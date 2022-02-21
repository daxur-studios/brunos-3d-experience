import { ThreeJsEnvironment } from 'src/threeJsController';
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  SphereBufferGeometry,
  Texture,
} from 'three';

export class SolarSystem {
  params = {
    planets: 5,
    sunSize: 1,
    planetsSize: 0.5,
    outerRadius: 10,
    randomness: 0,
    placementFactor: null,
  };

  constructor(public e: ThreeJsEnvironment, private gui: dat.GUI) {}

  reset() {
    this.e.scene.clear();

    //    this.e.camera.position.y = 30;

    /**
     * GUI
     */

    if (this.gui.__folders.solarSystemParams) {
      this.gui.removeFolder(this.gui.__folders.solarSystemParams);
    }

    this.gui.addFolder('solarSystemParams');
    this.gui.__folders.solarSystemParams.open();

    this.gui.__folders.solarSystemParams
      .add(this.params, 'planets')
      .min(0)
      .max(50000)
      .step(1)
      .onFinishChange(() => this.generate());

    this.gui.__folders.solarSystemParams
      .add(this.params, 'sunSize')
      .min(0.1)
      .max(10)
      .step(0.01)
      .onFinishChange(() => this.generate());

    this.gui.__folders.solarSystemParams
      .add(this.params, 'planetsSize')
      .min(0.01)
      .max(5)
      .step(0.01)
      .onFinishChange(() => this.generate());

    this.gui.__folders.solarSystemParams
      .add(this.params, 'outerRadius')
      .min(11)
      .max(50)
      .step(1)
      .onFinishChange(() => this.generate());
  }

  async generate() {
    localStorage.particlesId = 'solarSystem';

    this.reset();

    /**
     * Generate System
     */

    // generate sun
    const sunGeo = new SphereBufferGeometry(this.params.sunSize);
    const sunMat = new MeshBasicMaterial({ color: 'red' });
    const sunMesh = new Mesh(sunGeo, sunMat);

    const planetsGeo = new BufferGeometry();

    this.e.scene.add(sunMesh);

    // generate planets
    const start = this.params.sunSize;
    const end = this.params.outerRadius;

    const twoPI = Math.PI * 2;
    const angleRadiant = twoPI / 1; // used to be branches
    const currentAngle = angleRadiant * 1; // used to be branches

    const startToEnd = end - start;
    const basePlanetToPlanetDistance = startToEnd / this.params.planets;

    const MAX_POINTS = this.params.planets * 3;

    const positions = new Float32Array(MAX_POINTS);

    for (let i = 0; i < MAX_POINTS; i = i + 3) {
      positions[i] = start + basePlanetToPlanetDistance * i;
      positions[i + 1] = 0;
      positions[i + 3] = 0;
    }

    //console.log(positions);

    // const pointsMat = new PointsMaterial({});

    planetsGeo.setAttribute('position', new BufferAttribute(positions, 3));

    /**
     * Material
     */
    const planetsMat = new PointsMaterial({
      size: this.params.planetsSize,
      sizeAttenuation: true,
      depthWrite: false,
      //   blending: AdditiveBlending,
      //    vertexColors: true,
    });

    const texture: Texture = await new Promise((r) => {
      this.e.textureLoader.load('assets/particles/programming/0.png', (t) => {
        r(t);
      });
    });

    planetsMat.alphaMap = texture;
    planetsMat.transparent = true;
    planetsMat.alphaTest = 0.001;

    /**
     * Points
     */

    const points = new Points(planetsGeo, planetsMat);
    this.e.scene.add(points);

    this.e.customTick = () => {
      //
      // const p = points.geometry.attributes.position.array;

      const t = this.e.clock.getElapsedTime();

      for (let i = 0; i < MAX_POINTS; i = i + 3) {
        const dist = start + basePlanetToPlanetDistance * i;

        positions[i + 0] = Math.sin(t * ((MAX_POINTS - i) / 10)) * dist;
        positions[i + 1] = 0;
        positions[i + 2] = Math.cos(t * ((MAX_POINTS - i) / 10)) * dist;
      }

      points.geometry.attributes.position.needsUpdate = true;

      //    points.geometry.
    };
  }

  // rotate points further away at the same rate as the ones near, like a solid disk
  diskRotation(i: number, positions: Float32Array, time: number) {
    positions[i + 0] = Math.sin(time) * (i + this.params.sunSize);
    positions[i + 1] = 0;
    positions[i + 2] = Math.cos(time) * (i + this.params.sunSize);
  }

  // rotate points closer faster, and points further away slower
  spedUpRotation(i: number, positions: Float32Array, time: number) {
    const power = i;

    positions[i + 0] = Math.sin(time + power) * (i + this.params.sunSize);
    positions[i + 1] = 0;
    positions[i + 2] = Math.cos(time + power) * (i + this.params.sunSize);
  }
}
