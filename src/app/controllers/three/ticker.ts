import { Clock } from 'three';

/**
 * To be used with ThreeJsWorldController
 */
export class Ticker {
  constructor() {}

  clock = new Clock();

  set add(fn: () => void) {
    this.tickerFunctions.push(fn);
  }

  tickerFunctions: (() => void)[] = [];
}
