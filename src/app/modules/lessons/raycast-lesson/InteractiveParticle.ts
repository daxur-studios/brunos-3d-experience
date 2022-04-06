import { ThreeJsWorld } from 'src/app/controllers/three/ThreeJsWorld.controller';
import {
  BufferAttribute,
  BufferGeometry,
  CircleBufferGeometry,
  Mesh,
  Points,
  PointsMaterial,
  Texture,
} from 'three';
import { InteractiveObject3D } from './InteractiveObject';
import { InteractiveObjectManager } from './InteractiveObjectManager';

export class InteractiveParticle extends InteractiveObject3D {
  constructor(
    manager: InteractiveObjectManager,
    private texture: Texture,
    private colors: {
      baseColor: Float32Array;
      hoverColor: Float32Array;
    }
  ) {
    super(manager);
    this.generateMesh();
  }

  destroy() {
    this.manager.removeObject(this);
    this.clear();
    this.removeFromParent();
  }

  generateMesh() {
    const particlesGeo = new BufferGeometry();
    // const particlesGeo = new CircleBufferGeometry(0.5, 6);

    const count = 1;

    const positions = new Float32Array(count * 3);
    // const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = 0;
    }

    particlesGeo.setAttribute('position', new BufferAttribute(positions, 3));
    particlesGeo.setAttribute(
      'color',
      new BufferAttribute(this.colors.baseColor, 3)
    );

    const particlesMat = new PointsMaterial();
    particlesMat.size = 4;
    particlesMat.sizeAttenuation = true;

    particlesMat.vertexColors = true;

    particlesMat.alphaMap = this.texture;

    particlesMat.transparent = true;
    particlesMat.alphaTest = 0.001;

    const particle = new Points(particlesGeo, particlesMat);
    //particle.scale.set(0.1, 0.1, 0.1);
    this.add(particle);
    // this.mesh.add(particles);
  }
  onMouseOver(): void {}

  onMouseIn(): void {
    super.onMouseIn();
    // console.debug('onMouseIn!');

    const x = this.children[0] as Points;
    x.geometry.setAttribute(
      'color',
      new BufferAttribute(this.colors.hoverColor, 3)
    );
    //   document.body.style.cursor = 'pointer';
  }
  onMouseOut(): void {
    super.onMouseOut();
    //  console.debug('onMouseOut!');

    const x = this.children[0] as Points;
    x.geometry.setAttribute(
      'color',
      new BufferAttribute(this.colors.baseColor, 3)
    );

    // document.body.style.cursor = 'initial';
  }
}
