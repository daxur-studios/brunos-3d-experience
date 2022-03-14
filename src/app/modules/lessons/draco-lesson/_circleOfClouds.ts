import { ThreeJsWorld } from 'src/threeJsController';
import {
  AdditiveBlending,
  BoxBufferGeometry,
  DoubleSide,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneBufferGeometry,
} from 'three';
import { degToRad } from 'three/src/math/MathUtils';

import gsap from 'gsap';

export class CircleOfClouds {
  mesh = new Mesh();
  instancedMesh!: InstancedMesh;

  constructor(
    private imagePath: string,
    private numberOfClouds: number,
    private distanceFromCenter: number,
    private e: ThreeJsWorld
  ) {
    this.init();
  }

  async init() {
    const dummy = new Object3D();
    /**
     * Load Cloud Image with texture loader
     */
    //const texture = await this.e.textureLoader.loadAsync(this.imagePath);

    // Load an image file into a custom material
    const material = new MeshBasicMaterial({
      map: this.e.textureLoader.load(this.imagePath),
    });

    material.transparent = true;
    //material.depthWrite = false;
    material.alphaTest = 0.1;
    material.opacity = 0.9;
    // material.blending = AdditiveBlending;

    material.side = DoubleSide;

    const geometry = new PlaneBufferGeometry(19.2, 10.8, 1, 1);

    // combine our image geometry and material into a mesh
    // this.mesh.geometry = geometry;
    //  this.mesh.material = material;

    this.instancedMesh = new InstancedMesh(
      geometry,
      material,
      this.numberOfClouds
    );

    this.mesh.add(this.instancedMesh);
    this.mesh.position.set(0, 1, 0);

    const baseRotation = 360 / this.numberOfClouds;

    const baseDistance = this.distanceFromCenter;

    for (let i = 0; i < this.numberOfClouds; i++) {
      //add to parentMesh

      // we add 200 units of distance (the width of the section) between each.

      const rad = degToRad(baseRotation * i);

      dummy.position.set(
        Math.sin(rad) * baseDistance,
        -1,
        Math.cos(rad) * baseDistance
      );

      dummy.lookAt(this.mesh.position);
      dummy.updateMatrix();

      this.instancedMesh.setMatrixAt(i, dummy.matrix);
    }
  }

  animate() {
    this.e.ticker.add = () => {
      // animate circular motion

      this.mesh.rotation.y = this.e.ticker.clock.getElapsedTime() / 30;
    };
  }

  spawnInAnimated(index: number, duration: number) {
    gsap.fromTo(
      this.instancedMesh.material,
      { opacity: 0 },
      { opacity: 1, delay: index / 10, duration: duration }
    );
  }
}
