import { ThreeJsWorld } from 'src/threeJsController';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Mesh,
  Points,
  PointsMaterial,
  Texture,
} from 'three';

export class TempleStars {
  mesh = new Mesh();

  constructor(
    private e: ThreeJsWorld,
    private starCount: number,
    private starSize: number,
    private radiusStart: number,
    private radiusEnd: number
  ) {
    this.init();
  }

  async init() {
    const texture = await this.e.textureLoader.loadAsync(
      'assets/particles/4.png'
    );

    const particlesGeo = new BufferGeometry();

    const count = this.starCount;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i = i + 3) {
      const pos = randomBetweenSpherePoint(
        0,
        0,
        0,
        this.radiusStart,
        this.radiusEnd
      );

      positions[i] = pos[0];
      positions[i + 1] = pos[1];
      positions[i + 2] = pos[2];

      colors[i] = randomBetween(0.1, 1, false);
      colors[i + 1] = randomBetween(0.9, 1, false);
      colors[i + 2] = randomBetween(0.9, 1, false);
    }

    particlesGeo.setAttribute('position', new BufferAttribute(positions, 3));
    particlesGeo.setAttribute('color', new BufferAttribute(colors, 3));

    const particlesMat = new PointsMaterial();
    particlesMat.size = this.starSize;
    particlesMat.sizeAttenuation = true;

    //    particlesMat.blending = AdditiveBlending;

    particlesMat.vertexColors = true;

    particlesMat.alphaMap = texture;
    particlesMat.transparent = true;
    // particlesMat.alphaTest = 0.01;
    particlesMat.depthWrite = false;

    const particles = new Points(particlesGeo, particlesMat);

    this.mesh.add(particles);
  }
}

/**
 * 
Returns a random point of a sphere, evenly distributed over the sphere.
The sphere is centered at (x0,y0,z0) with the passed in radius.
The returned point is returned as a three element array [x,y,z]. 
 */
export function randomSpherePoint(
  x0: number,
  y0: number,
  z0: number,
  radius: number
) {
  const u = Math.random();
  const v = Math.random();

  const randZ = randomBetween(-1, 1, false);

  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);

  const x =
    x0 + radius * randomBetween(-1, 1, false) * Math.sin(phi) * Math.cos(theta);

  const y =
    y0 + radius * randomBetween(-1, 1, false) * Math.sin(phi) * Math.sin(theta);

  const z = z0 + radius * randZ * Math.cos(phi);
  // const z = z0 + radius * Math.cos(phi);
  //  const z = z0 + radius * Math.cos(phi) * Math.cos(theta);
  return [x, y, z];
}
export function randomBetweenSpherePoint(
  x0: number,
  y0: number,
  z0: number,
  radiusMin: number,
  radiusMax: number
) {
  const u = Math.random();
  const v = Math.random();

  const randZ = randomBetween(-1, 1, false);

  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);

  const x =
    x0 +
    randomBetween(radiusMin, radiusMax, true) * Math.sin(phi) * Math.cos(theta);

  const y =
    y0 +
    randomBetween(radiusMin, radiusMax, true) * Math.sin(phi) * Math.sin(theta);

  const z = z0 + randomBetween(radiusMin, radiusMax, true) * Math.cos(phi);
  // const z = z0 + radius * Math.cos(phi);
  //  const z = z0 + radius * Math.cos(phi) * Math.cos(theta);
  return [x, y, z];
}

export function randomBetween(
  min: number,
  max: number,
  isWholeNumber: boolean
) {
  const rand = Math.random() * (max - min) + min;
  if (isWholeNumber) {
    return Math.round(rand);
  } else {
    return Math.random() * (max - min) + min;
  }
}
