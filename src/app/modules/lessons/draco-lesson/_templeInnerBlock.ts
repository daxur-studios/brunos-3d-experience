import { ThreeJsEnvironment } from 'src/threeJsController';
import {
  BoxBufferGeometry,
  InstancedMesh,
  Material,
  Mesh,
  Object3D,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import gsap from 'gsap';

export type workSlot = {
  thumbnailUrl: string;
  title: string;
  description: string;
};

export namespace TempleInnerBlock {
  export const floorWidth = 3.5;
  export const floorHeight = 0.25;

  export const margin = 0.1;

  export const outerWidth = floorWidth + margin * 2;

  export const columnWidth = 0.636;

  export class MeshBuilder {
    mesh = new Mesh();

    constructor(
      private workSlot: workSlot,
      private e: ThreeJsEnvironment,
      private gltfLoader: GLTFLoader,
      private floorDepth: number,
      private templeMat: Material,
      private baseColumnMesh: Mesh
    ) {
      this.generateMesh();
    }

    columnPath = `assets/models/templeColumn.glb`;

    generateMesh() {
      // const  = new Mesh();

      // create 4 columns
      const mesh: Mesh = this.baseColumnMesh as Mesh;
      // mesh.castShadow = true;

      const dummy = new Object3D();

      const instancedColumn = new InstancedMesh(
        mesh.geometry,
        mesh.material,
        4
      );
      instancedColumn.castShadow = true;

      //  this.e.scene.add(instancedColumn);
      this.mesh.add(instancedColumn);

      const baseCoords = [
        [-1, 1],
        [-1, -1],
        [1, 1],
        [1, -1],
      ];
      const basePos = this.floorDepth / 2 - columnWidth;

      baseCoords.forEach((coord, i) => {
        dummy.position.set(
          columnWidth * 2 * coord[0],
          floorHeight / 2,
          basePos * coord[1]
        );
        dummy.updateMatrix();
        instancedColumn.setMatrixAt(i, dummy.matrix);
      });

      // create floor

      const floorBox = new BoxBufferGeometry(
        floorWidth,
        floorHeight,
        this.floorDepth
      );
      const floorMesh = new Mesh(floorBox, this.templeMat);
      this.mesh.add(floorMesh);

      return this.mesh;
    }

    spawnInAnimated(index: number, duration: number) {
      gsap.fromTo(
        this.mesh.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, delay: index / 10, duration: duration }
      );
    }
  }
}
