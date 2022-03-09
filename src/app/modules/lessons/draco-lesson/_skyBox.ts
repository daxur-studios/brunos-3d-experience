import { ThreeJsEnvironment } from 'src/threeJsController';
import { BackSide, BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

export class SkyBox {
  mesh: Mesh = new Mesh();

  /**
   *
   * @param size used for skybox with height length box params
   */
  constructor(private e: ThreeJsEnvironment, private size: number) {
    this.generateSkybox();
  }
  generateSkybox() {
    //new PerspectiveCamera(0,0m0,)

    let materialArray: MeshBasicMaterial[] = [];

    //const names = ['front', 'back', 'top', 'bottom', 'right', 'left']; how it should work
    const names = [
      'back-min',
      'front-min',
      'top-min',
      'bottom-min',
      'right-min',
      'left-min',
    ]; // how it works with given nebula images
    names.forEach((name) => {
      // const path = `assets/skyboxes/mountains/${name}.jpg`;
      //  const path = `assets/skyboxes/darkNebulae/${name}.png`;
      const path = `assets/skyboxes/blueNebulae/${name}.png`;
      const texture = this.e.textureLoader.load(path);
      materialArray.push(new MeshBasicMaterial({ map: texture }));
    });

    for (let i = 0; i < 6; i++) {
      materialArray[i].side = BackSide;
    }

    const skyboxGeo = new BoxGeometry(this.size, this.size, this.size);
    const skybox = new Mesh(skyboxGeo, materialArray);

    this.mesh = skybox;

    //   this.e.scene.add(skybox);
  }
}
