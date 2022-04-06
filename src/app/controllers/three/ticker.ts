import { Clock } from 'three';

export class Ticker {
  constructor() {}

  clock = new Clock();

  set add(fn: () => void) {
    this.tickerFunctions.push(fn);
  }

  tickerFunctions: (() => void)[] = [];
}
