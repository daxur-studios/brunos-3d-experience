import { BehaviorSubject } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { SVGConfig, myCustomCircleOptions } from '../svg.model';

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css'],
})
export class SvgComponent implements OnInit {
  @Input() config!: SVGConfig;

  animatedCircles: myCustomCircleOptions[] = [];

  constructor() {}

  ngOnInit(): void {
    this.generateAnimatedCircles();
    this.tick();
  }

  generateAnimatedCircles() {
    this.animatedCircles = [];
    for (let i = 0; i < 100; i++) {
      const items = this.config.items$.value;
      const { width, height } = this.config;
      const circleOptions: myCustomCircleOptions = {
        x: Math.random() * width,
        y: Math.random() * height,
        r: 5,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2,
      };
      this.animatedCircles.push(circleOptions);
    }
  }

  tick() {
    window.requestAnimationFrame(() => {
      this.tick();
    });

    this.animatedCircles.forEach((circle) => {
      const sin = Math.sin(Date.now());
      const cos = Math.cos(Date.now());
      circle.x = circle.x + (Math.random() > 0.5 ? sin : cos) * 0.2;
      circle.y = circle.y + (Math.random() > 0.5 ? sin : cos) * 0.2;
    });
  }
}
