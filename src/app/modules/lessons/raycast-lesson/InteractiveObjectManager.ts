import { ThreeJsWorld } from 'src/app/controllers/three/ThreeJsWorld.controller';
import { Raycaster } from 'three';
import { InteractiveObject3D } from './InteractiveObject';

/**
 * Used for managing state of currently hovered objects in the Three.js Scene
 */
export class InteractiveObjectManager {
  hoveredObjects: Map<InteractiveObject3D, InteractiveObject3D> = new Map();
  prevHoveredObjects: Map<InteractiveObject3D, InteractiveObject3D> = new Map();

  objectsToWatch: Map<InteractiveObject3D, InteractiveObject3D> = new Map();
  _objectsToWatchArr: InteractiveObject3D[] = [];

  raycasterForMouseMove = new Raycaster();
  raycasterForClick = new Raycaster();

  constructor(public w: ThreeJsWorld) {
    this.w.ticker.add = () => {
      this.onTick();
    };
  }

  /**
   * add object to items to watch
   */
  addObject(object: InteractiveObject3D) {
    this.objectsToWatch.set(object, object);

    this._objectsToWatchArr = Array.from(this.objectsToWatch.values());
  }
  removeObject(object: InteractiveObject3D) {
    this.objectsToWatch.delete(object);
    this.prevHoveredObjects.delete(object);
    this.hoveredObjects.delete(object);

    this._objectsToWatchArr = Array.from(this.objectsToWatch.values());
  }

  /**
   * called when canvas receives a click event
   */
  onClick() {
    // cast ray from camera to current mouse pos
    this.raycasterForClick.setFromCamera(this.w.cursor, this.w.camera);

    const intersectsMouse = this.raycasterForClick.intersectObjects(
      this._objectsToWatchArr
    );

    if (intersectsMouse[0]) {
      const y = intersectsMouse[0].object.parent as InteractiveObject3D;
      if (y.onClick) {
        y.onClick();
      }
    }
  }

  /**
   * Automatically added to three world ticker in constructor
   */
  onTick() {
    // rate limit?

    this.raycasterForMouseMove.setFromCamera(this.w.cursor, this.w.camera);

    const intersectsMouse = this.raycasterForMouseMove.intersectObjects(
      this._objectsToWatchArr
    );

    this.prevHoveredObjects = new Map(this.hoveredObjects);
    this.hoveredObjects.clear();

    if (intersectsMouse[0]) {
      const x = intersectsMouse[0];

      const y = x.object.parent as InteractiveObject3D;
      this.hoveredObjects.set(y, y);

      if (y.onMouseOver) {
        y.onMouseOver();
      }

      if (!this.prevHoveredObjects.has(y) && y.onMouseIn) {
        y.onMouseIn();
      }

      if (this.prevHoveredObjects.has(y)) {
        this.prevHoveredObjects.delete(y);
        //y.onMouseOut();
      }
    }

    intersectsMouse.forEach((x) => {});

    this.prevHoveredObjects.forEach((x) => {
      x.onMouseOut();
    });

    if (this.hoveredObjects.size > 0) {
      // add pointer cursor
      this.w.canvas.style.cursor = 'pointer';
    } else {
      // remove pointer cursor?
      this.w.canvas.style.cursor = 'initial';
    }
  }
}
