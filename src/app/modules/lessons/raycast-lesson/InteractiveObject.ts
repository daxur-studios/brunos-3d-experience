import { ThreeJsWorld } from 'src/app/controllers/three/ThreeJsWorld.controller';
import { Mesh, Object3D } from 'three';
import { InteractiveObjectManager } from './InteractiveObjectManager';

export abstract class InteractiveObject3D extends Object3D {
  // mesh = new Mesh();
  constructor(public manager: InteractiveObjectManager) {
    super();
    this.manager.addObject(this);
    // manager.w.events.onClickSubscribers.set(this, this);
  }
  /**
   *
   */
  onClick() {}
  /**
   *
   */
  onMouseOver() {}
  /**
   *
   */
  onMouseIn() {}
  /**
   *
   */
  onMouseOut() {}
}
