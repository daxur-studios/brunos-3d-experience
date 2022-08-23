import { Component, OnInit } from '@angular/core';
import { D } from '../svg.model';

@Component({
  selector: 'app-svg-graph',
  templateUrl: './svg-graph.component.html',
  styleUrls: ['./svg-graph.component.css'],
})
export class SvgGraphComponent implements OnInit {
  testPath = `${D.M(50, 50)} ${D.L(100, 100)} ${D.L(150, 150)} ${D.Z()}`;

  constructor() {}

  ngOnInit(): void {}

  generateWiggle(width: number, height: number) {
    return `M 0,${height / 2} C ${width / 2},0 ${
      width / 2
    },${height} ${width},${height / 2}`;
  }
  generateBlock(width: number, height: number) {
    return `M 0, 0 L 0, ${height} L ${width}, ${height} L ${width}, 0 Z`;
  }
}
