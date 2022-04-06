import { getRandomColor, randomBetween } from 'src/app/helpers/randomFunctions';
import { ThreeJsWorld } from 'src/app/controllers/three/ThreeJsWorld.controller';
import { Mesh, MeshMatcapMaterial } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

export type ProceduralPetalParameters = {
  flowerType: 'rose' | 'tulip' | 'sunflower' | 'daisy';

  /**
   * Colors to interpolate between as gradients
   */
  petalColors: string[];
  petalCount: number;
};

export class ProceduralPetal {
  mesh = new Mesh();

  constructor(
    private w: ThreeJsWorld,
    private params: ProceduralPetalParameters
  ) {}

  /**
   * Generates Mesh
   */
  async generateMesh(randomizeParameters: boolean) {
    if (randomizeParameters) {
      this.randomizeParameters();
    }

    switch (this.params.flowerType) {
      case 'daisy':
        {
          await this.daisyGenerator();
        }
        break;
      case 'rose':
        {
          await this.roseGenerator();
        }
        break;
      case 'sunflower':
        {
          await this.sunflowerGenerator();
        }
        break;
      case 'tulip':
        {
          await this.tulipGenerator();
        }
        break;
    }
  }

  randomizeParameters() {
    this.params.petalColors =
      Math.random() > 0.5
        ? [getRandomColor(), getRandomColor()]
        : [getRandomColor(), getRandomColor(), getRandomColor()];

    this.params.petalCount = randomBetween(3, 20, true);
  }

  /**
   * more smaller petals & center bud
   */
  async daisyGenerator() {
    this.params.flowerType = 'daisy';

    const petalGLTF = await this.w.gltfLoader?.loadAsync(
      'assets/models/flowerPetal.glb'
    );
    const petalMesh = petalGLTF?.scene.children[0] as Mesh;

    const petalTexture = await this.w.textureLoader.loadAsync(
      'assets/matcaps/pastelBlueMatcap.png'
    );
    const petalMaterial = new MeshMatcapMaterial({
      map: petalTexture,
    });
    petalMesh.material = petalMaterial;

    const baseDeg = 360 / this.params.petalCount;
    for (let i = 0; i < this.params.petalCount; i++) {
      const deg = baseDeg * i;
      const p = petalMesh.clone();
      p.rotateZ(degToRad(deg));
      p.translateY(0.2);
      p.rotateX(degToRad(-5));
      p.rotateY(degToRad(5));
      this.mesh.add(p);

      console.warn(petalGLTF);
    }
  }
  /**
   * dynamic scaling larger petals & no bud
   */
  async roseGenerator() {
    this.params.flowerType = 'rose';
  }

  /**
   * enclosed petals & no bud
   */
  async tulipGenerator() {
    this.params.flowerType = 'tulip';
  }

  async sunflowerGenerator() {
    this.params.flowerType = 'sunflower';
  }
}
