import { randomBetween } from 'src/app/helpers/randomFunctions';
import { ThreeJsWorld } from 'src/app/controllers/three/ThreeJsWorld.controller';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  Points,
  PointsMaterial,
} from 'three';

export class TempleGalaxy {
  mesh = new Mesh();

  constructor(
    private e: ThreeJsWorld,
    private count: number,
    private size: number,
    private radius: number,
    private branches: number,
    private spinPower: number,
    private spinFactor: number,
    private randomness: number,
    private randomnessFactor: number,

    private insideColor: string,
    private outsideColor: string
  ) {
    this.init();
  }

  init() {
    const geo = new BufferGeometry();

    const r = this.radius;
    const twoPI = Math.PI * 2;
    /**
     * Positions
     */

    const pointsPerBranch = Math.round((this.count * 3) / this.branches);

    //  const positions = new Float32Array(this.count * 3);
    const positions = new Float32Array(pointsPerBranch * this.branches);

    const colors = new Float32Array(pointsPerBranch * this.branches);

    // loop per galaxy branch
    const angleRadiant = twoPI / this.branches;
    const pointsDistance = r / pointsPerBranch;

    const insideColor = new Color(this.insideColor);
    const outsideColor = new Color(this.outsideColor);

    // loop for branches
    for (let branchIndex = 0; branchIndex < this.branches; branchIndex++) {
      // loop for points per branch
      for (
        let pointIndex = 0;
        pointIndex < pointsPerBranch * 3;
        pointIndex = pointIndex + 3
      ) {
        const i3 = pointsPerBranch * branchIndex + pointIndex;
        const currentAngle = angleRadiant * branchIndex;

        // const spinFactor = 1;
        let spin = (1 - pointIndex / pointsPerBranch) * this.spinFactor;

        spin = spin ** this.spinPower;
        //+spinFactor;
        const randomness = this.randomness;
        const randomnessFactor = this.randomnessFactor;

        const randomnessX =
          Math.pow(randomBetween(0, 1, false), randomnessFactor) *
          randomBetween(-1, 1, false) *
          randomness;

        const randomnessY =
          Math.pow(randomBetween(0, 1, false), randomnessFactor) *
          randomBetween(-1, 1, false) *
          randomness;

        const randomnessZ =
          Math.pow(randomBetween(0, 1, false), randomnessFactor) *
          randomBetween(-1, 1, false) *
          randomness;

        const basePointPos = pointsDistance * pointIndex; // Base Equally Distributed Point Position Along Axis

        const x = basePointPos * Math.sin(currentAngle + spin) + randomnessX;
        const y = basePointPos * Math.cos(currentAngle + spin) + randomnessY;

        positions[i3 + 0] = x; // (Math.random() - 0.5) * 3;
        positions[i3 + 1] = randomnessZ; // / 5; //Math.random() * this.thicknessFactor; //(Math.random() - 0.5) * 3;
        positions[i3 + 2] = y; //(Math.random() - 0.5) * 3;

        // Color
        const mixedColor = insideColor.clone();

        // mixedColor.lerp(outsideColor, pointsPerBranch / pointIndex);

        mixedColor.lerp(outsideColor, basePointPos / this.radius);

        colors[i3 + 0] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }
    }

    console.log(positions, { pointsPerBranch });
    geo.setAttribute('position', new BufferAttribute(positions, 3));

    geo.setAttribute('color', new BufferAttribute(colors, 3));
    /**
     * Material
     */
    const mat = new PointsMaterial({
      size: this.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: AdditiveBlending,
      vertexColors: true,
    });

    /**
     * Points
     */

    const points = new Points(geo, mat);
    this.mesh.add(points);
  }

  spin() {
    this.e.ticker.add = () => {
      // animate circular motion

      this.mesh.rotation.y = -this.e.ticker.clock.getElapsedTime() / 30;
    };
  }

  spawnIn() {
    // animate GSAP scale in
  }
}
