import { ThreeJsWorld } from 'src/threeJsController';
import {
  BufferAttribute,
  Material,
  Mesh,
  Points,
  PointsMaterial,
  SphereBufferGeometry,
} from 'three';
import { randomBetween } from './_stars';

import gsap from 'gsap';

export class BrunoPoints {
  mesh = new Mesh();

  //particlesMat!: PointsMaterial;
  particles!: Points;

  loadedPromise: Promise<void>;

  constructor(
    private e: ThreeJsWorld,
    private starSize: number,

    private baseMesh: Mesh
  ) {
    this.loadedPromise = new Promise(async (r) => {
      await this.init();
      r();
    });
  }

  async init() {
    const texture = await this.e.textureLoader.loadAsync(
      'assets/particles/4.png'
    );

    const particlesGeo = this.baseMesh.geometry.clone(); // new SphereBufferGeometry();

    const positions = particlesGeo.attributes.position.array;

    const colors = new Float32Array(positions.length);

    for (let i = 0; i < positions.length; i = i + 1) {
      const x = particlesGeo.attributes.position.getX(i + 0);
      const y = particlesGeo.attributes.position.getY(i + 0);
      const z = particlesGeo.attributes.position.getZ(i + 0);
      //  positions[i]
      // particlesGeo.attributes.position.setX(i, x);
      // particlesGeo.attributes.position.setX(i, x);

      particlesGeo.attributes.position.setXYZ(
        i,
        x + randomBetween(-1, 1, false) / 20,
        y + randomBetween(-1, 1, false) / 10,
        z + randomBetween(0, 0.2, false) / 0.9
      ); // alternate

      /*
      colors[i] = randomBetween(0.9, 1, false);
      colors[i + 1] = randomBetween(0.1, 1, false);
      colors[i + 2] = randomBetween(0.1, 1, false);*/
    }

    /**
     * colors
     */
    for (let i = 0; i < positions.length; i = i + 3) {
      colors[i] = randomBetween(0.1, 1, false);
      colors[i + 1] = randomBetween(0.9, 1, false);
      colors[i + 2] = randomBetween(0.9, 1, false);
    }

    particlesGeo.attributes.position.needsUpdate = true; // only required if geometry previously-rendered

    const particlesMat = new PointsMaterial();

    particlesMat.size = this.starSize;

    particlesGeo.setAttribute('color', new BufferAttribute(colors, 3));

    particlesMat.sizeAttenuation = true;

    //    particlesMat.blending = AdditiveBlending;

    particlesMat.vertexColors = true;

    particlesMat.alphaMap = texture;
    // particlesMat.opacity = 0.9;
    particlesMat.transparent = true;
    // particlesMat.alphaTest = 0.01;
    particlesMat.depthWrite = false;

    //particlesMat.sizeAttenuation = false;

    this.particles = new Points(particlesGeo, particlesMat);

    const particles = this.particles;

    this.mesh.add(particles);

    //  (particles.material as any).opacity = 0.1;

    /*
    gsap.fromTo(
      particles.material,
      { opacity: 0 },
      { opacity: 1, delay: 1 / 10, duration: 5 }
    );
*/
    // env.scene.add(particles);
  }
  async spawnInAnimated(index: number, duration: number) {
    await this.loadedPromise;
    console.error(this.particles.material);
    gsap.fromTo(
      this.particles.material,
      { opacity: 0 },
      { opacity: 1, delay: index / 10, duration: duration }
    );
  }
}
