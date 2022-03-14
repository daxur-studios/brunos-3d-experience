import { ThreeJsWorld } from 'src/threeJsController';
import {
  BoxBufferGeometry,
  InstancedMesh,
  Material,
  Mesh,
  Object3D,
} from 'three';
import { TempleInnerBlock as TIB, workSlot } from './_templeInnerBlock';

import gsap from 'gsap';

export namespace TempleStart {
  export const columnWidth = TIB.columnWidth;
  export const columnHeight = 3.77;
  export const columnCount = 6;

  const floorWidth = TIB.floorWidth / 2;
  const outerWidth = floorWidth + TIB.margin * 2;

  export class MeshBuilder {
    mesh = new Mesh();

    outerWidth = outerWidth;

    constructor(
      private templeMat: Material,
      private baseColumnMesh: Mesh,
      private baseRoofMesh: Mesh
    ) {
      this.init();
    }
    init() {
      /**
       * Create Instanced Columns
       */
      {
        //gltf.scene.castShadow = true;
        //gltf.scene.children[0].castShadow = true;

        //   const mat = new MeshStandardMaterial({ color: '#9e9e9e' });
        const mesh: Mesh = this.baseColumnMesh;
        mesh.castShadow = true;

        const dummy = new Object3D();

        const instancedColumn = new InstancedMesh(
          mesh.geometry,
          mesh.material,
          columnCount
        );
        instancedColumn.castShadow = true;

        this.mesh.add(instancedColumn);

        const totalWidth = columnWidth * columnCount * 2;
        const centerOffset = (totalWidth / 2 - columnWidth) * -1;

        for (var i = 0; i < columnCount; i++) {
          // we add 200 units of distance (the width of the section) between each.
          var xStaticPosition = i * (columnWidth * 2) + centerOffset;

          dummy.position.set(
            -(floorWidth / 2 - TIB.columnWidth),
            0,
            xStaticPosition
          );
          dummy.updateMatrix();
          instancedColumn.setMatrixAt(i, dummy.matrix);
        }

        /*
        // end columns
        for (var i = columnCount; i < instancedColumn.count; i++) {
          const baseI = i - columnCount;
          // we add 200 units of distance (the width of the section) between each.
          var xStaticPosition = baseI * (columnWidth * 2) + centerOffset;
          dummy.position.set(-16, 0, xStaticPosition);
          dummy.updateMatrix();
          instancedColumn.setMatrixAt(i, dummy.matrix);
        }
*/
        instancedColumn.instanceMatrix.needsUpdate = true;

        /**
         * Create Roof
         */
        //gltf.scene.castShadow = true;
        {
          //   const mat = new MeshStandardMaterial({ color: '#9e9e9e' });
          const bRMesh: Mesh = this.baseRoofMesh;

          const dummy = new Object3D();

          const instancedRoof = new InstancedMesh(
            bRMesh.geometry,
            bRMesh.material,
            1
          );
          instancedRoof.castShadow = true;

          this.mesh.add(instancedRoof);

          //  const offset = (TIB.outerWidth * this.workBlocks.length) / 2;

          // const test = [16, -16];

          for (var i = 0; i < instancedRoof.count; i++) {
            // we add 200 units of distance (the width of the section) between each.

            dummy.position.set(
              -(floorWidth / 2 - TIB.columnWidth),
              columnHeight,
              0
            );
            dummy.updateMatrix();
            instancedRoof.setMatrixAt(i, dummy.matrix);

            // add floor boxes
            const floorHeight = TIB.floorHeight;
            const floorBox = new BoxBufferGeometry(
              floorWidth,
              floorHeight,
              columnCount * 2 * columnWidth
            );
            const floorMesh = new Mesh(floorBox, this.templeMat);
            floorMesh.position.set(0, (floorHeight * -1) / 2, 0);

            this.mesh.add(floorMesh);
          }
          instancedRoof.instanceMatrix.needsUpdate = true;
        }
      }
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
