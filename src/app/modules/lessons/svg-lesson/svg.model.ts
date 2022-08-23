import { BehaviorSubject } from 'rxjs';

export interface ToolbarItem {
  label: string;
  path: string;
  matIcon: string;
}

export interface SVGConfig {
  width: number;
  height: number;
  sizes$: BehaviorSubject<{ width: number; height: number }>;

  items$: BehaviorSubject<ToolbarItem[]>;

  backgroundFill?: string;
  backgroundStroke?: string;
  backgroundStrokeWidth?: number;
}

export interface myCustomCircleOptions {
  x: number;
  y: number;
  r: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

export interface myCustomShapeOptions {
  d: string;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

/**
 * Use this class to generate SVG path strings
 */
export class D {
  constructor() {}

  static joinCoords(items: string[]) {
    return items.join(' ');
  }

  /**
   * Move
   */
  static M(x: number, y: number) {
    return `M ${x},${y}`;
  }
  /**
   * Line
   */
  static L(x: number, y: number) {
    return `L ${x},${y}`;
  }
  /**
   * Close Path
   */
  static Z() {
    return 'Z';
  }
  /**
   * Vertical line
   */
  static V(a: number) {
    return `V ${a}`;
  }
  /**
   * Horizontal line
   */
  static H(a: number) {
    return `H ${a}`;
  }
}

class SvgBox {
  coords: string[] = [];
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    this.coords.push(D.M(x, y));
    this.coords.push(D.L(x, y + height));
    this.coords.push(D.L(x + width, y + height));
    this.coords.push(D.L(x + width, y));
    this.coords.push(D.Z());
  }
}
