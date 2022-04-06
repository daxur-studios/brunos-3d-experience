/**
 * Measure Frame Rate Per Second
 *
 * HOW TO USE: create new MeasureFPS on init, and add measureFPS.atTick() inside your tick function
 *
 * use measureFPS.FPS to display current FPS
 */
export class MeasureFPS {
  constructor(private displayIntervalMS: number) {}

  public FPS: number = 60;

  public prevNow = performance.now();
  private displayTime = performance.now();

  atTick() {
    const now = performance.now();

    const fps = 1 / ((now - this.prevNow) / 1000);

    if (now - this.displayTime >= this.displayIntervalMS) {
      this.displayTime = now;
      this.FPS = Math.round(fps);
    }

    this.prevNow = now;
  }
}
